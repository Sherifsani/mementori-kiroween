interface ControlButtonsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const ControlButtons = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}: ControlButtonsProps) => {
  const handleStartPause = () => {
    if (isRunning) {
      onPause();
    } else {
      onStart();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex gap-4 justify-center mt-8">
      {/* Start/Pause Toggle Button */}
      <button
        onClick={handleStartPause}
        onKeyDown={(e) => handleKeyDown(e, handleStartPause)}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
        className="px-6 py-3 text-lg font-bold transition-colors duration-100"
        style={{
          fontFamily: "'Space Mono', monospace",
          backgroundColor: "transparent",
          color: "#e1e1e1",
          border: "3px solid #e1e1e1",
          borderRadius: "0",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#8a0b0b";
          e.currentTarget.style.color = "#8a0b0b";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e1e1e1";
          e.currentTarget.style.color = "#e1e1e1";
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "#8a0b0b";
          e.currentTarget.style.color = "#8a0b0b";
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.borderColor = "#e1e1e1";
            e.currentTarget.style.color = "#e1e1e1";
          }
        }}
      >
        {isRunning ? "PAUSE" : "START"}
      </button>

      {/* Reset Button */}
      <button
        onClick={onReset}
        onKeyDown={(e) => handleKeyDown(e, onReset)}
        aria-label="Reset timer"
        className="px-6 py-3 text-lg font-bold transition-colors duration-100"
        style={{
          fontFamily: "'Space Mono', monospace",
          backgroundColor: "transparent",
          color: "#8a0b0b",
          border: "3px solid #8a0b0b",
          borderRadius: "0",
          cursor: "pointer",
        }}
        onFocus={(e) => {
          e.currentTarget.style.backgroundColor = "#8a0b0b";
          e.currentTarget.style.color = "#e1e1e1";
        }}
        onBlur={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#8a0b0b";
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#8a0b0b";
          e.currentTarget.style.color = "#e1e1e1";
        }}
        onMouseLeave={(e) => {
          if (document.activeElement !== e.currentTarget) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8a0b0b";
          }
        }}
      >
        RESET
      </button>
    </div>
  );
};
