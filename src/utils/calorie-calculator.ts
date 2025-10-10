/** @format */

import { ActivityLevel, Sex } from "../types/enhanced-types";
import { ACTIVITY_MULTIPLIERS } from "../constants/activity";

export interface BMRParams {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation
 * BMR is the number of calories your body burns at rest
 */
export function calculateBMR(params: BMRParams): number {
  const { weightKg, heightCm, age, sex } = params;

  const bmr =
    sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure
 * TDEE accounts for your activity level to estimate total calories burned per day
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel,
): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}
