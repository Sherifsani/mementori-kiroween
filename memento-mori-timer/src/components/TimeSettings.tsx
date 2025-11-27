import { useState } from "react";
import { useTimerStore } from "../store/timerStore";

interface TimeSettingsProps {
  isRunning: boolean;
}

export const TimeSettings = ({ isRunning }: TimeSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");
  const setCustomTime = useTimerStore((state) => state.setCustomTime);
  const totalTime = useTimerStore((state) => state.totalTime);

  const presetTimes = [
    { label: "5 min", value: 5 },
    { label: "10 min", value: 10 },
    { label: "15 min", value: 15 },
    { label: "25 min", value: 25 },
    { label: "45 min", value: 45 },
    { label: "60 min", value: 60 },
  ];

  const handlePresetClick = (minutes: number) => {
    setCustomTime(minutes);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const minutes = parseInt(customMinutes);
    if (minutes > 0 && minutes <= 999) {
      setCustomTime(minutes);
      setCustomMinutes("");
      setIsOpen(false);
    }
  };

  const currentMinutes = Math.ceil(totalTime / 60);

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 100,
      }}
    >
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isRunning}
        aria-label="Time settings"
        style={{
          fontFamily: "'Space Mono', monospace",
          backgroundColor: "transparent",
          color: isRunning ? "#555" : "#e1e1e1",
          border: `2px solid ${isRunning ? "#555" : "#e1e1e1"}`,
          padding: "8px 16px",
          cursor: isRunning ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "all 0.2s",
          opacity: isRunning ? 0.3 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isRunning) {
            e.currentTarget.style.borderColor = "#d4af37";
            e.currentTarget.style.color = "#d4af37";
          }
        }}
        onMouseLeave={(e) => {
          if (!isRunning) {
            e.currentTarget.style.borderColor = "#e1e1e1";
            e.currentTarget.style.color = "#e1e1e1";
          }
        }}
      >
        ⏱ {currentMinutes}m
      </button>

      {/* Settings Panel */}
      {isOpen && !isRunning && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            backgroundColor: "#0a0a0a",
            border: "2px solid #e1e1e1",
            padding: "20px",
            minWidth: "280px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "transparent",
              border: "none",
              color: "#e1e1e1",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px 8px",
              lineHeight: "1",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#8a0b0b";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#e1e1e1";
            }}
          >
            ×
          </button>

          <h3
            style={{
              fontFamily: "'Space Mono', monospace",
              color: "#e1e1e1",
              fontSize: "16px",
              marginBottom: "16px",
              fontWeight: "bold",
            }}
          >
            SET DURATION
          </h3>

          {/* Preset buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
              marginBottom: "16px",
            }}
          >
            {presetTimes.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  backgroundColor:
                    currentMinutes === preset.value ? "#d4af37" : "transparent",
                  color:
                    currentMinutes === preset.value ? "#050505" : "#e1e1e1",
                  border: `2px solid ${
                    currentMinutes === preset.value ? "#d4af37" : "#555"
                  }`,
                  padding: "8px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: "bold",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (currentMinutes !== preset.value) {
                    e.currentTarget.style.borderColor = "#e1e1e1";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentMinutes !== preset.value) {
                    e.currentTarget.style.borderColor = "#555";
                  }
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom time input */}
          <form onSubmit={handleCustomSubmit}>
            <div
              style={{
                borderTop: "1px solid #333",
                paddingTop: "16px",
              }}
            >
              <label
                style={{
                  fontFamily: "'Space Mono', monospace",
                  color: "#999",
                  fontSize: "11px",
                  display: "block",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Custom (1-999 min)
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="30"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    backgroundColor: "#050505",
                    color: "#e1e1e1",
                    border: "2px solid #555",
                    padding: "8px",
                    fontSize: "14px",
                    flex: 1,
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#d4af37";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#555";
                  }}
                />
                <button
                  type="submit"
                  disabled={!customMinutes || parseInt(customMinutes) <= 0}
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    backgroundColor: "#d4af37",
                    color: "#050505",
                    border: "2px solid #d4af37",
                    padding: "8px 16px",
                    cursor:
                      !customMinutes || parseInt(customMinutes) <= 0
                        ? "not-allowed"
                        : "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                    opacity:
                      !customMinutes || parseInt(customMinutes) <= 0 ? 0.5 : 1,
                  }}
                >
                  SET
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
