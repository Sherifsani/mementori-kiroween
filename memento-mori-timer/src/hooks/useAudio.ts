import { useEffect, useRef, useState } from "react";
import { useTimerStore } from "../store/timerStore";
import AudioManager from "../audio/AudioManager";

interface UseAudioOptions {
  onButtonClick?: () => void;
}

export const useAudio = (options: UseAudioOptions = {}) => {
  const audioManagerRef = useRef<AudioManager | null>(null);
  const isInitializedRef = useRef(false);
  const shepardToneActiveRef = useRef(false);
  const brownNoiseActiveRef = useRef(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  const [hasAudioSupport, setHasAudioSupport] = useState(true);

  const { timeRemaining, isRunning } = useTimerStore();

  // Initialize audio manager on mount
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioManagerRef.current = AudioManager.getInstance();

        // Check if audio is supported
        if (!audioManagerRef.current.hasAudioSupport()) {
          console.warn("Web Audio API not supported");
          setHasAudioSupport(false);
          setAudioError("Audio not supported in this browser");
          return;
        }

        await audioManagerRef.current.init();
        isInitializedRef.current = true;
        setAudioError(null);
      } catch (error) {
        console.error("Failed to initialize audio:", error);
        setAudioError("Failed to initialize audio");
        isInitializedRef.current = false;

        // Check if it's a suspended state issue
        if (
          audioManagerRef.current &&
          audioManagerRef.current.getAudioContextState() === "suspended"
        ) {
          setNeedsUserInteraction(true);
        }
      }
    };

    initAudio();

    // Cleanup on unmount
    return () => {
      if (audioManagerRef.current) {
        audioManagerRef.current.stopBrownNoise();
        audioManagerRef.current.stopShepardTone();
      }
    };
  }, []);

  // Start/stop brown noise based on timer running state
  useEffect(() => {
    if (!audioManagerRef.current || !isInitializedRef.current) {
      return;
    }

    if (isRunning && !brownNoiseActiveRef.current) {
      audioManagerRef.current.startBrownNoise();
      brownNoiseActiveRef.current = true;
    } else if (!isRunning && brownNoiseActiveRef.current) {
      audioManagerRef.current.stopBrownNoise();
      brownNoiseActiveRef.current = false;
    }
  }, [isRunning]);

  // Handle Shepard tone based on time remaining
  useEffect(() => {
    if (!audioManagerRef.current || !isInitializedRef.current || !isRunning) {
      return;
    }

    // Start Shepard tone when time remaining is 60 seconds or less
    if (timeRemaining <= 60 && timeRemaining > 0) {
      if (!shepardToneActiveRef.current) {
        audioManagerRef.current.startShepardTone();
        shepardToneActiveRef.current = true;
      }

      // Update volume based on urgency (0 at 60s, 1 at 0s)
      const urgency = 1 - timeRemaining / 60;
      audioManagerRef.current.updateShepardVolume(urgency);
    } else if (shepardToneActiveRef.current) {
      // Stop Shepard tone if time goes above 60 seconds (e.g., after reset)
      audioManagerRef.current.stopShepardTone();
      shepardToneActiveRef.current = false;
    }
  }, [timeRemaining, isRunning]);

  // Play click sound function
  const playClickSound = async () => {
    if (audioManagerRef.current && isInitializedRef.current) {
      // Try to resume audio context if suspended
      if (audioManagerRef.current.getAudioContextState() === "suspended") {
        const resumed = await audioManagerRef.current.resumeAudioContext();
        if (resumed) {
          setNeedsUserInteraction(false);
          isInitializedRef.current = true;
        }
      }

      audioManagerRef.current.playClickSound();
    }
    options.onButtonClick?.();
  };

  // Play completion sound function
  const playCompletionSound = async () => {
    if (audioManagerRef.current && isInitializedRef.current) {
      audioManagerRef.current.playCompletionSound();
    }
  };

  const enableAudio = async () => {
    if (!audioManagerRef.current) return;

    try {
      const resumed = await audioManagerRef.current.resumeAudioContext();
      if (resumed) {
        setNeedsUserInteraction(false);
        isInitializedRef.current = true;
        setAudioError(null);
        console.log("Audio enabled by user interaction");
      }
    } catch (error) {
      console.error("Failed to enable audio:", error);
      setAudioError("Failed to enable audio");
    }
  };

  return {
    playClickSound,
    playCompletionSound,
    enableAudio,
    isAudioInitialized: isInitializedRef.current,
    audioError,
    needsUserInteraction,
    hasAudioSupport,
  };
};
