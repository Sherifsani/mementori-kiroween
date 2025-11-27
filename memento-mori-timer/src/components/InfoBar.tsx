export const InfoBar = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'Space Mono', monospace",
        fontSize: "11px",
        color: "#555",
        textAlign: "center",
        letterSpacing: "0.05em",
        zIndex: 100,
      }}
    >
      <div style={{ marginBottom: "8px", opacity: 0.8 }}>
        Pausing or switching tabs increases corruption
      </div>
      <div style={{ opacity: 0.6, fontSize: "10px" }}>
        Memento Mori — Remember you must die
      </div>
    </div>
  );
};
