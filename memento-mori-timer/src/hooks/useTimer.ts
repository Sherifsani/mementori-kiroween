import { useEffect, useRef } from "react";
import { useTimerStore } from "../store/timerStore";

interface UseTimerReturn {
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  sessionType: "focus" | "rest";
  progress: number; // 0-1, for shader calculations
  start: () => void;
  pause: () => void;
  reset: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const lastFrameTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  // Subscribe to Zustand store
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const totalTime = useTimerStore((state) => state.totalTime);
  const isRunning = useTimerStore((state) => state.isRunning);
  const sessionType = useTimerStore((state) => state.sessionType);
  const tick = useTimerStore((state) => state.tick);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);

  // Calculate progress (0-1) for shader calculations
  const progress = totalTime > 0 ? 1 - timeRemaining / totalTime : 0;

  // Countdown loop using requestAnimationFrame
  useEffect(() => {
    if (!isRunning) {
      lastFrameTimeRef.current = 0;
      accumulatedTimeRef.current = 0;
      return;
    }

    let animationFrameId: number;

    const countdown = (currentTime: number) => {
      // Initialize on first frame
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = currentTime;
      }

      // Calculate delta time in seconds
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;

      // Accumulate time
      accumulatedTimeRef.current += deltaTime;

      // Tick every second
      if (accumulatedTimeRef.current >= 1.0) {
        tick();
        accumulatedTimeRef.current -= 1.0;
      }

      // Continue loop if still running
      if (isRunning && timeRemaining > 0) {
        animationFrameId = requestAnimationFrame(countdown);
      }
    };

    animationFrameId = requestAnimationFrame(countdown);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning, timeRemaining, tick]);

  return {
    timeRemaining,
    totalTime,
    isRunning,
    sessionType,
    progress,
    start: startTimer,
    pause: pauseTimer,
    reset: resetTimer,
  };
};
