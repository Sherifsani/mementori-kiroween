import { useTimerStore } from "../store/timerStore";

export const SessionIndicator = () => {
  const sessionType = useTimerStore((state) => state.sessionType);
  const corruptionLevel = useTimerStore((state) => state.corruptionLevel);

  const isFocus = sessionType === "focus";

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 100,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: "14px",
          fontWeight: "bold",
          color: isFocus ? "#d4af37" : "#8a0b0b",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: isFocus ? "#d4af37" : "#8a0b0b",
            boxShadow: `0 0 12px ${isFocus ? "#d4af37" : "#8a0b0b"}`,
          }}
        />
        {isFocus ? "FOCUS" : "REST"}
      </div>

      {/* Corruption indicator */}
      {corruptionLevel > 0 && (
        <div
          style={{
            marginTop: "12px",
            fontFamily: "'Space Mono', monospace",
            fontSize: "11px",
            color: "#8a0b0b",
            opacity: 0.8,
          }}
        >
          <div
            style={{
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Corruption
          </div>
          <div
            style={{
              width: "120px",
              height: "4px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${corruptionLevel}%`,
                backgroundColor: "#8a0b0b",
                boxShadow: "0 0 8px #8a0b0b",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div
            style={{
              marginTop: "4px",
              fontSize: "10px",
              opacity: 0.6,
            }}
          >
            {corruptionLevel}%
          </div>
        </div>
      )}
    </div>
  );
};
