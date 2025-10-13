/** @format */

// Enhanced types for future-proofed schema

import {
  ExerciseCategory,
  ExerciseLocation,
  ExerciseDifficulty,
  Equipment,
  WorkoutType,
} from "./exercise";

// ============================================================================
// MUSCLE GROUPS
// ============================================================================

export type MuscleGroup =
  | "chest"
  | "shoulders"
  | "triceps"
  | "biceps"
  | "forearms"
  | "lats"
  | "upper_back"
  | "lower_back"
  | "abs"
  | "obliques"
  | "core"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "hip_flexors"
  | "ankles"
  | "wrists"
  | "spine"
  | "hips"
  | "legs"
  | "full_body"
  | "cardiovascular"
  | "coordination"
  | "balance";

// ============================================================================
// ENHANCED EXERCISE TYPE
// ============================================================================

export interface EnhancedExercise {
  id: string;
  user_id?: string;
  name: string;
  category: ExerciseCategory;
  location: ExerciseLocation;
  difficulty: ExerciseDifficulty;
  equipment: Equipment[];
  description: string;
  form_cues: string[];
  video_url?: string;
  image_url?: string;
  default_sets: number;
  default_reps?: number;
  default_duration_seconds?: number;
  is_default: boolean;
  progression_exercise_id?: string;
  regression_exercise_id?: string;
  muscles_primary: MuscleGroup[];
  muscles_secondary: MuscleGroup[];
  created_at: string;
}

// ============================================================================
// ENHANCED WORKOUT TYPE
// ============================================================================

export interface EnhancedWorkout {
  id: string;
  user_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes: number;
  date: string;
  is_template: boolean;
  notes?: string;
  completed_at?: string;
  total_volume: number;
  calories_burned?: number;
  created_at: string;
}

// ============================================================================
// ENHANCED WORKOUT LOG
// ============================================================================

export interface EnhancedWorkoutLog {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps_completed?: number;
  duration_seconds?: number;
  weight_kg?: number;
  difficulty_rating?: number; // 1-5
  form_rating?: number; // 1-5
  perceived_exertion?: number; // 1-10 (RPE scale)
  notes?: string;
  completed_at: string;
}

// ============================================================================
// PERSONAL RECORDS
// ============================================================================

export type RecordType =
  | "max_reps"
  | "max_weight"
  | "max_duration"
  | "total_volume";

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  exercise?: EnhancedExercise; // Joined data (singular for code consistency)
  exercises?: EnhancedExercise; // Joined data (plural from Supabase)
  record_type: RecordType;
  value: number;
  workout_log_id?: string;
  achieved_at: string;
  notes?: string;
}

// ============================================================================
// BODY METRICS
// ============================================================================

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
  neck?: number;
  [key: string]: number | undefined; // Allow custom measurements
}

export interface BodyMetrics {
  id: string;
  user_id: string;
  date: string;
  weight_kg?: number;
  body_fat_percentage?: number;
  measurements?: BodyMeasurements;
  progress_photos?: string[];
  notes?: string;
  created_at: string;
}

// ============================================================================
// ENHANCED USER PREFERENCES
// ============================================================================

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "extra_active";
export type Sex = "male" | "female" | "other";

