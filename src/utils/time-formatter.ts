/** @format */

/**
 * Format seconds into MM:SS format
 * @example formatTime(65) // "1:05"
 * @example formatTime(3661) // "61:01"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Format seconds into human-readable duration
 * @example formatDuration(65) // "1m 5s"
 * @example formatDuration(3661) // "1h 1m"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
