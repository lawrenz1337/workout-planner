/** @format */

import {
  Exercise,
  ExerciseCategory,
  ExerciseDifficulty,
  Equipment,
  WorkoutType,
  WorkoutGenerationOptions,
} from "../types/exercise";

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

class WorkoutGeneratorService {
  /**
   * Generate a complete workout based on options
   */
  generateWorkout(
    exercises: Exercise[],
    options: WorkoutGenerationOptions,
  ): GeneratedWorkout {
    const {
      duration_minutes,
      difficulty,
      categories,
      workout_type,
      available_equipment,
      include_warmup,
      include_cooldown,
    } = options;

    // Calculate time allocation
    const warmupTime = include_warmup ? 5 : 0;
    const cooldownTime = include_cooldown ? 5 : 0;
    const mainWorkTime = duration_minutes - warmupTime - cooldownTime;

    // Filter exercises by difficulty, equipment, and location
    const availableExercises = this.filterExercises(
      exercises,
      difficulty,
      available_equipment,
      workout_type,
    );

    // Generate each section
    const warmup = include_warmup
      ? this.generateWarmup(availableExercises, warmupTime)
      : [];

    const mainWork = this.generateMainWork(
      availableExercises,
      categories,
      mainWorkTime,
    );

    const cooldown = include_cooldown
      ? this.generateCooldown(availableExercises, cooldownTime)
      : [];

    return {
      name: this.generateWorkoutName(categories, difficulty),
      type: workout_type,
      warmup,
      main_work: mainWork,
      cooldown,
      total_duration_minutes: duration_minutes,
    };
  }

  /**
   * Filter exercises by difficulty, available equipment, and workout location
   */
  private filterExercises(
    exercises: Exercise[],
    difficulty: ExerciseDifficulty,
    availableEquipment: Equipment[],
    workoutType: WorkoutType,
  ): Exercise[] {
    return exercises.filter((exercise) => {
      // Match difficulty level
      const difficultyMatch =
        exercise.difficulty === difficulty ||
        (difficulty === ExerciseDifficulty.INTERMEDIATE &&
          (exercise.difficulty === ExerciseDifficulty.BEGINNER ||
            exercise.difficulty === ExerciseDifficulty.INTERMEDIATE));

      // Check if all required equipment is available
      const equipmentMatch = exercise.equipment.every((required) =>
        availableEquipment.includes(required as Equipment),
      );

      // Filter by location based on workout type
      const locationMatch =
        workoutType === WorkoutType.HOME
          ? exercise.location === "home" || exercise.location === "both"
          : true; // Gym workouts can use all exercises

      return difficultyMatch && equipmentMatch && locationMatch;
    });
  }

  /**
   * Generate warmup section - uses durationMinutes to calculate exercise count
   */
  private generateWarmup(
    exercises: Exercise[],
    durationMinutes: number,
  ): GeneratedWorkoutExercise[] {
    const warmupExercises = exercises.filter(
      (e) =>
        e.category === ExerciseCategory.MOBILITY ||
        e.category === ExerciseCategory.CARDIO,
    );

    // Calculate how many exercises fit in the allocated time
    const avgWorkTime = 45; // seconds per exercise
    const avgRestTime = 15; // seconds between exercises
    const timePerExercise = avgWorkTime + avgRestTime;

    const exerciseCount = Math.floor((durationMinutes * 60) / timePerExercise);
    const count = Math.max(2, Math.min(exerciseCount, warmupExercises.length));

    const selected = this.selectRandomExercises(warmupExercises, count);

    return selected.map((exercise, index) => ({
      exercise,
      sets: 1,
      target_duration_seconds: exercise.default_duration_seconds || avgWorkTime,
      rest_seconds: avgRestTime,
      order_index: index,
    }));
  }

