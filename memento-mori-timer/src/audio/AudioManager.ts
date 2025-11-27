class AudioManager {
  private static instance: AudioManager | null = null;
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  // Audio nodes
  private brownNoiseSource: AudioBufferSourceNode | null = null;
  private brownNoiseGain: GainNode | null = null;
  private brownNoiseFilter: BiquadFilterNode | null = null;

  private shepardOscillators: OscillatorNode[] = [];
  private shepardGain: GainNode | null = null;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Handle suspended state (required by browser autoplay policies)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log("Audio context initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  public getAudioContextState(): string {
    return this.audioContext?.state || "not-initialized";
  }

  public async resumeAudioContext(): Promise<boolean> {
    if (!this.audioContext) {
      console.warn("Audio context not created");
      return false;
    }

    try {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
        console.log("Audio context resumed");
        return true;
      }
      return true;
    } catch (error) {
      console.error("Failed to resume audio context:", error);
      return false;
    }
  }

  public startBrownNoise(): void {
    if (!this.audioContext || !this.isInitialized) {
      console.warn("Audio context not initialized");
      return;
    }

    // Stop existing brown noise if playing
    this.stopBrownNoise();

    // Generate brown noise buffer
    const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    // Generate brown noise using random walk
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Amplify
    }

    // Create audio nodes
    this.brownNoiseSource = this.audioContext.createBufferSource();
    this.brownNoiseSource.buffer = buffer;
    this.brownNoiseSource.loop = true;

    // Create low-pass filter at 500Hz
    this.brownNoiseFilter = this.audioContext.createBiquadFilter();
    this.brownNoiseFilter.type = "lowpass";
    this.brownNoiseFilter.frequency.value = 500;

    // Create gain node at -20dB
    this.brownNoiseGain = this.audioContext.createGain();
    this.brownNoiseGain.gain.value = 0.1; // -20dB ≈ 0.1

    // Connect nodes: source -> filter -> gain -> destination
    this.brownNoiseSource.connect(this.brownNoiseFilter);
    this.brownNoiseFilter.connect(this.brownNoiseGain);
    this.brownNoiseGain.connect(this.audioContext.destination);

    // Start playback
    this.brownNoiseSource.start();
  }

  public stopBrownNoise(): void {
    if (this.brownNoiseSource) {
      try {
        this.brownNoiseSource.stop();
      } catch (error) {
        // Ignore if already stopped
      }
      this.brownNoiseSource.disconnect();
      this.brownNoiseSource = null;
    }

    if (this.brownNoiseFilter) {
      this.brownNoiseFilter.disconnect();
      this.brownNoiseFilter = null;
    }

    if (this.brownNoiseGain) {
      this.brownNoiseGain.disconnect();
      this.brownNoiseGain = null;
    }
  }

  public startShepardTone(): void {
    if (!this.audioContext || !this.isInitialized) {
      console.warn("Audio context not initialized");
      return;
    }

    // Stop existing Shepard tone if playing
    this.stopShepardTone();

    // Create gain node for Shepard tone (starts at -40dB)
    this.shepardGain = this.audioContext.createGain();
    this.shepardGain.gain.value = 0.01; // -40dB ≈ 0.01
    this.shepardGain.connect(this.audioContext.destination);

    // Create 4 oscillators at octave intervals
    const baseFrequencies = [110, 220, 440, 880];

    baseFrequencies.forEach((freq) => {
      const oscillator = this.audioContext!.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      // Create individual gain for envelope fading
      const oscGain = this.audioContext!.createGain();
      oscGain.gain.value = 0.25; // Divide by 4 oscillators

      oscillator.connect(oscGain);
      oscGain.connect(this.shepardGain!);

      oscillator.start();
      this.shepardOscillators.push(oscillator);

      // Implement frequency sweeping
      this.sweepFrequency(oscillator, freq);
    });
  }

  private sweepFrequency(oscillator: OscillatorNode, startFreq: number): void {
    if (!this.audioContext) return;

    const sweepDuration = 10; // 10 seconds per octave
    const targetFreq = startFreq * 2; // One octave up

    oscillator.frequency.exponentialRampToValueAtTime(
      targetFreq,
      this.audioContext.currentTime + sweepDuration
    );

    // Loop the sweep
    setTimeout(() => {
      if (this.shepardOscillators.includes(oscillator)) {
        oscillator.frequency.value = startFreq;
        this.sweepFrequency(oscillator, startFreq);
      }
    }, sweepDuration * 1000);
  }

  public updateShepardVolume(urgency: number): void {
    if (!this.shepardGain || !this.audioContext) {
      return;
    }

    // Map urgency (0-1) to volume range (-40dB to -10dB)
    // -40dB ≈ 0.01, -10dB ≈ 0.316
    const minGain = 0.01;
    const maxGain = 0.316;
    const targetGain = minGain + urgency * (maxGain - minGain);

    // Smooth transition
    this.shepardGain.gain.linearRampToValueAtTime(
      targetGain,
      this.audioContext.currentTime + 0.1
    );
  }

  public stopShepardTone(): void {
    this.shepardOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (error) {
        // Ignore if already stopped
      }
      osc.disconnect();
    });
    this.shepardOscillators = [];

    if (this.shepardGain) {
      this.shepardGain.disconnect();
      this.shepardGain = null;
    }
  }

  public playClickSound(): void {
    if (!this.audioContext || !this.isInitialized) {
      console.warn("Audio context not initialized");
      return;
    }

    // Create oscillator for thud sound
    const oscillator = this.audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.value = 80; // Low frequency thud

    // Create gain node with envelope
    const gain = this.audioContext.createGain();
    gain.gain.value = 0.316; // -10dB ≈ 0.316

    // Apply envelope: instant attack, 50ms decay
    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(0.316, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); // 50ms decay

    // Connect nodes
    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);

    // Play sound
    oscillator.start(now);
    oscillator.stop(now + 0.05);

    // Clean up after sound finishes
    setTimeout(() => {
      oscillator.disconnect();
      gain.disconnect();
    }, 100);
  }

  public playCompletionSound(): void {
    if (!this.audioContext || !this.isInitialized) {
      console.warn("Audio context not initialized");
      return;
    }

    // Create a bell-like completion sound with multiple harmonics
    const now = this.audioContext.currentTime;
    const duration = 1.5; // 1.5 seconds

    // Create three oscillators for a bell-like tone
    const frequencies = [440, 880, 1320]; // A4 and harmonics

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      const gain = this.audioContext!.createGain();
      // Decreasing volume for higher harmonics
      const initialGain = 0.2 / (index + 1);
      gain.gain.setValueAtTime(initialGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscillator.connect(gain);
      gain.connect(this.audioContext!.destination);

      oscillator.start(now);
      oscillator.stop(now + duration);

      // Clean up
      setTimeout(() => {
        oscillator.disconnect();
        gain.disconnect();
      }, duration * 1000 + 100);
    });
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public isAudioInitialized(): boolean {
    return this.isInitialized;
  }

  public hasAudioSupport(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }
}

export default AudioManager;
