# Design Document

## Overview

Memento Mori is a React-based Pomodoro timer that combines 3D graphics, custom shaders, and atmospheric audio to create a gothic, high-stakes productivity experience. The application uses React Three Fiber for WebGL rendering, Zustand for state management, and the Web Audio API for layered soundscapes. The core design philosophy emphasizes performance (60fps), accessibility, and progressive visual corruption as a deterrent to distraction.

## Architecture

### High-Level Structure

```
┌─────────────────────────────────────────────────┐
│              React Application                   │
│  ┌───────────────────────────────────────────┐  │
│  │         UI Overlay Layer (2D)             │  │
│  │  - Timer Display (with Zalgo transform)   │  │
│  │  - Control Buttons (Start/Pause/Reset)    │  │
│  │  - Hidden Accessibility Elements          │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │      React Three Fiber Canvas (3D)        │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │      Vanitas Scene                   │  │  │
│  │  │  - Skull Model (static)              │  │  │
│  │  │  - Candle Model (melting shader)     │  │  │
│  │  │  - Flame Particle System             │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │         Zustand Store                     │  │
│  │  - Timer State                            │  │
│  │  - Corruption Level                       │  │
│  │  - Session Type                           │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │         Audio Manager                     │  │
│  │  - Brown Noise Generator                  │  │
│  │  - Shepard Tone Synthesizer               │  │
│  │  - Interaction Sound Buffer               │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Technology Stack

- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **React Three Fiber** (@react-three/fiber) for declarative WebGL
- **Drei** (@react-three/drei) for 3D helpers and utilities
- **Zustand** for lightweight state management
- **Tailwind CSS** for utility-first styling
- **Web Audio API** for audio synthesis and processing

## Components and Interfaces

### 1. State Management (Zustand Store)

```typescript
interface TimerStore {
  // Timer state
  timeRemaining: number; // in seconds
  totalTime: number; // in seconds
  isRunning: boolean;
  sessionType: "focus" | "rest";

