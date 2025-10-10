/** @format */

// Types for workout service layer and shared workout-related interfaces

import {
  EnhancedWorkout,
  EnhancedWorkoutLog,
  EnhancedExercise,
  WorkoutType,
} from "./enhanced-types";
import { Exercise } from "./exercise";

// Re-export types that are needed in workout service context
export type { EnhancedExercise, EnhancedWorkoutLog } from "./enhanced-types";

// ============================================================================
// GENERATED WORKOUT TYPES (from workoutGenerator.ts)
// ============================================================================

export interface GeneratedWorkoutExercise {
  exercise: Exercise;
  sets: number;
  target_reps?: number;
  target_duration_seconds?: number;
  rest_seconds: number;
  order_index: number;
}

export interface GeneratedWorkout {
  name: string;
  type: WorkoutType;
  warmup: GeneratedWorkoutExercise[];
  main_work: GeneratedWorkoutExercise[];
  cooldown: GeneratedWorkoutExercise[];
  total_duration_minutes: number;
}

// ============================================================================
// WORKOUT DETAILS TYPES (shared across components and services)
// ============================================================================

export interface WorkoutExerciseWithLogs {
  id: string;
  exercise: EnhancedExercise;
  order_index: number;
  sets: number;
  target_reps?: number;
  target_duration_seconds?: number;
  rest_seconds: number;
  notes?: string;
  logs: EnhancedWorkoutLog[];
}

export interface WorkoutDetails extends EnhancedWorkout {
  exercises: WorkoutExerciseWithLogs[];
}

// ============================================================================
// WORKOUT TRACKER TYPES
// ============================================================================

export type WorkoutSection = "warmup" | "main" | "cooldown";

export interface SetLog {
  completed: boolean;
  reps?: number;
  duration?: number;
}

// ============================================================================
// SERVICE INPUT/OUTPUT TYPES
// ============================================================================

export interface SaveWorkoutInput {
  userId: string;
  generatedWorkout: GeneratedWorkout;
  userWeightKg?: number;
}

export interface SaveWorkoutResult {
  workoutId: string;
  workoutExerciseIds: Record<string, string>; // Maps order_index to workout_exercise_id
}

export interface LogSetInput {
  workoutExerciseId: string;
  setNumber: number;
  repsCompleted?: number;
  durationSeconds?: number;
  weightKg?: number;
  difficultyRating?: number;
  formRating?: number;
  notes?: string;
}

export interface CompleteWorkoutInput {
  workoutId: string;
  userId: string;
}

export interface WorkoutHistoryOptions {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
  workoutType?: WorkoutType;
}
