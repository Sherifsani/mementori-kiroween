# Implementation Plan

- [x] 1. Initialize project structure and dependencies

  - Create Vite + React + TypeScript project with `npm create vite@latest`
  - Install core dependencies: `@react-three/fiber`, `@react-three/drei`, `zustand`, `tailwindcss`
  - Configure Tailwind CSS with custom color palette (#050505, #e1e1e1, #8a0b0b, #d4af37)
  - Set up TypeScript strict mode and path aliases
  - Create folder structure: `/src/components`, `/src/hooks`, `/src/store`, `/src/shaders`, `/src/utils`, `/src/audio`
  - _Requirements: 8.1, 8.5_

- [x] 2. Implement Zustand store for timer and corruption state

  - Create `src/store/timerStore.ts` with TimerStore interface
  - Implement timer state: `timeRemaining`, `totalTime`, `isRunning`, `sessionType`
  - Implement corruption state: `corruptionLevel`
  - Add actions: `startTimer`, `pauseTimer`, `resetTimer`, `tick`, `incrementCorruption`, `switchSession`
  - Initialize with focus session (1500 seconds) and corruption at 0
  - _Requirements: 1.1, 1.2, 3.1_

- [x] 3. Create timer engine hook

  - [x] 3.1 Implement `src/hooks/useTimer.ts` hook

    - Use `useEffect` with `requestAnimationFrame` for countdown loop
    - Calculate delta time between frames for accuracy
    - Subscribe to Zustand store for timer state
    - Return `timeRemaining`, `totalTime`, `isRunning`, `sessionType`, `progress` (0-1)
    - Expose `start`, `pause`, `reset` functions
    - _Requirements: 1.3, 1.4, 1.5_

  - [x] 3.2 Implement time formatting utility
    - Create `src/utils/formatTime.ts` function
    - Convert seconds to MM:SS format
    - Handle edge cases (0 seconds, negative values)
    - _Requirements: 1.3_

- [x] 4. Implement corruption system

  - [x] 4.1 Create `src/hooks/useCorruption.ts` hook

    - Listen to `window.onblur` event
    - Listen to `document.visibilitychange` event
    - Increment corruption by 5 on pause, 10 on tab switch
    - Debounce increments (max once per 500ms)
    - Return `corruptionLevel`, `shouldApplyZalgo` (>50), `shouldApplyVignette` (>80), `vignetteIntensity`
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

  - [x] 4.2 Implement Zalgo text transformer
    - Create `src/utils/zalgoText.ts` utility
    - Add combining diacritical marks (U+0300 - U+036F) to input string
    - Scale mark density based on intensity parameter (0-1)
    - Preserve readability at lower intensities
    - _Requirements: 3.4_

- [x] 5. Create glitch effect system

  - [x] 5.1 Implement `src/hooks/useGlitch.ts` hook

    - Trigger glitch state on focus loss
    - Auto-clear after 200ms on focus regain
    - Return `isGlitching` boolean and `glitchStyle` CSS properties
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 5.2 Create glitch CSS animations
    - Add glitch keyframes to `src/index.css`
    - Implement clip-path distortion animation (4 steps, 0.2s duration)
    - Create SVG filter for RGB channel split effect
    - _Requirements: 4.3, 4.4_

- [x] 6. Build UI overlay components

  - [x] 6.1 Create timer display component

    - Implement `src/components/TimerDisplay.tsx`
    - Display formatted time with Space Mono font (96px)
    - Apply Zalgo transformation when `shouldApplyZalgo` is true
    - Include hidden span with clean text for screen readers
    - Add ARIA live region with polite announcement
    - Style with bone white color (#e1e1e1)
    - _Requirements: 1.3, 3.4, 7.2, 7.3, 7.4_

  - [x] 6.2 Create control buttons component

    - Implement `src/components/ControlButtons.tsx`
    - Create Start/Pause toggle button
    - Create Reset button
    - Style with rough borders using CSS (no smooth curves)
    - Apply dried blood color (#8a0b0b) for danger states
    - Add ARIA labels for accessibility
    - Ensure keyboard navigation support
    - _Requirements: 1.3, 1.4, 1.5, 6.5, 7.1, 7.5_

  - [x] 6.3 Create vignette overlay component

    - Implement `src/components/VignetteOverlay.tsx`
    - Render as absolute positioned pseudo-element
    - Apply radial gradient from transparent center to black edges
    - Scale intensity based on `vignetteIntensity` prop (0-1)
    - Only render when corruption > 80
    - _Requirements: 3.5_

  - [x] 6.4 Create main UI overlay container
    - Implement `src/components/UIOverlay.tsx`
    - Position absolutely over 3D canvas
    - Center timer display vertically and horizontally
    - Position control buttons below timer
    - Apply glitch effect wrapper when `isGlitching` is true
    - Set void black background (#050505)
    - _Requirements: 6.1, 6.2_

- [x] 7. Implement 3D scene with React Three Fiber

  - [x] 7.1 Create Vanitas scene container

    - Implement `src/components/VanitasScene.tsx`
    - Set up `<Canvas>` with void black background (#050505)
    - Configure `<PerspectiveCamera>` with dramatic angle (fov: 45, position: [0, 2, 5])
    - Add `<ambientLight>` with low intensity (0.3)
    - Add `<pointLight>` above candle for flame illumination
    - _Requirements: 2.1, 6.1_

  - [x] 7.2 Create skull model component

    - Implement `src/components/SkullModel.tsx`
    - Use `<Box>` or `<Sphere>` as placeholder geometry (or load GLTF if available)
    - Position at origin [0, 0, 0]
    - Apply bone white material (#e1e1e1) with low roughness
    - _Requirements: 2.1_

  - [x] 7.3 Create candle melting shader

    - Create `src/shaders/candleMelt.vert` vertex shader
    - Implement downward vertex displacement based on `uProgress` uniform
    - Add Perlin noise for organic melting effect
    - Expand vertices at base for pooling effect when y < 0.2
    - Create `src/shaders/candleMelt.frag` fragment shader
    - Darken wax color based on progress
    - _Requirements: 2.2, 2.3_

  - [x] 7.4 Create candle model component with shader

    - Implement `src/components/CandleModel.tsx`
    - Use `<Cylinder>` geometry for candle shape
    - Position on top of skull [0, 1, 0]
    - Apply custom shader material with melting effect
    - Pass `progress` prop as `uProgress` uniform
    - Pass `time` from `useFrame` as `uTime` uniform
    - Use tarnished gold color (#d4af37) as base
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 7.5 Create flame particle system
    - Implement `src/components/FlameParticles.tsx`
    - Use `<Points>` with 50-100 particles
    - Position particles in cone shape above candle
    - Create custom shader for particle animation
    - Drive vertical movement with Perlin noise
    - Scale intensity with `1.0 - progress` (dims as time runs out)
    - Use tarnished gold color (#d4af37) with additive blending
    - _Requirements: 2.4_

- [x] 8. Implement audio manager

  - [x] 8.1 Create audio manager class

    - Implement `src/audio/AudioManager.ts` singleton class
    - Initialize `AudioContext` on first user interaction
    - Create audio node graph structure
    - Implement `init`, `startBrownNoise`, `stopBrownNoise`, `startShepardTone`, `updateShepardVolume`, `stopShepardTone`, `playClickSound` methods
    - Handle audio context suspended state
    - _Requirements: 5.5_

  - [x] 8.2 Implement brown noise generator

    - Generate audio buffer with random values
    - Apply low-pass biquad filter at 500Hz
    - Create looping buffer source
    - Set gain to -20dB
    - Connect to audio context destination
    - _Requirements: 5.1_

  - [x] 8.3 Implement Shepard tone synthesizer

    - Create 4 oscillator nodes at octave intervals (110Hz, 220Hz, 440Hz, 880Hz)
    - Implement frequency sweeping with envelope fading
    - Start at -40dB volume when timer reaches 60 seconds
    - Increase volume to -10dB as timer approaches 0
    - Connect all oscillators to shared gain node
    - _Requirements: 5.2, 5.3_

  - [x] 8.4 Implement click sound effect

    - Synthesize short (50ms) low-frequency thud
    - Use sine wave oscillator at 80Hz
    - Apply instant attack, 50ms decay envelope
    - Set gain to -10dB
    - Trigger on all button interactions
    - _Requirements: 5.4_

  - [x] 8.5 Create audio manager hook
    - Implement `src/hooks/useAudio.ts` hook
    - Initialize audio manager on mount
    - Start brown noise when timer starts
    - Trigger Shepard tone when timeRemaining <= 60
    - Update Shepard volume based on urgency
    - Play click sound on button interactions
    - Clean up audio nodes on unmount
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 9. Integrate all components in main App

  - Create `src/App.tsx` main component
  - Render `<VanitasScene>` as background layer
  - Render `<UIOverlay>` as foreground layer
  - Pass timer state and corruption state as props
  - Wire up audio manager to timer events
  - Apply global styles (fonts, colors)
  - _Requirements: 2.1, 6.1, 6.2_

- [x] 10. Implement error handling and fallbacks

  - [x] 10.1 Add WebGL context loss handling

    - Listen for `webglcontextlost` event on canvas
    - Pause timer automatically on context loss
    - Display error message overlay
    - Attempt context restoration after 1 second
    - _Requirements: 8.1_

  - [x] 10.2 Add audio context error handling

    - Detect audio context suspended state
    - Show "Click to enable audio" prompt on first load
    - Gracefully degrade to visual-only mode if audio fails
    - Log audio errors to console
    - _Requirements: 5.5_

  - [x] 10.3 Add performance monitoring
    - Use `useFrame` to track frame rate
    - If FPS drops below 45 for 3 consecutive seconds, reduce particle count by 50%
    - Disable vignette effect if performance degrades
    - Log performance metrics to console
    - _Requirements: 8.1, 8.4_

- [x] 11. Polish and accessibility enhancements

  - [x] 11.1 Add custom fonts

    - Import 'Space Mono' from Google Fonts for timer display
    - Import 'Cinzel' or 'UnifrakturMaguntia' for headers (if any)
    - Configure font loading in `index.html`
    - _Requirements: 6.2_

  - [x] 11.2 Enhance keyboard navigation

    - Ensure all buttons are focusable
    - Add visible focus indicators with dried blood color (#8a0b0b)
    - Support Space and Enter keys for button activation
    - Add keyboard shortcuts (Space for start/pause, R for reset)
    - _Requirements: 7.5_

  - [x] 11.3 Add session completion handling
    - Detect when timeRemaining reaches 0
    - Play completion sound (optional)
    - Auto-switch to rest session after focus, or vice versa
    - Reset corruption level on session completion
    - _Requirements: 1.1, 1.2_

- [-] 12. Testing and validation

  - [ ] 12.1 Write unit tests for core logic

    - Test timer countdown accuracy
    - Test corruption increment calculations
    - Test Zalgo text transformation
    - Test time formatting utility
    - _Requirements: 1.3, 3.2, 3.3_

  - [ ] 12.2 Perform accessibility audit

    - Validate ARIA labels with screen reader
    - Test keyboard navigation flow
    - Verify focus indicators are visible
    - Ensure timer announcements work correctly
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 12.3 Test cross-browser compatibility
    - Test in Chrome/Edge (Chromium)
    - Test in Firefox
    - Test in Safari (WebKit)
    - Test on mobile browsers (iOS Safari, Chrome Android)
    - _Requirements: 8.1, 8.5_
drei/useGLTF