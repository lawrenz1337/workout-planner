/** @format */

/**
 * Centralized query keys for React Query
 * This prevents cache collisions and makes it easy to invalidate related queries
 */

export const queryKeys = {
  // Workout-related queries
  workouts: {
    // All workouts for a user (raw data from database)
    all: (userId: string) => ["workouts", "all", userId] as const,

    // Workout history with enhanced data (using workoutService)
    history: (userId: string) => ["workouts", "history", userId] as const,

    // Workout history for streak calculation only
    streak: (userId: string) => ["workouts", "streak", userId] as const,

    // Individual workout details
    detail: (workoutId: string) => ["workouts", "detail", workoutId] as const,
  },

  // Personal records queries
  personalRecords: {
    // All personal records for a user
    all: (userId: string) => ["personal_records", userId] as const,

    // Personal records for a specific exercise
    byExercise: (userId: string, exerciseId: string) =>
      ["personal_records", userId, "exercise", exerciseId] as const,
  },

  // Exercise-related queries
  exercises: {
    // All exercises
    all: () => ["exercises"] as const,

    // Exercises by category
    byCategory: (category: string) =>
      ["exercises", "category", category] as const,
  },

  // User profile queries
  user: {
    profile: (userId: string) => ["user", "profile", userId] as const,
    bmi: (userId: string) => ["user", "bmi", userId] as const,
  },
} as const;
