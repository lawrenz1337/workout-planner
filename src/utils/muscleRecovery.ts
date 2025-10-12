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
 * NOTE: Only listing PRIMARY muscles, not secondary/stabilizers
 */
const CATEGORY_TO_MUSCLES: Record<ExerciseCategory, MuscleGroup[]> = {
  upper_push: ["chest", "shoulders", "triceps"],
  upper_pull: ["lats", "upper_back", "biceps"],
  lower_body: ["quads", "hamstrings", "glutes"],
  core: ["abs", "core"],
  cardio: ["cardiovascular"],
  skills: ["coordination"],
  mobility: ["hips", "spine"],
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
  workouts: EnhancedWorkout[],
): MuscleRecoveryStatus[] {
  const now = Date.now();
  const muscleLastTrained = new Map<MuscleGroup, Date>();

  // Get completed workouts sorted by date (most recent first)
  const completedWorkouts = workouts
    .filter((w) => w.completed_at)
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() -
        new Date(a.completed_at!).getTime(),
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
      (timeSinceTraining / recoveryTimeMs) * 100,
    );
    const hoursUntilRecovered = Math.max(
      0,
      (recoveryTimeMs - timeSinceTraining) / (60 * 60 * 1000),
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
 * NOTE: We intentionally avoid marking ALL muscles to prevent over-conservative recovery
 */
function inferMusclesFromWorkout(workout: EnhancedWorkout): MuscleGroup[] {
  const muscles: MuscleGroup[] = [];

  // Use workout duration and type to infer intensity and muscles worked
  const isShortWorkout = workout.duration_minutes < 30;
  const isMediumWorkout =
    workout.duration_minutes >= 30 && workout.duration_minutes < 45;

  if (workout.type === "home") {
    // Home workouts often focus on bodyweight movements
    if (isShortWorkout) {
      // Quick home session - usually core/cardio focused
      muscles.push("core", "abs", "cardiovascular");
    } else if (isMediumWorkout) {
      // Medium home workout - upper body + core emphasis
      muscles.push("chest", "shoulders", "triceps", "core", "abs");
    } else {
      // Full home workout - more comprehensive
      muscles.push(
        "chest",
        "shoulders",
        "triceps",
        "core",
        "abs",
        "quads",
        "glutes",
      );
    }
  } else if (workout.type === "gym") {
    // Gym workouts - assume alternating split (not full body every time)
    if (isShortWorkout) {
      // Quick gym session - upper body focused
      muscles.push("chest", "shoulders", "triceps");
    } else if (isMediumWorkout) {
      // Medium gym - upper or lower split
      // Alternate between upper and lower based on date
      const dayOfMonth = new Date(
        workout.completed_at || workout.date,
      ).getDate();
      if (dayOfMonth % 2 === 0) {
        // Upper body day
        muscles.push(
          "chest",
          "shoulders",
          "triceps",
          "lats",
          "biceps",
          "upper_back",
        );
      } else {
        // Lower body day
        muscles.push("quads", "hamstrings", "glutes", "calves");
      }
    } else {
      // Full gym session - still not everything, assume push/pull/legs rotation
      const dayOfMonth = new Date(
        workout.completed_at || workout.date,
      ).getDate();
      const rotation = dayOfMonth % 3;

      if (rotation === 0) {
        // Push day
        muscles.push("chest", "shoulders", "triceps");
      } else if (rotation === 1) {
        // Pull day
        muscles.push("lats", "upper_back", "biceps", "core");
      } else {
        // Leg day
        muscles.push("quads", "hamstrings", "glutes", "calves");
      }
    }
  } else {
    // Fallback: assume cardio/conditioning
    muscles.push("cardiovascular", "legs");
  }

  return muscles;
}

/**
 * Get muscle groups that are fully recovered and ready to train
 */
export function getRecoveredMuscles(
  workouts: EnhancedWorkout[],
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
  workouts: EnhancedWorkout[],
): MuscleRecoveryStatus[] {
  const recoveryStatus = calculateMuscleRecovery(workouts);
  return recoveryStatus.filter((status) => !status.isRecovered);
}

/**
 * Check if a specific exercise category can be trained based on recovery
 */
export function canTrainCategory(
  category: ExerciseCategory,
  workouts: EnhancedWorkout[],
): boolean {
  const recoveredMuscles = getRecoveredMuscles(workouts);
  const categoryMuscles = CATEGORY_TO_MUSCLES[category];

  // If no muscles defined for category, always allow (skills, mobility, cardio)
  if (!categoryMuscles || categoryMuscles.length === 0) {
    return true;
  }

  // Category is trainable if at least ONE primary muscle is recovered
  // This is less conservative - if any key muscle is ready, you can train that category
  const recoveredCount = categoryMuscles.filter((m) =>
    recoveredMuscles.includes(m),
  ).length;

  // For categories with 1-2 muscles, need at least 1 recovered
  // For categories with 3+ muscles, need at least 33% recovered
  const threshold =
    categoryMuscles.length <= 2 ? 1 : Math.ceil(categoryMuscles.length / 3);

  return recoveredCount >= threshold;
}

/**
 * Suggest workout categories based on recovery status
 */
export function suggestWorkoutCategories(
  workouts: EnhancedWorkout[],
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