export interface EnhancedUserPreferences {
  user_id: string;
  default_workout_duration: number;
  warmup_duration: number;
  cooldown_duration: number;
  default_rest_between_sets: number;
  difficulty_level: ExerciseDifficulty;
  available_equipment: Equipment[];
  weight_kg?: number;
  height_cm?: number;
  age?: number;
  sex?: Sex;
  activity_level: ActivityLevel;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface WorkoutFrequency {
  date: string;
  count: number;
  total_duration: number;
  total_volume: number;
  calories_burned: number;
}

export interface CategoryStats {
  category: ExerciseCategory;
  total_sets: number;
  total_reps: number;
  total_volume: number;
  percentage: number;
  muscle_groups: MuscleGroup[];
}

export interface ExerciseProgress {
  date: string;
  exercise_id: string;
  exercise_name: string;
  max_reps: number;
  avg_reps: number;
  max_weight: number;
  avg_weight: number;
  total_volume: number;
  sets_completed: number;
}

export interface VolumeOverTime {
  date: string;
  total_volume: number;
  workout_count: number;
  avg_volume_per_workout: number;
}

export interface MuscleGroupStats {
  muscle_group: MuscleGroup;
  total_sets: number;
  total_volume: number;
  percentage: number;
  last_trained: string;
  exercises_count: number;
}

export interface WorkoutStreak {
  current_streak: number;
  longest_streak: number;
  last_workout_date: string;
  total_workouts: number;
}

export interface ProgressSummary {
  total_workouts: number;
  total_volume: number;
  total_calories: number;
  avg_workout_duration: number;
  current_streak: number;
  personal_records_count: number;
  favorite_category: ExerciseCategory;
  most_improved_exercise: string;
}

// ============================================================================
// CALORIE CALCULATION
// ============================================================================

export interface CalorieCalculationInput {
  workout_duration_minutes: number;
  user_weight_kg: number;
  exercises: {
    category: ExerciseCategory;
    duration_minutes: number;
  }[];
  user_age?: number;
  user_sex?: Sex;
}

export interface CalorieCalculationResult {
  total_calories: number;
  calories_per_category: Record<ExerciseCategory, number>;
  met_values_used: Record<ExerciseCategory, number>;
}

// MET (Metabolic Equivalent of Task) values for different exercise categories
export const MET_VALUES: Record<ExerciseCategory, number> = {
  upper_push: 6.0,
  upper_pull: 6.0,
  lower_body: 7.0,
  core: 4.5,
  cardio: 8.0,
  skills: 5.0,
  mobility: 2.5,
};

// ============================================================================
// WORKOUT COMPLETION DATA
// ============================================================================

export interface WorkoutCompletionData {
  workout_id: string;
  completed_at: string;
  total_volume: number;
  calories_burned: number;
  duration_minutes: number;
  new_personal_records: PersonalRecord[];
  sets_completed: number;
  sets_total: number;
}

// ============================================================================
// FILTER AND QUERY TYPES
// ============================================================================

export interface WorkoutHistoryFilters {
  start_date?: string;
  end_date?: string;
  workout_type?: WorkoutType;
  categories?: ExerciseCategory[];
  min_duration?: number;
  max_duration?: number;
}

export interface ProgressAnalyticsFilters {
  date_range: "week" | "month" | "quarter" | "year" | "all";
  categories?: ExerciseCategory[];
  muscle_groups?: MuscleGroup[];
  exercise_id?: string;
}

// ============================================================================
// RE-EXPORT BASE TYPES
// ============================================================================

export type {
  Exercise,
  Workout,
  WorkoutExercise,
  WorkoutLog,
  UserPreferences,
  WorkoutGenerationOptions,
} from "./exercise";

export {
  ExerciseCategory,
  ExerciseLocation,
  ExerciseDifficulty,
  Equipment,
  WorkoutType,
  getCategoryDisplayName,
  getCategoryIcon,
  getEquipmentDisplayName,
} from "./exercise";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate calories burned using MET formula
 * Calories = MET × weight(kg) × duration(hours)
 */
export function calculateCaloriesBurned(
  input: CalorieCalculationInput,
): CalorieCalculationResult {
  const calories_per_category: Record<string, number> = {};
  let total_calories = 0;

  for (const exercise of input.exercises) {
    const met = MET_VALUES[exercise.category];
    const duration_hours = exercise.duration_minutes / 60;
    const calories = met * input.user_weight_kg * duration_hours;

    calories_per_category[exercise.category] =
      (calories_per_category[exercise.category] || 0) + calories;
    total_calories += calories;
  }

  return {
    total_calories: Math.round(total_calories),
    calories_per_category: calories_per_category as Record<
      ExerciseCategory,
      number
    >,
    met_values_used: MET_VALUES,
  };
}

/**
 * Get display name for muscle group
 */
export function getMuscleGroupDisplayName(muscle: MuscleGroup): string {
  const displayNames: Record<MuscleGroup, string> = {
    chest: "Chest",
    shoulders: "Shoulders",
    triceps: "Triceps",
    biceps: "Biceps",
    forearms: "Forearms",
    lats: "Lats",
    upper_back: "Upper Back",
    lower_back: "Lower Back",
    abs: "Abs",
    obliques: "Obliques",
    core: "Core",
    quads: "Quadriceps",
    hamstrings: "Hamstrings",
    glutes: "Glutes",
    legs: "Legs",
    calves: "Calves",
    hip_flexors: "Hip Flexors",
    ankles: "Ankles",
    wrists: "Wrists",
    spine: "Spine",
    hips: "Hips",
    full_body: "Full Body",
    cardiovascular: "Cardiovascular",
    coordination: "Coordination",
    balance: "Balance",
  };
  return displayNames[muscle];
}

/**
 * Get emoji icon for muscle group
 */
export function getMuscleGroupIcon(muscle: MuscleGroup): string {
  const icons: Record<MuscleGroup, string> = {
    chest: "💪",
    shoulders: "🏋️",
    triceps: "💪",
    biceps: "💪",
    forearms: "🤜",
    lats: "🦅",
    upper_back: "🦅",
    lower_back: "🦴",
    abs: "🎯",
    obliques: "🎯",
    core: "🎯",
    quads: "🦵",
    legs: "🦵",
    hamstrings: "🦵",
    glutes: "🍑",
    calves: "🦵",
    hip_flexors: "🦵",
    ankles: "🦶",
    wrists: "🤚",
    spine: "🦴",
    hips: "🦴",
    full_body: "🔥",
    cardiovascular: "❤️",
    coordination: "🎪",
    balance: "🧘",
  };
  return icons[muscle] || "💪";
}

/**
 * Get color for muscle group (for charts/visualizations)
 */
export function getMuscleGroupColor(muscle: MuscleGroup): string {
  const colors: Record<MuscleGroup, string> = {
    chest: "#ef4444",
    shoulders: "#f97316",
    triceps: "#f59e0b",
    biceps: "#eab308",
    forearms: "#84cc16",
    lats: "#22c55e",
    upper_back: "#10b981",
    lower_back: "#14b8a6",
    abs: "#06b6d4",
    obliques: "#0ea5e9",
    core: "#3b82f6",
    quads: "#6366f1",
    hamstrings: "#8b5cf6",
    glutes: "#a855f7",
    calves: "#c026d3",
    hip_flexors: "#d946ef",
    ankles: "#ec4899",
    wrists: "#f43f5e",
    spine: "#94a3b8",
    hips: "#64748b",
    legs: "#6918fb",
    full_body: "#14b8a6",
    cardiovascular: "#ef4444",
    coordination: "#f59e0b",
    balance: "#8b5cf6",
  };
  return colors[muscle] || "#14b8a6";
}

/**
 * Calculate workout volume from logs
 */
export function calculateTotalVolume(logs: EnhancedWorkoutLog[]): number {
  return logs.reduce((total, log) => {
    const reps = log.reps_completed || 0;
    const weight = log.weight_kg || 0;
    return total + reps * weight;
  }, 0);
}

/**
 * Calculate current workout streak
 */
export function calculateStreak(workouts: EnhancedWorkout[]): WorkoutStreak {
  if (workouts.length === 0) {
    return {
      current_streak: 0,
      longest_streak: 0,
      last_workout_date: "",
      total_workouts: 0,
    };
  }

  const sortedWorkouts = [...workouts]
    .filter((w) => w.completed_at)
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() -
        new Date(a.completed_at!).getTime(),
    );

