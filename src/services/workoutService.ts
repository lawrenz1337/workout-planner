/** @format */

import { supabase } from "../lib/supabase";
import {
  EnhancedWorkout,
  WorkoutCompletionData,
  PersonalRecord,
  calculateCaloriesBurned,
} from "../types/enhanced-types";
import {
  SaveWorkoutInput,
  SaveWorkoutResult,
  LogSetInput,
  CompleteWorkoutInput,
  WorkoutHistoryOptions,
  WorkoutExerciseWithLogs,
  WorkoutDetails,
  EnhancedExercise,
} from "../types/workout-service";

// ============================================================================
// SAVE WORKOUT
// ============================================================================

/**
 * Save a generated workout to the database
 * Call this when user clicks "Start Workout"
 */
export async function saveWorkout(
  input: SaveWorkoutInput,
): Promise<SaveWorkoutResult> {
  const { userId, generatedWorkout, userWeightKg = 70 } = input;

  // Calculate estimated calories
  const exerciseCategories = [
    ...generatedWorkout.warmup.map((e) => ({
      category: e.exercise.category,
      duration_minutes: (e.target_duration_seconds || 60) / 60,
    })),
    ...generatedWorkout.main_work.map((e) => ({
      category: e.exercise.category,
      duration_minutes:
        ((e.target_reps || 10) * 3 * e.sets + e.rest_seconds * (e.sets - 1)) /
        60,
    })),
    ...generatedWorkout.cooldown.map((e) => ({
      category: e.exercise.category,
      duration_minutes: (e.target_duration_seconds || 60) / 60,
    })),
  ];

  const calorieCalc = calculateCaloriesBurned({
    workout_duration_minutes: generatedWorkout.total_duration_minutes,
    user_weight_kg: userWeightKg,
    exercises: exerciseCategories,
  });

  // 1. Insert workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: userId,
      name: generatedWorkout.name,
      type: generatedWorkout.type,
      duration_minutes: generatedWorkout.total_duration_minutes,
      date: new Date().toISOString().split("T")[0],
      is_template: false,
      calories_burned: calorieCalc.total_calories,
    })
    .select()
    .single();

  if (workoutError || !workout) {
    throw new Error(`Failed to save workout: ${workoutError?.message}`);
  }

  // 2. Insert workout exercises
  const allExercises = [
    ...generatedWorkout.warmup,
    ...generatedWorkout.main_work,
    ...generatedWorkout.cooldown,
  ];

  const workoutExercisesData = allExercises.map((ex) => ({
    workout_id: workout.id,
    exercise_id: ex.exercise.id,
    order_index: ex.order_index,
    sets: ex.sets,
    target_reps: ex.target_reps,
    target_duration_seconds: ex.target_duration_seconds,
    rest_seconds: ex.rest_seconds,
  }));

  const { data: workoutExercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .insert(workoutExercisesData)
    .select();

  if (exercisesError || !workoutExercises) {
    throw new Error(
      `Failed to save workout exercises: ${exercisesError?.message}`,
    );
  }

  // Map order_index to workout_exercise_id for logging during workout
  const workoutExerciseIds: Record<string, string> = {};
  workoutExercises.forEach((we) => {
    workoutExerciseIds[we.order_index] = we.id;
  });

  return {
    workoutId: workout.id,
    workoutExerciseIds,
  };
}

// ============================================================================
// LOG WORKOUT SET
// ============================================================================

/**
 * Log a completed set during an active workout
 */
export async function logWorkoutSet(input: LogSetInput): Promise<void> {
  const { error } = await supabase.from("workout_logs").insert({
    workout_exercise_id: input.workoutExerciseId,
    set_number: input.setNumber,
    reps_completed: input.repsCompleted,
    duration_seconds: input.durationSeconds,
    weight_kg: input.weightKg,
    difficulty_rating: input.difficultyRating,
    form_rating: input.formRating,
    notes: input.notes,
  });

  if (error) {
    throw new Error(`Failed to log set: ${error.message}`);
  }
}

// ============================================================================
// COMPLETE WORKOUT
// ============================================================================

