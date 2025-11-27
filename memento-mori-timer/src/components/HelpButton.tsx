interface HelpButtonProps {
  onClick: () => void;
}

export const HelpButton = ({ onClick }: HelpButtonProps) => {
  return (
    <button
      onClick={onClick}
      aria-label="Show help"
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        width: "40px",
        height: "40px",
        backgroundColor: "transparent",
        border: "2px solid #555",
        color: "#555",
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "'Space Mono', monospace",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
        zIndex: 100,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#d4af37";
        e.currentTarget.style.color = "#d4af37";
        e.currentTarget.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#555";
        e.currentTarget.style.color = "#555";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      ?
    </button>
  );
};