  if (sortedWorkouts.length === 0) {
    return {
      current_streak: 0,
      longest_streak: 0,
      last_workout_date: "",
      total_workouts: 0,
    };
  }

  let current_streak = 0;
  let longest_streak = 0;
  let temp_streak = 1;
  let streak_active = false;

  // Check if streak is active (most recent workout is today or yesterday)
  const most_recent = new Date(sortedWorkouts[0].completed_at!);
  most_recent.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (
    most_recent.getTime() === today.getTime() ||
    most_recent.getTime() === yesterday.getTime()
  ) {
    streak_active = true;
    current_streak = 1;
  }

  // Calculate streaks by going through workouts from most recent to oldest
  for (let i = 1; i < sortedWorkouts.length; i++) {
    const current_date = new Date(sortedWorkouts[i].completed_at!);
    current_date.setHours(0, 0, 0, 0);

    const previous_date = new Date(sortedWorkouts[i - 1].completed_at!);
    previous_date.setHours(0, 0, 0, 0);

    const day_diff = Math.floor(
      (previous_date.getTime() - current_date.getTime()) / 86400000,
    );

    if (day_diff === 1) {
      // Consecutive day
      temp_streak++;
      if (streak_active) {
        current_streak++;
      }
    } else if (day_diff > 1) {
      // Gap in streak
      longest_streak = Math.max(longest_streak, temp_streak);
      temp_streak = 1;
      streak_active = false;
    }
    // day_diff === 0 means same day, don't increment
  }

  // Update longest streak with final temp_streak and current_streak
  longest_streak = Math.max(longest_streak, temp_streak, current_streak);

  return {
    current_streak,
    longest_streak,
    last_workout_date: sortedWorkouts[0]?.completed_at || "",
    total_workouts: sortedWorkouts.length,
  };
}

/**
 * Format duration for display
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

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${volume} kg`;
}
