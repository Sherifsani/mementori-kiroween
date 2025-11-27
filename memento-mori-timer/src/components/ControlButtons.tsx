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
    <div style={{ textAlign: "center" }}>
      <div className="flex gap-4 justify-center mt-8">
        {/* Start/Pause Toggle Button */}
        <button
          onClick={handleStartPause}
          onKeyDown={(e) => handleKeyDown(e, handleStartPause)}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
          className="px-8 py-4 text-lg font-bold transition-all duration-150"
          style={{
            fontFamily: "'Space Mono', monospace",
            backgroundColor: isRunning ? "#d4af37" : "transparent",
            color: isRunning ? "#050505" : "#e1e1e1",
            border: `3px solid ${isRunning ? "#d4af37" : "#e1e1e1"}`,
            borderRadius: "0",
            cursor: "pointer",
            minWidth: "140px",
            boxShadow: isRunning ? "0 0 20px rgba(212, 175, 55, 0.4)" : "none",
          }}
          onFocus={(e) => {
            if (!isRunning) {
              e.currentTarget.style.borderColor = "#d4af37";
              e.currentTarget.style.color = "#d4af37";
            }
          }}
          onBlur={(e) => {
            if (!isRunning) {
              e.currentTarget.style.borderColor = "#e1e1e1";
              e.currentTarget.style.color = "#e1e1e1";
            }
          }}
          onMouseEnter={(e) => {
            if (!isRunning) {
              e.currentTarget.style.borderColor = "#d4af37";
              e.currentTarget.style.color = "#d4af37";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(212, 175, 55, 0.2)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isRunning && document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = "#e1e1e1";
              e.currentTarget.style.color = "#e1e1e1";
              e.currentTarget.style.boxShadow = "none";
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
          className="px-8 py-4 text-lg font-bold transition-all duration-150"
          style={{
            fontFamily: "'Space Mono', monospace",
            backgroundColor: "transparent",
            color: "#8a0b0b",
            border: "3px solid #8a0b0b",
            borderRadius: "0",
            cursor: "pointer",
            minWidth: "140px",
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = "#8a0b0b";
            e.currentTarget.style.color = "#e1e1e1";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(138, 11, 11, 0.4)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#8a0b0b";
            e.currentTarget.style.boxShadow = "none";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#8a0b0b";
            e.currentTarget.style.color = "#e1e1e1";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(138, 11, 11, 0.4)";
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#8a0b0b";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          RESET
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div
        style={{
          marginTop: "24px",
          fontFamily: "'Space Mono', monospace",
          fontSize: "11px",
          color: "#666",
          letterSpacing: "0.05em",
        }}
      >
        <span style={{ opacity: 0.6 }}>SPACE</span> to start/pause •{" "}
        <span style={{ opacity: 0.6 }}>R</span> to reset
      </div>
    </div>
  );
};