  /**
   * Generate main work section (~20 minutes)
   */
  private generateMainWork(
    exercises: Exercise[],
    categories: ExerciseCategory[],
    durationMinutes: number,
  ): GeneratedWorkoutExercise[] {
    const workExercises: GeneratedWorkoutExercise[] = [];
    let orderIndex = 0;

    // Filter to requested categories only
    const categoryExercises = exercises.filter((e) =>
      categories.includes(e.category),
    );

    // Balance across categories for a full-body workout
    const exercisesPerCategory = Math.floor(
      (durationMinutes * 60) / (categories.length * 180), // ~3 min per exercise
    );

    for (const category of categories) {
      const categoryPool = categoryExercises.filter(
        (e) => e.category === category,
      );

      if (categoryPool.length === 0) continue;

      // Select exercises for this category
      const selected = this.selectRandomExercises(
        categoryPool,
        Math.max(1, exercisesPerCategory),
      );

      selected.forEach((exercise) => {
        workExercises.push({
          exercise,
          sets: exercise.default_sets,
          target_reps: exercise.default_reps,
          target_duration_seconds: exercise.default_duration_seconds,
          rest_seconds: 60, // Standard rest between sets
          order_index: orderIndex++,
        });
      });
    }

    // Ensure we don't exceed time limit
    return this.optimizeWorkoutDuration(workExercises, durationMinutes);
  }

  /**
   * Generate cooldown section - uses durationMinutes to calculate exercise count
   */
  private generateCooldown(
    exercises: Exercise[],
    durationMinutes: number,
  ): GeneratedWorkoutExercise[] {
    const cooldownExercises = exercises.filter(
      (e) => e.category === ExerciseCategory.MOBILITY,
    );

    // Calculate how many stretches fit in the allocated time
    const avgHoldTime = 60; // seconds per stretch
    const avgRestTime = 10; // seconds between stretches
    const timePerStretch = avgHoldTime + avgRestTime;

    const exerciseCount = Math.floor((durationMinutes * 60) / timePerStretch);
    const count = Math.max(
      2,
      Math.min(exerciseCount, cooldownExercises.length),
    );

    const selected = this.selectRandomExercises(cooldownExercises, count);

    return selected.map((exercise, index) => ({
      exercise,
      sets: 1,
      target_duration_seconds: exercise.default_duration_seconds || avgHoldTime,
      rest_seconds: avgRestTime,
      order_index: index,
    }));
  }

  /**
   * Randomly select N exercises from a pool
   */
  private selectRandomExercises(
    exercises: Exercise[],
    count: number,
  ): Exercise[] {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, exercises.length));
  }

  /**
   * Optimize workout to fit within time constraints
   */
  private optimizeWorkoutDuration(
    exercises: GeneratedWorkoutExercise[],
    targetMinutes: number,
  ): GeneratedWorkoutExercise[] {
    const targetSeconds = targetMinutes * 60;
    let currentDuration = this.calculateWorkoutDuration(exercises);

    // If we're over time, reduce sets or remove exercises
    while (currentDuration > targetSeconds && exercises.length > 0) {
      // Try reducing sets first
      const canReduceSets = exercises.find((e) => e.sets > 2);
      if (canReduceSets) {
        canReduceSets.sets--;
      } else {
        // Remove last exercise if we can't reduce sets
        exercises.pop();
      }
      currentDuration = this.calculateWorkoutDuration(exercises);
    }

    return exercises;
  }

  /**
   * Calculate total duration of workout in seconds
   */
  private calculateWorkoutDuration(
    exercises: GeneratedWorkoutExercise[],
  ): number {
    return exercises.reduce((total, item) => {
      const workTime = item.target_reps
        ? item.target_reps * 3 // Assume 3 seconds per rep
        : item.target_duration_seconds || 0;

      const restTime = item.rest_seconds * (item.sets - 1);
      return total + workTime * item.sets + restTime;
    }, 0);
  }

  /**
   * Generate a descriptive workout name
   */
  private generateWorkoutName(
    categories: ExerciseCategory[],
    difficulty: ExerciseDifficulty,
  ): string {
    const categoryNames = categories.map((c) => c.replace("_", " ")).join(", ");

    const difficultyName =
      difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    return `${difficultyName} ${categoryNames} Workout`;
  }
}

// Export singleton instance
export const workoutGenerator = new WorkoutGeneratorService();
