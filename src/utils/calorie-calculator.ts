/** @format */

import { ActivityLevel, Sex } from "../types/enhanced-types";
import { ACTIVITY_MULTIPLIERS } from "../constants/activity";

export interface BMRParams {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: Sex;
}

export interface BMIParams {
  weightKg: number;
  heightCm: number;
}

export interface BMIResult {
  bmi: number;
  category: "underweight" | "normal" | "overweight" | "obese";
  categoryLabel: string;
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

/**
 * Calculate Body Mass Index (BMI)
 * BMI = weight(kg) / (height(m))^2
 */
export function calculateBMI(params: BMIParams): BMIResult {
  const { weightKg, heightCm } = params;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BMIResult["category"];
  let categoryLabel: string;

  if (bmi < 18.5) {
    category = "underweight";
    categoryLabel = "Underweight";
  } else if (bmi < 25) {
    category = "normal";
    categoryLabel = "Normal Weight";
  } else if (bmi < 30) {
    category = "overweight";
    categoryLabel = "Overweight";
  } else {
    category = "obese";
    categoryLabel = "Obese";
  }

  return {
    bmi: Math.round(bmi * 10) / 10, // Round to 1 decimal
    category,
    categoryLabel,
  };
}
