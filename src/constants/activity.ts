/** @format */

import { ActivityLevel } from "../types/enhanced-types";

/**
 * Activity level multipliers for TDEE calculation
 * Based on standard metabolic equations
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
} as const;

/**
 * Human-readable labels for activity levels
 */
export const ACTIVITY_LEVEL_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Sedentary (little/no exercise)",
  light: "Light (1-3 days/week)",
  moderate: "Moderate (3-5 days/week)",
  very_active: "Very Active (6-7 days/week)",
  extra_active: "Extra Active (athlete/physical job)",
} as const;
