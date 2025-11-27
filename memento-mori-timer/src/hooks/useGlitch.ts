import { useEffect, useState } from "react";

interface UseGlitchReturn {
  isGlitching: boolean;
  glitchStyle: React.CSSProperties;
}

export const useGlitch = (): UseGlitchReturn => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    let clearTimer: number | null = null;

    const handleFocusLoss = () => {
      setIsGlitching(true);
    };

    const handleFocusGain = () => {
      // Auto-clear after 200ms on focus regain
      clearTimer = setTimeout(() => {
        setIsGlitching(false);
      }, 200);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsGlitching(true);
      } else {
        handleFocusGain();
      }
    };

    // Listen to window blur/focus events
    window.addEventListener("blur", handleFocusLoss);
    window.addEventListener("focus", handleFocusGain);

    // Listen to visibility change events
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleFocusLoss);
      window.removeEventListener("focus", handleFocusGain);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (clearTimer !== null) {
        clearTimeout(clearTimer);
      }
    };
  }, []);

  const glitchStyle: React.CSSProperties = isGlitching
    ? {
        animation: "glitch-clip 0.2s steps(4) infinite",
        filter: "url(#rgb-split)",
      }
    : {};

  return {
    isGlitching,
    glitchStyle,
  };
};
