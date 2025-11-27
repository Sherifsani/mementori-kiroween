import { useEffect, useRef } from "react";
import { useTimerStore } from "../store/timerStore";

interface UseCorruptionReturn {
  corruptionLevel: number;
  shouldApplyZalgo: boolean;
  shouldApplyVignette: boolean;
  vignetteIntensity: number;
}

const CORRUPTION_ON_TAB_SWITCH = 10;
const DEBOUNCE_MS = 500;

export const useCorruption = (): UseCorruptionReturn => {
  const corruptionLevel = useTimerStore((state) => state.corruptionLevel);
  const incrementCorruption = useTimerStore(
    (state) => state.incrementCorruption
  );
  const lastIncrementTime = useRef<number>(0);

  // Debounced corruption increment
  const incrementWithDebounce = (amount: number) => {
    const now = Date.now();
    if (now - lastIncrementTime.current >= DEBOUNCE_MS) {
      incrementCorruption(amount);
      lastIncrementTime.current = now;
    }
  };

  useEffect(() => {
    // Handle window blur (user switches to another window)
    const handleBlur = () => {
      incrementWithDebounce(CORRUPTION_ON_TAB_SWITCH);
    };

    // Handle visibility change (tab becomes hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementWithDebounce(CORRUPTION_ON_TAB_SWITCH);
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [incrementCorruption]);

  // Calculate derived values
  const shouldApplyZalgo = corruptionLevel > 50;
  const shouldApplyVignette = corruptionLevel > 80;
  const vignetteIntensity = shouldApplyVignette
    ? Math.min(1, (corruptionLevel - 80) / 20)
    : 0;

  return {
    corruptionLevel,
    shouldApplyZalgo,
    shouldApplyVignette,
    vignetteIntensity,
  };
};
