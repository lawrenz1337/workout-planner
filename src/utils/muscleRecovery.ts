/** @format */

import { EnhancedWorkout, MuscleGroup } from "../types/enhanced-types";
import { ExerciseCategory } from "../types/exercise";

/**
 * Recovery times in hours for different muscle groups
 * Based on training intensity and muscle size
 */
const RECOVERY_TIMES: Record<MuscleGroup, number> = {
  // Large muscle groups - longer recovery
  chest: 48,
  lats: 48,
  quads: 48,
  hamstrings: 48,
  glutes: 48,
  legs: 48,

  // Medium muscle groups
  shoulders: 36,
  upper_back: 36,
  lower_back: 48, // Longer due to importance
  core: 24,
  abs: 24,
  obliques: 24,

  // Smaller muscle groups - faster recovery
  biceps: 24,
  triceps: 24,
  forearms: 24,
  calves: 24,

  // Joints and mobility
  hip_flexors: 24,
  ankles: 24,
  wrists: 24,
  spine: 48,
  hips: 36,

  // Special categories
  full_body: 48,
  cardiovascular: 24,
  coordination: 24,
  balance: 24,
};

/**
 * Map exercise categories to primary muscle groups they train
 */
const CATEGORY_TO_MUSCLES: Record<ExerciseCategory, MuscleGroup[]> = {
  upper_push: ["chest", "shoulders", "triceps"],
  upper_pull: ["lats", "upper_back", "biceps"],
  lower_body: ["quads", "hamstrings", "glutes", "calves"],
  core: ["abs", "obliques", "core"],
  cardio: ["cardiovascular", "legs"],
  skills: ["coordination", "full_body"],
  mobility: ["hips", "shoulders", "spine"],
};

export interface MuscleRecoveryStatus {
  muscle: MuscleGroup;
  isRecovered: boolean;
  hoursUntilRecovered: number;
  percentRecovered: number;
  lastTrained?: string;
}

/**
 * Calculate recovery status for all muscle groups based on workout history
 */
export function calculateMuscleRecovery(
  workouts: EnhancedWorkout[]
): MuscleRecoveryStatus[] {
  const now = Date.now();
  const muscleLastTrained = new Map<MuscleGroup, Date>();

  // Get completed workouts sorted by date (most recent first)
  const completedWorkouts = workouts
    .filter((w) => w.completed_at)
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() -
        new Date(a.completed_at!).getTime()
    );

  // Find last trained date for each muscle group
  // We infer muscles from workout type and duration
  for (const workout of completedWorkouts) {
    const workoutDate = new Date(workout.completed_at!);
    const musclesWorked = inferMusclesFromWorkout(workout);

    for (const muscle of musclesWorked) {
      if (!muscleLastTrained.has(muscle)) {
        muscleLastTrained.set(muscle, workoutDate);
      }
    }
  }

  // Calculate recovery status for each muscle group
  const allMuscles = Object.keys(RECOVERY_TIMES) as MuscleGroup[];

  return allMuscles.map((muscle) => {
    const lastTrained = muscleLastTrained.get(muscle);
    const recoveryTimeMs = RECOVERY_TIMES[muscle] * 60 * 60 * 1000;

    if (!lastTrained) {
      // Never trained = fully recovered
      return {
        muscle,
        isRecovered: true,
        hoursUntilRecovered: 0,
        percentRecovered: 100,
      };
    }

    const timeSinceTraining = now - lastTrained.getTime();
    const percentRecovered = Math.min(
      100,
      (timeSinceTraining / recoveryTimeMs) * 100
    );
    const hoursUntilRecovered = Math.max(
      0,
      (recoveryTimeMs - timeSinceTraining) / (60 * 60 * 1000)
    );

    return {
      muscle,
      isRecovered: percentRecovered >= 100,
      hoursUntilRecovered: Math.round(hoursUntilRecovered),
      percentRecovered: Math.round(percentRecovered),
      lastTrained: lastTrained.toISOString(),
    };
  });
}

/**
 * Infer which muscle groups were trained based on workout type
 * This is a simplified approach - ideally you'd track actual exercises performed
 */
function inferMusclesFromWorkout(workout: EnhancedWorkout): MuscleGroup[] {
  const muscles: MuscleGroup[] = [];

  // Use workout duration and type to infer intensity and muscles worked
  const isShortWorkout = workout.duration_minutes < 30;

  if (workout.type === "home") {
    // Home workouts often focus on bodyweight movements
    if (isShortWorkout) {
      // Quick home session - usually core/cardio focused
      muscles.push("core", "abs", "cardiovascular", "legs");
    } else {
      // Full home workout - bodyweight compound movements
      muscles.push(
        "chest",
        "shoulders",
        "triceps",
        "core",
        "abs",
        "quads",
        "glutes",
        "calves"
      );
    }
  } else if (workout.type === "gym") {
    // Gym workouts - more targeted muscle work
    if (isShortWorkout) {
      // Quick gym session - might be upper or lower focus
      // Alternate assumption: upper body focused
      muscles.push("chest", "shoulders", "triceps", "biceps", "upper_back");
    } else {
      // Full gym session - comprehensive training
      muscles.push(
        "chest",
        "shoulders",
        "triceps",
        "lats",
        "upper_back",
        "biceps",
        "quads",
        "hamstrings",
        "glutes",
        "calves",
        "core"
      );
    }
  } else {
    // Fallback: assume general full-body workout
    muscles.push("full_body", "cardiovascular");
  }

  return muscles;
}

/**
 * Get muscle groups that are fully recovered and ready to train
 */
export function getRecoveredMuscles(
  workouts: EnhancedWorkout[]
): MuscleGroup[] {
  const recoveryStatus = calculateMuscleRecovery(workouts);
  return recoveryStatus
    .filter((status) => status.isRecovered)
    .map((status) => status.muscle);
}

/**
 * Get muscle groups that are still recovering
 */
export function getFatiguedMuscles(
  workouts: EnhancedWorkout[]
): MuscleRecoveryStatus[] {
  const recoveryStatus = calculateMuscleRecovery(workouts);
  return recoveryStatus.filter((status) => !status.isRecovered);
}

/**
 * Check if a specific exercise category can be trained based on recovery
 */
export function canTrainCategory(
  category: ExerciseCategory,
  workouts: EnhancedWorkout[]
): boolean {
  const recoveredMuscles = getRecoveredMuscles(workouts);
  const categoryMuscles = CATEGORY_TO_MUSCLES[category];

  // Category is trainable if at least 50% of its muscles are recovered
  const recoveredCount = categoryMuscles.filter((m) =>
    recoveredMuscles.includes(m)
  ).length;

  return recoveredCount >= categoryMuscles.length / 2;
}

/**
 * Suggest workout categories based on recovery status
 */
export function suggestWorkoutCategories(
  workouts: EnhancedWorkout[]
): ExerciseCategory[] {
  const categories = Object.keys(CATEGORY_TO_MUSCLES) as ExerciseCategory[];

  return categories.filter((category) => canTrainCategory(category, workouts));
}

/**
 * Get a user-friendly recovery message
 */
export function getRecoveryMessage(status: MuscleRecoveryStatus): string {
  if (status.isRecovered) {
    return "Ready to train";
  }

  if (status.hoursUntilRecovered < 6) {
    return "Almost recovered";
  }

  if (status.hoursUntilRecovered < 24) {
    return `${status.hoursUntilRecovered}h rest needed`;
  }

  const days = Math.ceil(status.hoursUntilRecovered / 24);
  return `${days} day${days > 1 ? "s" : ""} rest needed`;
}
