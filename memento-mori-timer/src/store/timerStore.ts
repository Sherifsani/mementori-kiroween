import { create } from "zustand";

type SessionType = "focus" | "rest";

interface TimerStore {
  // Timer state
  timeRemaining: number;
  totalTime: number;
  isRunning: boolean;
  sessionType: SessionType;

  // Corruption tracking
  corruptionLevel: number;

  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tick: () => void;
  incrementCorruption: (amount: number) => void;
  switchSession: () => void;
}

const FOCUS_DURATION = 1500; // 25 minutes in seconds
const REST_DURATION = 300; // 5 minutes in seconds

export const useTimerStore = create<TimerStore>((set) => ({
  // Initial state - focus session with 25 minutes
  timeRemaining: FOCUS_DURATION,
  totalTime: FOCUS_DURATION,
  isRunning: false,
  sessionType: "focus",
  corruptionLevel: 0,

  // Start the timer
  startTimer: () => set({ isRunning: true }),

  // Pause the timer
  pauseTimer: () => set({ isRunning: false }),

  // Reset timer to current session's total time
  resetTimer: () =>
    set((state) => ({
      timeRemaining: state.totalTime,
      isRunning: false,
    })),

  // Decrement time by 1 second
  tick: () =>
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - 1),
    })),

  // Increment corruption level (capped at 100)
  incrementCorruption: (amount: number) =>
    set((state) => ({
      corruptionLevel: Math.min(100, state.corruptionLevel + amount),
    })),

  // Switch between focus and rest sessions
  switchSession: () =>
    set((state) => {
      const newSessionType = state.sessionType === "focus" ? "rest" : "focus";
      const newTotalTime =
        newSessionType === "focus" ? FOCUS_DURATION : REST_DURATION;

      return {
        sessionType: newSessionType,
        totalTime: newTotalTime,
        timeRemaining: newTotalTime,
        isRunning: false,
        corruptionLevel: 0, // Reset corruption on session switch
      };
    }),
}));