  // Corruption tracking
  corruptionLevel: number; // 0-100

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void; // decrements timeRemaining
  incrementCorruption: (amount: number) => void;
  switchSession: () => void;
}
```

**Design Decisions:**

- Zustand chosen over Context API for better performance with frequent updates
- Single store pattern keeps all timer-related state co-located
- Corruption level stored centrally for easy access by visual effects

### 2. Timer Engine Hook (`useTimer`)

```typescript
interface UseTimerReturn {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  sessionType: "focus" | "rest";
  progress: number; // 0-1, for shader calculations
  start: () => void;
  pause: () => void;
  reset: () => void;
}
```

**Implementation Strategy:**

- Uses `useEffect` with `requestAnimationFrame` for smooth countdown
- Calculates delta time between frames for accuracy
- Triggers corruption increment on pause
- Emits events for audio manager integration

### 3. Corruption System Hook (`useCorruption`)

```typescript
interface UseCorruptionReturn {
  corruptionLevel: number;
  shouldApplyZalgo: boolean; // > 50
  shouldApplyVignette: boolean; // > 80
  vignetteIntensity: number; // 0-1
}
```

**Implementation Strategy:**

- Listens to `window.onblur` and `document.visibilitychange` events
- Increments corruption by 5 on pause, 10 on tab switch
- Provides computed flags for conditional rendering
- Vignette intensity calculated as `(corruptionLevel - 80) / 20`

### 4. Glitch Effect Hook (`useGlitch`)

```typescript
interface UseGlitchReturn {
  isGlitching: boolean;
  glitchStyle: React.CSSProperties;
}
```

**Implementation Strategy:**

- Triggers on focus loss, auto-clears after 200ms on focus regain
- Returns CSS properties for clip-path and filter
- Uses CSS custom properties for RGB channel offsets
- Applies to a wrapper div containing the entire UI

**CSS Implementation:**

```css
.glitch {
  animation: glitch-clip 0.2s steps(4) infinite;
  filter: url(#rgb-split);
}

@keyframes glitch-clip {
  0% {
    clip-path: inset(40% 0 30% 0);
  }
  25% {
    clip-path: inset(10% 0 60% 0);
  }
  50% {
    clip-path: inset(70% 0 10% 0);
  }
  75% {
    clip-path: inset(20% 0 50% 0);
  }
  100% {
    clip-path: inset(50% 0 20% 0);
  }
}
```

### 5. Vanitas Scene Component

```typescript
interface VanitasSceneProps {
  progress: number; // 0-1, from timer
  corruptionLevel: number;
}
```

**Component Structure:**

- `<Canvas>` with black background (#050505)
- `<PerspectiveCamera>` positioned for dramatic angle
- `<ambientLight>` for base illumination
- `<SkullModel>` - static mesh loaded from GLTF
- `<CandleModel>` - mesh with custom melting shader
- `<FlameParticles>` - point sprites with Perlin noise animation

### 6. Candle Melting Shader

**Vertex Shader Strategy:**

```glsl
uniform float uProgress; // 0-1 from timer
uniform float uTime; // for noise variation

void main() {
  vec3 pos = position;

  // Calculate melt amount based on height and progress
  float meltFactor = (1.0 - uProgress) * (position.y / maxHeight);

  // Apply downward displacement
  pos.y -= meltFactor * 2.0;

  // Add noise for organic melting
  float noise = snoise(vec3(position.xz * 3.0, uTime * 0.5));
  pos.y += noise * meltFactor * 0.1;

  // Expand at base (pooling effect)
  if (position.y < 0.2) {
    pos.xz *= 1.0 + (1.0 - uProgress) * 0.5;
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**Fragment Shader Strategy:**

```glsl
uniform vec3 uCandleColor; // #d4af37
uniform float uProgress;

void main() {
  // Darken wax as it melts
  vec3 color = uCandleColor * (0.5 + uProgress * 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

### 7. Flame Particle System

**Implementation:**

- Uses `<Points>` with custom shader material
- 50-100 particles in a cone shape above candle
- Perlin noise drives vertical movement and opacity
- Intensity scales with `1.0 - progress` (dims as time runs out)
- Color: #d4af37 with additive blending

### 8. Audio Manager

```typescript
interface AudioManager {
  init: () => void;
  startBrownNoise: () => void;
  stopBrownNoise: () => void;
  startShepardTone: () => void;
  updateShepardVolume: (urgency: number) => void; // 0-1
  stopShepardTone: () => void;
  playClickSound: () => void;
}
```

**Audio Architecture:**

```
AudioContext
├── BrownNoiseNode (BufferSource + BiquadFilter)
│   └── GainNode (-20dB) → destination
├── ShepardToneNode (4 x OscillatorNode)
│   └── GainNode (dynamic) → destination
└── ClickSoundNode (BufferSource)
    └── GainNode (-10dB) → destination
```

**Brown Noise Generation:**

- Generate buffer with random values
- Apply low-pass filter at 500Hz
- Loop continuously at -20dB

**Shepard Tone Generation:**

- Create 4 oscillators at octave intervals (e.g., 110Hz, 220Hz, 440Hz, 880Hz)
- Each oscillator has envelope that fades in/out as frequency sweeps
- Continuously increment frequencies to create rising illusion
- Volume starts at -40dB at 60s, reaches -10dB at 0s

**Click Sound:**

- Short (50ms) synthesized thud using low-frequency sine wave
- Envelope: instant attack, 50ms decay
- Triggered on all button interactions

### 9. Zalgo Text Transformer

```typescript
interface ZalgoTransform {
  transform: (text: string, intensity: number) => string;
}
```

**Implementation:**

- Takes numeric time string (e.g., "25:00")
- Adds combining diacritical marks (U+0300 - U+036F range)
- Intensity based on `(corruptionLevel - 50) / 50`
- Preserves original text in hidden span for screen readers

**Example Output:**

```
Normal: 25:00
Zalgo:  2̴̢5̷̨:̸̡0̶̢0̴̨
```

### 10. UI Overlay Component

```typescript
interface TimerDisplayProps {
  timeRemaining: number;
  isRunning: boolean;
  corruptionLevel: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}
```

**Layout:**

- Absolute positioned overlay on top of 3D canvas
- Centered timer display with large font (Space Mono, 96px)
- Button row below timer (Start/Pause, Reset)
- Buttons styled with rough borders using SVG filters
- Vignette overlay applied as pseudo-element when corruption > 80

**Accessibility Structure:**

```html
<div role="timer" aria-live="polite">
  <span aria-hidden="true">{zalgoText}</span>
  <span className="sr-only">{cleanText}</span>
</div>
```

## Data Models

### Timer State

```typescript
type SessionType = "focus" | "rest";

interface TimerState {
  timeRemaining: number; // seconds
  totalTime: number; // seconds (1500 for focus, 300 for rest)
  isRunning: boolean;
  sessionType: SessionType;
  startedAt: number | null; // timestamp
}
```

### Corruption State

```typescript
interface CorruptionState {
  level: number; // 0-100
  pauseCount: number;
  tabSwitchCount: number;
  lastIncrementTime: number; // timestamp to prevent spam
}
```

### Audio State

```typescript
interface AudioState {
  isInitialized: boolean;
  brownNoiseActive: boolean;
  shepardToneActive: boolean;
  masterVolume: number; // 0-1
}
```

## Error Handling

### WebGL Context Loss

- Listen for `webglcontextlost` event on canvas
- Pause timer automatically
- Display error message overlay
- Attempt context restoration after 1 second

### Audio Context Suspended

- Modern browsers require user interaction to start audio
- Show "Click to enable audio" prompt on first load
- Initialize audio context on first button click
- Gracefully degrade if audio fails (visual-only mode)

### Performance Degradation

- Monitor frame rate using `useFrame` hook
- If FPS drops below 45 for 3 consecutive seconds:
  - Reduce particle count by 50%
  - Simplify shader (remove noise calculations)
  - Disable vignette effect
- Log performance metrics to console for debugging

### Browser Compatibility

- Detect WebGL support on mount
- Fall back to 2D canvas with static skull/candle image if unavailable
- Detect Web Audio API support
- Provide silent mode if audio unavailable

## Testing Strategy

### Unit Tests

- Timer logic (countdown, pause, reset)
- Corruption increment calculations
- Zalgo text transformation
- Time formatting utilities

### Integration Tests

- Timer + Corruption interaction (pause increments corruption)
- Audio manager initialization and state transitions
- Glitch effect triggering on focus loss

### Visual Regression Tests

- Capture screenshots at corruption levels: 0, 50, 80, 100
- Verify shader rendering at progress: 0, 0.5, 1.0
- Test responsive layout at different viewport sizes

### Performance Tests

- Measure frame rate over 60-second session
- Verify audio processing doesn't block main thread
- Test memory usage over extended sessions (no leaks)

### Accessibility Tests

- Verify screen reader announces timer updates
- Test keyboard navigation (Tab, Enter, Space)
- Validate ARIA labels and live regions
- Ensure focus indicators are visible

### Browser Compatibility Tests

- Chrome/Edge (Chromium)
- Firefox
- Safari (WebKit)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Optimizations

### Rendering

- Use `useMemo` for expensive calculations (Zalgo transform, vignette intensity)
- Implement `React.memo` for static components (buttons, labels)
- Limit shader uniform updates to animation frame
- Use instanced rendering if particle count increases

### State Management

- Debounce corruption increments (max once per 500ms)
- Use shallow equality checks in Zustand selectors
- Avoid unnecessary re-renders with selector specificity

### Audio

- Pre-generate brown noise buffer on initialization
- Use single AudioContext instance (singleton pattern)
- Disconnect unused audio nodes to free resources
- Implement audio buffer pooling for click sounds

### Bundle Size

- Code-split 3D scene (lazy load with React.lazy)
- Tree-shake unused Drei components
- Use dynamic imports for audio manager
- Optimize GLTF models (Draco compression)

## Deployment Considerations

### Build Configuration

- Vite production build with minification
- Enable gzip compression for static assets
- Generate source maps for debugging
- Set appropriate cache headers for assets

### Asset Optimization

- Compress GLTF models (target < 100KB)
- Use WebP for any 2D textures
- Inline small assets (< 10KB) as data URLs
- Lazy load audio buffers

### Environment Variables

- `VITE_ENABLE_AUDIO` - toggle audio features
- `VITE_DEBUG_MODE` - show performance stats
- `VITE_PARTICLE_COUNT` - adjust particle density

### Monitoring

- Track WebGL context loss events
- Log audio initialization failures
- Monitor average frame rate
- Track corruption level distribution (analytics)