/**
 * Mark workout as completed and calculate final stats
 * Call this when user finishes the workout
 */
export async function completeWorkout(
  input: CompleteWorkoutInput,
): Promise<WorkoutCompletionData> {
  const { workoutId, userId } = input;

  // 1. Get all workout logs to calculate volume
  const { data: workoutExercises, error: weError } = await supabase
    .from("workout_exercises")
    .select("id, exercise_id, exercises(id, name, category)")
    .eq("workout_id", workoutId);

  if (weError) {
    throw new Error(`Failed to fetch workout exercises: ${weError.message}`);
  }

  const workoutExerciseIds = workoutExercises?.map((we) => we.id) || [];

  const { data: logs, error: logsError } = await supabase
    .from("workout_logs")
    .select("*")
    .in("workout_exercise_id", workoutExerciseIds);

  if (logsError) {
    throw new Error(`Failed to fetch workout logs: ${logsError.message}`);
  }

  // Calculate total volume
  const totalVolume =
    logs?.reduce((sum, log) => {
      const reps = log.reps_completed || 0;
      const weight = log.weight_kg || 0;
      return sum + reps * weight;
    }, 0) || 0;

  const setsCompleted = logs?.length || 0;

  // Get total sets from workout_exercises
  let setsTotal = 0;
  if (workoutExercises) {
    for (const we of workoutExercises) {
      // Access sets property from workout_exercises table
      const { data: weData } = await supabase
        .from("workout_exercises")
        .select("sets")
        .eq("id", we.id)
        .single();

      if (weData) {
        setsTotal += weData.sets;
      }
    }
  }

  // 2. Update workout with completion data
  const { error: updateError } = await supabase
    .from("workouts")
    .update({
      completed_at: new Date().toISOString(),
      total_volume: totalVolume,
    })
    .eq("id", workoutId);

  if (updateError) {
    throw new Error(`Failed to update workout: ${updateError.message}`);
  }

  // 3. Check for new personal records
  const newPRs: PersonalRecord[] = [];

  for (const log of logs || []) {
    const workoutExercise = workoutExercises?.find(
      (we) => we.id === log.workout_exercise_id,
    );
    if (!workoutExercise) continue;

    try {
      // Call the database function to check and update PRs
      const { error: prError } = await supabase.rpc("check_personal_record", {
        user_id_param: userId,
        exercise_id_param: workoutExercise.exercise_id,
        workout_log_id_param: log.id,
        reps_completed_param: log.reps_completed,
        weight_kg_param: log.weight_kg,
        duration_seconds_param: log.duration_seconds,
      });

      if (prError) {
        console.error("Error checking PR:", prError);
      }
    } catch (err) {
      console.error("Error checking personal record:", err);
    }
  }

  // 4. Fetch any new PRs that were just created
  const { data: prs } = await supabase
    .from("personal_records")
    .select("*, exercises(*)")
    .eq("user_id", userId)
    .gte("achieved_at", new Date(Date.now() - 60000).toISOString()); // PRs from last minute

  if (prs) {
    newPRs.push(...prs);
  }

  // 5. Get workout details
  const { data: workout } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", workoutId)
    .single();

  return {
    workout_id: workoutId,
    completed_at: new Date().toISOString(),
    total_volume: totalVolume,
    calories_burned: workout?.calories_burned || 0,
    duration_minutes: workout?.duration_minutes || 0,
    new_personal_records: newPRs,
    sets_completed: setsCompleted,
    sets_total: setsTotal,
  };
}

// ============================================================================
// GET WORKOUT HISTORY
// ============================================================================

/**
 * Get user's workout history
 */
