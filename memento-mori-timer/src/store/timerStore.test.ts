import { describe, it, expect, beforeEach } from "vitest";
import { useTimerStore } from "./timerStore";

describe("timerStore", () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    const store = useTimerStore.getState();
    store.switchSession(); // Switch to reset
    store.switchSession(); // Switch back to focus with clean state
  });

  describe("initial state", () => {
    it("starts with focus session of 1500 seconds", () => {
      const state = useTimerStore.getState();
      expect(state.timeRemaining).toBe(1500);
      expect(state.totalTime).toBe(1500);
      expect(state.sessionType).toBe("focus");
    });

    it("starts with timer not running", () => {
      const state = useTimerStore.getState();
      expect(state.isRunning).toBe(false);
    });

    it("starts with zero corruption", () => {
      const state = useTimerStore.getState();
      expect(state.corruptionLevel).toBe(0);
    });
  });

  describe("startTimer", () => {
    it("sets isRunning to true", () => {
      const { startTimer } = useTimerStore.getState();
      startTimer();
      expect(useTimerStore.getState().isRunning).toBe(true);
    });
  });

  describe("pauseTimer", () => {
    it("sets isRunning to false", () => {
      const { startTimer, pauseTimer } = useTimerStore.getState();
      startTimer();
      pauseTimer();
      expect(useTimerStore.getState().isRunning).toBe(false);
    });

    it("increments corruption by 5", () => {
      const { pauseTimer } = useTimerStore.getState();
      const initialCorruption = useTimerStore.getState().corruptionLevel;
      pauseTimer();
      expect(useTimerStore.getState().corruptionLevel).toBe(
        initialCorruption + 5
      );
    });

    it("caps corruption at 100", () => {
      const { pauseTimer, incrementCorruption } = useTimerStore.getState();
      incrementCorruption(98);
      pauseTimer();
      expect(useTimerStore.getState().corruptionLevel).toBe(100);
    });
  });

  describe("resetTimer", () => {
    it("resets timeRemaining to totalTime", () => {
      const { tick, resetTimer } = useTimerStore.getState();
      tick();
      tick();
      tick();
      resetTimer();
      const state = useTimerStore.getState();
      expect(state.timeRemaining).toBe(state.totalTime);
    });

    it("stops the timer", () => {
      const { startTimer, resetTimer } = useTimerStore.getState();
      startTimer();
      resetTimer();
      expect(useTimerStore.getState().isRunning).toBe(false);
    });
  });

  describe("tick", () => {
    it("decrements timeRemaining by 1", () => {
      const { tick } = useTimerStore.getState();
      const initial = useTimerStore.getState().timeRemaining;
      tick();
      expect(useTimerStore.getState().timeRemaining).toBe(initial - 1);
    });

    it("does not go below zero", () => {
      const { tick } = useTimerStore.getState();
      // Set time to 0 by ticking many times
      for (let i = 0; i < 2000; i++) {
        tick();
      }
      expect(useTimerStore.getState().timeRemaining).toBe(0);
    });
  });

  describe("incrementCorruption", () => {
    it("increases corruption by specified amount", () => {
      const { incrementCorruption } = useTimerStore.getState();
      incrementCorruption(10);
      expect(useTimerStore.getState().corruptionLevel).toBe(10);
    });

    it("caps corruption at 100", () => {
      const { incrementCorruption } = useTimerStore.getState();
      incrementCorruption(150);
      expect(useTimerStore.getState().corruptionLevel).toBe(100);
    });

    it("accumulates multiple increments", () => {
      const { incrementCorruption } = useTimerStore.getState();
      incrementCorruption(10);
      incrementCorruption(20);
      incrementCorruption(15);
      expect(useTimerStore.getState().corruptionLevel).toBe(45);
    });
  });

  describe("switchSession", () => {
    it("switches from focus to rest", () => {
      const { switchSession } = useTimerStore.getState();
      switchSession();
      const state = useTimerStore.getState();
      expect(state.sessionType).toBe("rest");
      expect(state.totalTime).toBe(300);
      expect(state.timeRemaining).toBe(300);
    });

    it("switches from rest to focus", () => {
      const { switchSession } = useTimerStore.getState();
      switchSession(); // to rest
      switchSession(); // back to focus
      const state = useTimerStore.getState();
      expect(state.sessionType).toBe("focus");
      expect(state.totalTime).toBe(1500);
      expect(state.timeRemaining).toBe(1500);
    });

    it("resets corruption to zero", () => {
      const { incrementCorruption, switchSession } = useTimerStore.getState();
      incrementCorruption(50);
      switchSession();
      expect(useTimerStore.getState().corruptionLevel).toBe(0);
    });

    it("stops the timer", () => {
      const { startTimer, switchSession } = useTimerStore.getState();
      startTimer();
      switchSession();
      expect(useTimerStore.getState().isRunning).toBe(false);
    });
  });
});
