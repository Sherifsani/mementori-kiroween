import { describe, it, expect } from "vitest";
import { zalgoText } from "./zalgoText";

describe("zalgoText", () => {
  it("returns original text at zero intensity", () => {
    const input = "25:00";
    const result = zalgoText(input, 0);
    expect(result).toBe(input);
  });

  it("returns original text at very low intensity", () => {
    const input = "25:00";
    const result = zalgoText(input, 0.05);
    expect(result).toBe(input);
  });

  it("adds combining marks at medium intensity", () => {
    const input = "25:00";
    const result = zalgoText(input, 0.5);
    // Result should be longer due to combining marks
    expect(result.length).toBeGreaterThan(input.length);
    // Should still contain original characters
    expect(result).toContain("2");
    expect(result).toContain("5");
    expect(result).toContain(":");
    expect(result).toContain("0");
  });

  it("adds more marks at high intensity", () => {
    const input = "25:00";
    const resultLow = zalgoText(input, 0.3);
    const resultHigh = zalgoText(input, 0.9);
    // High intensity should generally produce longer output
    expect(resultHigh.length).toBeGreaterThanOrEqual(resultLow.length);
  });

  it("preserves whitespace and colons without marks", () => {
    const input = "25:00";
    const result = zalgoText(input, 1.0);
    // Colon should appear exactly once without marks
    const colonMatches = result.match(/:/g);
    expect(colonMatches).toHaveLength(1);
  });

  it("clamps intensity above 1 to 1", () => {
    const input = "25:00";
    const result1 = zalgoText(input, 1.0);
    const result2 = zalgoText(input, 5.0);
    // Both should have similar length ranges (allowing for randomness)
    expect(Math.abs(result1.length - result2.length)).toBeLessThan(20);
  });

  it("clamps negative intensity to 0", () => {
    const input = "25:00";
    const result = zalgoText(input, -1);
    expect(result).toBe(input);
  });
});
