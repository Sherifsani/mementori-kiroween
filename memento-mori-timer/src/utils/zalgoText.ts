/**
 * Zalgo text transformer - adds combining diacritical marks to create unsettling text
 * Unicode range U+0300 - U+036F contains combining diacritical marks
 */

// Combining diacritical marks that appear above characters
const MARKS_ABOVE = [
  "\u0300", // Combining grave accent
  "\u0301", // Combining acute accent
  "\u0302", // Combining circumflex accent
  "\u0303", // Combining tilde
  "\u0304", // Combining macron
  "\u0305", // Combining overline
  "\u0306", // Combining breve
  "\u0307", // Combining dot above
  "\u0308", // Combining diaeresis
  "\u0309", // Combining hook above
  "\u030A", // Combining ring above
  "\u030B", // Combining double acute accent
  "\u030C", // Combining caron
  "\u030D", // Combining vertical line above
  "\u030E", // Combining double vertical line above
  "\u030F", // Combining double grave accent
];

// Combining diacritical marks that appear below characters
const MARKS_BELOW = [
  "\u0316", // Combining grave accent below
  "\u0317", // Combining acute accent below
  "\u0318", // Combining left tack below
  "\u0319", // Combining right tack below
  "\u031A", // Combining left angle above
  "\u031B", // Combining horn
  "\u031C", // Combining left half ring below
  "\u031D", // Combining up tack below
  "\u031E", // Combining down tack below
  "\u031F", // Combining plus sign below
  "\u0320", // Combining minus sign below
  "\u0321", // Combining palatalized hook below
  "\u0322", // Combining retroflex hook below
  "\u0323", // Combining dot below
  "\u0324", // Combining diaeresis below
  "\u0325", // Combining ring below
  "\u0326", // Combining comma below
  "\u0327", // Combining cedilla
];

// Combining diacritical marks that appear through/middle of characters
const MARKS_MIDDLE = [
  "\u0334", // Combining tilde overlay
  "\u0335", // Combining short stroke overlay
  "\u0336", // Combining long stroke overlay
  "\u0337", // Combining short solidus overlay
  "\u0338", // Combining long solidus overlay
];

/**
 * Transform text with Zalgo effect by adding combining diacritical marks
 * @param text - The input text to transform
 * @param intensity - The intensity of the effect (0-1)
 * @returns The transformed text with combining marks
 */
export const zalgoText = (text: string, intensity: number): string => {
  // Clamp intensity between 0 and 1
  const clampedIntensity = Math.max(0, Math.min(1, intensity));

  // At low intensities, return original text
  if (clampedIntensity < 0.1) {
    return text;
  }

  // Calculate how many marks to add per character based on intensity
  // Low intensity: 1-2 marks, High intensity: 3-6 marks
  const marksPerChar = Math.floor(1 + clampedIntensity * 5);

  return text
    .split("")
    .map((char) => {
      // Don't add marks to whitespace or special characters
      if (char.match(/[\s:]/)) {
        return char;
      }

      let result = char;

      // Add marks above
      const aboveCount = Math.floor(Math.random() * marksPerChar);
      for (let i = 0; i < aboveCount; i++) {
        const mark =
          MARKS_ABOVE[Math.floor(Math.random() * MARKS_ABOVE.length)];
        result += mark;
      }

      // Add marks below
      const belowCount = Math.floor(Math.random() * marksPerChar);
      for (let i = 0; i < belowCount; i++) {
        const mark =
          MARKS_BELOW[Math.floor(Math.random() * MARKS_BELOW.length)];
        result += mark;
      }

      // Add marks in middle (less frequently)
      if (clampedIntensity > 0.5 && Math.random() < 0.3) {
        const mark =
          MARKS_MIDDLE[Math.floor(Math.random() * MARKS_MIDDLE.length)];
        result += mark;
      }

      return result;
    })
    .join("");
};
