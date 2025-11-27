/**
 * Formats seconds into MM:SS format
 * @param seconds - The number of seconds to format
 * @returns Formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  // Handle edge cases
  if (seconds < 0) {
    seconds = 0;
  }

  // Calculate minutes and seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Pad with leading zeros
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};
