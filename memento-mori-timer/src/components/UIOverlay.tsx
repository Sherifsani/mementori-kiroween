import { TimerDisplay } from "./TimerDisplay";
import { ControlButtons } from "./ControlButtons";
import { VignetteOverlay } from "./VignetteOverlay";

interface UIOverlayProps {
  timeRemaining: number;
  isRunning: boolean;
  shouldApplyZalgo: boolean;
  shouldApplyVignette: boolean;
  vignetteIntensity: number;
  corruptionLevel: number;
  glitchStyle: React.CSSProperties;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const UIOverlay = ({
  timeRemaining,
  isRunning,
  shouldApplyZalgo,
  shouldApplyVignette,
  vignetteIntensity,
  corruptionLevel,
  glitchStyle,
  onStart,
  onPause,
  onReset,
}: UIOverlayProps) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      {/* Main content wrapper with optional glitch effect */}
      <div
        style={{
          ...glitchStyle,
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
        }}
      >
        {/* Timer Display - centered */}
        <TimerDisplay
          timeRemaining={timeRemaining}
          shouldApplyZalgo={shouldApplyZalgo}
          corruptionLevel={corruptionLevel}
        />

        {/* Control Buttons - positioned below timer */}
        <ControlButtons
          isRunning={isRunning}
          onStart={onStart}
          onPause={onPause}
          onReset={onReset}
        />
      </div>

      {/* Vignette Overlay - rendered on top when corruption > 80 */}
      <VignetteOverlay
        intensity={vignetteIntensity}
        shouldRender={shouldApplyVignette}
      />
    </div>
  );
};
