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
  onSessionComplete?: () => void;
}

export const useTimer = (onSessionComplete?: () => void): UseTimerReturn => {
  const lastFrameTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);
  const sessionCompletedRef = useRef<boolean>(false);

  // Subscribe to Zustand store
  const timeRemaining = useTimerStore((state) => state.timeRemaining);
  const totalTime = useTimerStore((state) => state.totalTime);
  const isRunning = useTimerStore((state) => state.isRunning);
  const sessionType = useTimerStore((state) => state.sessionType);
  const tick = useTimerStore((state) => state.tick);
  const startTimer = useTimerStore((state) => state.startTimer);
  const pauseTimer = useTimerStore((state) => state.pauseTimer);
  const resetTimer = useTimerStore((state) => state.resetTimer);
  const switchSession = useTimerStore((state) => state.switchSession);

  // Calculate progress (0-1) for shader calculations
  const progress = totalTime > 0 ? 1 - timeRemaining / totalTime : 0;

  // Detect session completion
  useEffect(() => {
    if (timeRemaining === 0 && isRunning && !sessionCompletedRef.current) {
      sessionCompletedRef.current = true;

      // Call completion callback
      if (onSessionComplete) {
        onSessionComplete();
      }

      // Auto-switch to next session after a brief delay
      setTimeout(() => {
        switchSession();
        sessionCompletedRef.current = false;
      }, 1000);
    } else if (timeRemaining > 0) {
      sessionCompletedRef.current = false;
    }
  }, [timeRemaining, isRunning, onSessionComplete, switchSession]);

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
