import { useState, useEffect } from "react";
import { useTimer } from "./hooks/useTimer";
import { useCorruption } from "./hooks/useCorruption";
import { useGlitch } from "./hooks/useGlitch";
import { useAudio } from "./hooks/useAudio";
import VanitasScene from "./components/VanitasScene";
import { UIOverlay } from "./components/UIOverlay";
import { TimeSettings } from "./components/TimeSettings";
import { SessionIndicator } from "./components/SessionIndicator";
import { InfoBar } from "./components/InfoBar";
import { WelcomeModal } from "./components/WelcomeModal";
import { HelpButton } from "./components/HelpButton";
import "./App.css";

const WELCOME_MODAL_KEY = "memento-mori-welcome-shown";

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(WELCOME_MODAL_KEY);
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.setItem(WELCOME_MODAL_KEY, "true");
    setShowWelcome(false);
  };

  const handleOpenHelp = () => {
    setShowWelcome(true);
  };
  // Audio manager - initialize first to get completion sound callback
  const {
    playClickSound,
    playCompletionSound,
    enableAudio,
    needsUserInteraction,
    audioError,
    hasAudioSupport,
  } = useAudio();

  // Timer state and controls with completion callback
  const { timeRemaining, isRunning, progress, start, pause, reset } =
    useTimer(playCompletionSound);

  // Corruption effects
  const {
    corruptionLevel,
    shouldApplyZalgo,
    shouldApplyVignette,
    vignetteIntensity,
  } = useCorruption();

  // Performance monitoring state
  const [performanceVignetteDisabled, setPerformanceVignetteDisabled] =
    useState(false);

  // Glitch effects
  const { glitchStyle } = useGlitch();

  // Wrap control functions to play click sound
  const handleStart = () => {
    playClickSound();
    start();
  };

  const handlePause = () => {
    playClickSound();
    pause();
  };

  const handleReset = () => {
    playClickSound();
    reset();
  };

  // Handle WebGL context loss
  const handleContextLoss = () => {
    if (isRunning) {
      pause(); // Pause timer automatically on context loss
    }
  };

  // Handle performance changes
  const handlePerformanceChange = (metrics: {
    shouldReduceParticles: boolean;
    shouldDisableVignette: boolean;
  }) => {
    setPerformanceVignetteDisabled(metrics.shouldDisableVignette);
  };

  // Determine if vignette should be shown (corruption-based AND not disabled by performance)
  const showVignette = shouldApplyVignette && !performanceVignetteDisabled;

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Space key for start/pause
      if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
          handlePause();
        } else {
          handleStart();
        }
      }

      // R key for reset
      if (e.code === "KeyR") {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Welcome Modal - First Visit */}
      {showWelcome && <WelcomeModal onClose={handleCloseWelcome} />}

      {/* 3D Scene - Background Layer */}
      <VanitasScene
        progress={progress}
        corruptionLevel={corruptionLevel}
        onContextLoss={handleContextLoss}
        onPerformanceChange={handlePerformanceChange}
      />

      {/* Session Indicator - Top Left */}
      <SessionIndicator />

      {/* Time Settings - Top Right */}
      <TimeSettings isRunning={isRunning} />

      {/* UI Overlay - Foreground Layer */}
      <UIOverlay
        timeRemaining={timeRemaining}
        isRunning={isRunning}
        shouldApplyZalgo={shouldApplyZalgo}
        shouldApplyVignette={showVignette}
        vignetteIntensity={vignetteIntensity}
        corruptionLevel={corruptionLevel}
        glitchStyle={glitchStyle}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />

      {/* Audio prompt overlay */}
      {needsUserInteraction && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(138, 11, 11, 0.9)",
            color: "#e1e1e1",
            padding: "15px 30px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "14px",
            cursor: "pointer",
            zIndex: 1000,
            border: "2px solid #8a0b0b",
          }}
          onClick={enableAudio}
        >
          Click to enable audio
        </div>
      )}

      {/* Info Bar - Bottom */}
      {!needsUserInteraction && !audioError && <InfoBar />}

      {/* Help Button - Bottom Right */}
      <HelpButton onClick={handleOpenHelp} />

      {/* Audio error message (graceful degradation) */}
      {audioError && !hasAudioSupport && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(5, 5, 5, 0.9)",
            color: "#e1e1e1",
            padding: "10px 20px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "12px",
            zIndex: 1000,
            opacity: 0.7,
          }}
        >
          Running in visual-only mode (audio not supported)
        </div>
      )}
    </div>
  );
}

export default App;