export async function getWorkoutHistory(
  userId: string,
  options: WorkoutHistoryOptions = {},
): Promise<EnhancedWorkout[]> {
  const { limit = 50, offset = 0, startDate, endDate, workoutType } = options;

  let query = supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (startDate) {
    query = query.gte("completed_at", startDate);
  }
  if (endDate) {
    query = query.lte("completed_at", endDate);
  }
  if (workoutType) {
    query = query.eq("type", workoutType);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch workout history: ${error.message}`);
  }

  return data || [];
}

// ============================================================================
// GET WORKOUT DETAILS
// ============================================================================

/**
 * Get detailed workout information including exercises and logs
 */
export async function getWorkoutDetails(
  workoutId: string,
): Promise<WorkoutDetails | null> {
  // 1. Get workout
  const { data: workout, error: workoutError } = await supabase
    .from("workouts")
    .select("*")
    .eq("id", workoutId)
    .single();

  if (workoutError || !workout) {
    throw new Error(`Failed to fetch workout: ${workoutError?.message}`);
  }

  // 2. Get workout exercises with exercise details
  const { data: workoutExercises, error: weError } = await supabase
    .from("workout_exercises")
    .select("*, exercises(*)")
    .eq("workout_id", workoutId)
    .order("order_index");

  if (weError) {
    throw new Error(`Failed to fetch workout exercises: ${weError.message}`);
  }

  // 3. Get all logs for these exercises
  const workoutExerciseIds = workoutExercises?.map((we) => we.id) || [];
  const { data: logs, error: logsError } = await supabase
    .from("workout_logs")
    .select("*")
    .in("workout_exercise_id", workoutExerciseIds)
    .order("set_number");

  if (logsError) {
    throw new Error(`Failed to fetch workout logs: ${logsError.message}`);
  }

  // 4. Combine data
  const exercises: WorkoutExerciseWithLogs[] =
    workoutExercises?.map((we) => ({
      id: we.id,
      exercise: we.exercises as EnhancedExercise,
      order_index: we.order_index,
      sets: we.sets,
      target_reps: we.target_reps,
      target_duration_seconds: we.target_duration_seconds,
      rest_seconds: we.rest_seconds,
      notes: we.notes,
      logs: logs?.filter((log) => log.workout_exercise_id === we.id) || [],
    })) || [];

  return {
    ...workout,
    exercises,
  };
}

// ============================================================================
// DELETE WORKOUT
// ============================================================================

/**
 * Delete a workout (cascades to exercises and logs)
 */
export async function deleteWorkout(
  workoutId: string,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("workouts")
    .delete()
    .eq("id", workoutId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to delete workout: ${error.message}`);
  }
}

// ============================================================================
// REPEAT WORKOUT
// ============================================================================

/**
 * Create a new workout based on a previous one
 */
export async function repeatWorkout(
  workoutId: string,
  userId: string,
): Promise<SaveWorkoutResult> {
  // Get the original workout details
  const details = await getWorkoutDetails(workoutId);
  if (!details) {
    throw new Error("Workout not found");
  }

  // Create new workout
  const { data: newWorkout, error: workoutError } = await supabase
    .from("workouts")
    .insert({
      user_id: userId,
      name: details.name,
      type: details.type,
      duration_minutes: details.duration_minutes,
      date: new Date().toISOString().split("T")[0],
      is_template: false,
      calories_burned: details.calories_burned,
    })
    .select()
    .single();

  if (workoutError || !newWorkout) {
    throw new Error(`Failed to create new workout: ${workoutError?.message}`);
  }

  // Copy workout exercises
  const workoutExercisesData = details.exercises.map((ex) => ({
    workout_id: newWorkout.id,
    exercise_id: ex.exercise.id,
    order_index: ex.order_index,
    sets: ex.sets,
    target_reps: ex.target_reps,
    target_duration_seconds: ex.target_duration_seconds,
    rest_seconds: ex.rest_seconds,
  }));

  const { data: workoutExercises, error: exercisesError } = await supabase
    .from("workout_exercises")
    .insert(workoutExercisesData)
    .select();

  if (exercisesError || !workoutExercises) {
    throw new Error(
      `Failed to copy workout exercises: ${exercisesError?.message}`,
    );
  }

  const workoutExerciseIds: Record<string, string> = {};
  workoutExercises.forEach((we) => {
    workoutExerciseIds[we.order_index] = we.id;
  });

  return {
    workoutId: newWorkout.id,
    workoutExerciseIds,
  };
}
