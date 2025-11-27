import { useState, useEffect } from "react";

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in animation
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      onClick={handleClose}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "90%",
          backgroundColor: "#0a0a0a",
          border: "3px solid #8a0b0b",
          boxShadow:
            "0 0 40px rgba(138, 11, 11, 0.6), inset 0 0 60px rgba(138, 11, 11, 0.1)",
          padding: "40px",
          fontFamily: "'Space Mono', monospace",
          color: "#e1e1e1",
          position: "relative",
          transform: isVisible ? "scale(1)" : "scale(0.9)",
          transition: "transform 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative corner elements */}
        <div
          style={{
            position: "absolute",
            top: "-3px",
            left: "-3px",
            width: "30px",
            height: "30px",
            borderTop: "3px solid #d4af37",
            borderLeft: "3px solid #d4af37",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-3px",
            right: "-3px",
            width: "30px",
            height: "30px",
            borderTop: "3px solid #d4af37",
            borderRight: "3px solid #d4af37",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            left: "-3px",
            width: "30px",
            height: "30px",
            borderBottom: "3px solid #d4af37",
            borderLeft: "3px solid #d4af37",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-3px",
            right: "-3px",
            width: "30px",
            height: "30px",
            borderBottom: "3px solid #d4af37",
            borderRight: "3px solid #d4af37",
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "8px",
            color: "#d4af37",
            textShadow: "0 0 20px rgba(212, 175, 55, 0.5)",
            letterSpacing: "0.1em",
          }}
        >
          MEMENTO MORI
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#8a0b0b",
            marginBottom: "32px",
            fontStyle: "italic",
            letterSpacing: "0.15em",
          }}
        >
          Remember you must die
        </p>

        {/* Divider */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #8a0b0b, transparent)",
            marginBottom: "32px",
          }}
        />

        {/* Instructions */}
        <div style={{ marginBottom: "32px", lineHeight: "1.8" }}>
          <InstructionItem
            icon="🎃"
            title="Focus Timer"
            description="Set your desired duration and start the timer. Stay focused as the candle melts away."
          />

          <InstructionItem
            icon="🔥"
            title="The Flame Burns"
            description="Watch the candle slowly melt on the pumpkin as time passes. The flame flickers with urgency."
          />

          <InstructionItem
            icon="⚠️"
            title="Corruption Penalty"
            description="Pausing or switching tabs increases corruption. At 50%, text distorts. At 80%, darkness closes in."
          />

          <InstructionItem
            icon="⌨️"
            title="Keyboard Shortcuts"
            description={
              <>
                Press <kbd style={kbdStyle}>SPACE</kbd> to start/pause •{" "}
                <kbd style={kbdStyle}>R</kbd> to reset
              </>
            }
          />
        </div>

        {/* Divider */}
        <div
          style={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #8a0b0b, transparent)",
            marginBottom: "24px",
          }}
        />

        {/* Warning */}
        <div
          style={{
            backgroundColor: "rgba(138, 11, 11, 0.2)",
            border: "1px solid #8a0b0b",
            padding: "16px",
            marginBottom: "24px",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          <strong style={{ color: "#8a0b0b" }}>⚡ WARNING:</strong> This timer
          is designed to discourage distraction. The more you pause or switch
          away, the more unsettling the experience becomes.
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            width: "100%",
            padding: "16px",
            backgroundColor: "#d4af37",
            color: "#050505",
            border: "3px solid #d4af37",
            fontSize: "16px",
            fontWeight: "bold",
            fontFamily: "'Space Mono', monospace",
            cursor: "pointer",
            letterSpacing: "0.1em",
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#050505";
            e.currentTarget.style.color = "#d4af37";
            e.currentTarget.style.boxShadow =
              "0 0 30px rgba(212, 175, 55, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#d4af37";
            e.currentTarget.style.color = "#050505";
            e.currentTarget.style.boxShadow =
              "0 0 20px rgba(212, 175, 55, 0.4)";
          }}
        >
          BEGIN YOUR FOCUS
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "10px",
            color: "#555",
            marginTop: "16px",
            letterSpacing: "0.05em",
          }}
        >
          Click anywhere outside to close
        </p>
      </div>
    </div>
  );
};

interface InstructionItemProps {
  icon: string;
  title: string;
  description: React.ReactNode;
}

const InstructionItem = ({
  icon,
  title,
  description,
}: InstructionItemProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "20px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          minWidth: "32px",
          textAlign: "center",
          filter: "grayscale(0.3)",
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "bold",
            color: "#d4af37",
            marginBottom: "4px",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "#b0b0b0",
            lineHeight: "1.5",
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  backgroundColor: "#1a1a1a",
  border: "1px solid #444",
  borderRadius: "3px",
  fontSize: "11px",
  fontWeight: "bold",
  color: "#d4af37",
  fontFamily: "'Space Mono', monospace",
};
