/** @format */

/**
 * Workout configuration constants
 */
export const WORKOUT_CONFIG = {
  // Duration settings (in minutes)
  MIN_DURATION: 15,
  MAX_DURATION: 90,
  DEFAULT_DURATION: 30,
  DURATION_STEP: 5,

  // Rest time settings (in seconds)
  MIN_REST: 30,
  MAX_REST: 180,
  DEFAULT_REST: 60,
  REST_STEP: 15,

  // Warmup/Cooldown settings (in minutes)
  WARMUP_DURATION: 5,
  COOLDOWN_DURATION: 5,
} as const;
