import { formatTime } from "../utils/formatTime";
import { zalgoText } from "../utils/zalgoText";

interface TimerDisplayProps {
  timeRemaining: number;
  shouldApplyZalgo: boolean;
  corruptionLevel: number;
}

export const TimerDisplay = ({
  timeRemaining,
  shouldApplyZalgo,
  corruptionLevel,
}: TimerDisplayProps) => {
  const formattedTime = formatTime(timeRemaining);

  // Calculate Zalgo intensity based on corruption level
  // Intensity ranges from 0 to 1, starting at corruption level 50
  const zalgoIntensity = shouldApplyZalgo
    ? Math.min(1, (corruptionLevel - 50) / 50)
    : 0;

  const displayText = shouldApplyZalgo
    ? zalgoText(formattedTime, zalgoIntensity)
    : formattedTime;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      className="text-center"
    >
      {/* Visible timer display with optional Zalgo effect */}
      <div
        aria-hidden="true"
        className="text-[96px] font-mono font-bold leading-none"
        style={{
          fontFamily: "'Space Mono', monospace",
          color: "#e1e1e1",
          letterSpacing: "0.05em",
          textShadow:
            "0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2)",
          filter: shouldApplyZalgo ? "blur(0.5px)" : "none",
        }}
      >
        {displayText}
      </div>

      {/* Hidden clean text for screen readers */}
      <span className="sr-only">{formattedTime}</span>
    </div>
  );
};
