import { describe, it, expect } from "vitest";
import { formatTime } from "./formatTime";

describe("formatTime", () => {
  it("formats zero seconds correctly", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formats seconds only", () => {
    expect(formatTime(45)).toBe("00:45");
  });

  it("formats minutes and seconds", () => {
    expect(formatTime(125)).toBe("02:05");
  });

  it("formats full focus session (25 minutes)", () => {
    expect(formatTime(1500)).toBe("25:00");
  });

  it("formats full rest session (5 minutes)", () => {
    expect(formatTime(300)).toBe("05:00");
  });

  it("handles negative values by treating them as zero", () => {
    expect(formatTime(-10)).toBe("00:00");
  });

  it("pads single digit minutes and seconds with leading zeros", () => {
    expect(formatTime(65)).toBe("01:05");
  });
});
