/** @format */

import { supabase } from "../lib/supabase";
import {
  GeneratedWorkout,
  GeneratedWorkoutExercise,
} from "../types/workout-service";
import { WorkoutType, Exercise } from "../types/exercise";

// ============================================================================
// CONSTANTS
// ============================================================================

export const WORKOUT_SECTIONS = {
  WARMUP: "warmup",
  MAIN: "main",
  COOLDOWN: "cooldown",
} as const;

export type WorkoutSection =
  (typeof WORKOUT_SECTIONS)[keyof typeof WORKOUT_SECTIONS];

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WorkoutTemplate {
  id: string;
  user_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes: number;
  is_template: boolean;
  created_at: string;
}

export interface TemplateExercise {
  id: string;
  exercise_id: string;
  order_index: number;
  sets: number;
  target_reps?: number;
  target_duration_seconds?: number;
  rest_seconds: number;
  notes?: string; // Using this to store section: 'warmup' | 'main' | 'cooldown'
  exercises: Exercise; // Full exercise object from join
}

export interface TemplateWithExercises extends WorkoutTemplate {
  workout_exercises: TemplateExercise[];
}

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all templates for a user
 */
export async function fetchUserTemplates(
  userId: string,
): Promise<WorkoutTemplate[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .eq("is_template", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Fetch a single template with all exercise details
 */
export async function fetchTemplateDetails(
  templateId: string,
): Promise<TemplateWithExercises> {
  const { data: template, error: templateError } = await supabase
    .from("workouts")
    .select(
      `
      *,
      workout_exercises(
        *,
        exercises(*)
      )
    `,
    )
    .eq("id", templateId)
    .eq("is_template", true)
    .single();

  if (templateError) throw templateError;
  if (!template) throw new Error("Template not found");

  // Sort exercises by order_index
  if (template.workout_exercises) {
    template.workout_exercises.sort(
      (a: TemplateExercise, b: TemplateExercise) =>
        a.order_index - b.order_index,
    );
  }

  return template as TemplateWithExercises;
}

// ============================================================================
// CREATE OPERATION
// ============================================================================

/**
 * Save a generated workout as a template
 */
export async function saveAsTemplate(
  userId: string,
  generatedWorkout: GeneratedWorkout,
  templateName: string,
): Promise<string> {
  // 1. Create template workout
  const { data: template, error: templateError } = await supabase
    .from("workouts")
    .insert({
      user_id: userId,
      name: templateName,
      type: generatedWorkout.type,
      duration_minutes: generatedWorkout.total_duration_minutes,
      date: new Date().toISOString().split("T")[0],
      is_template: true,
    })
    .select()
    .single();

  if (templateError || !template) {
    throw new Error(`Failed to save template: ${templateError?.message}`);
  }

  // 2. Save template exercises with section tags
  // Store section in 'notes' field temporarily (warmup/main/cooldown)
  const allExercises: Array<{
    exercise: GeneratedWorkoutExercise;
    section: WorkoutSection;
  }> = [
    ...generatedWorkout.warmup.map((e) => ({
      exercise: e,
      section: WORKOUT_SECTIONS.WARMUP as WorkoutSection,
    })),
    ...generatedWorkout.main_work.map((e) => ({
      exercise: e,
      section: WORKOUT_SECTIONS.MAIN as WorkoutSection,
    })),
    ...generatedWorkout.cooldown.map((e) => ({
      exercise: e,
      section: WORKOUT_SECTIONS.COOLDOWN as WorkoutSection,
    })),
  ];

  const exercisesData = allExercises.map(({ exercise: ex, section }) => ({
    workout_id: template.id,
    exercise_id: ex.exercise.id,
    order_index: ex.order_index,
    sets: ex.sets,
    target_reps: ex.target_reps,
    target_duration_seconds: ex.target_duration_seconds,
    rest_seconds: ex.rest_seconds,
    notes: section, // Store section identifier
  }));

  const { error: exercisesError } = await supabase
    .from("workout_exercises")
    .insert(exercisesData);

  if (exercisesError) {
    // Rollback template if exercises fail
    await supabase.from("workouts").delete().eq("id", template.id);
    throw new Error(
      `Failed to save template exercises: ${exercisesError.message}`,
    );
  }

  return template.id;
}

// ============================================================================
// DELETE OPERATION
// ============================================================================

/**
 * Delete a template (cascade will handle workout_exercises)
 */
export async function deleteTemplate(
  templateId: string,
  userId: string,
): Promise<void> {
  const { error, count } = await supabase
    .from("workouts")
    .delete({ count: "exact" })
    .eq("id", templateId)
    .eq("user_id", userId)
    .eq("is_template", true);

  if (error) {
    throw new Error(`Failed to delete template: ${error.message}`);
  }

  // Verify that a template was actually deleted
  if (count === 0) {
    throw new Error(
      "Template not found or you don't have permission to delete it",
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert template exercise to GeneratedWorkoutExercise format
 */
function convertTemplateExercise(
  exercise: TemplateExercise,
): GeneratedWorkoutExercise {
  return {
    exercise: exercise.exercises,
    sets: exercise.sets,
    target_reps: exercise.target_reps,
    target_duration_seconds: exercise.target_duration_seconds,
    rest_seconds: exercise.rest_seconds,
    order_index: exercise.order_index,
  };
}

/**
 * Filter exercises by section
 */
function filterBySection(
  exercises: TemplateExercise[],
  section: WorkoutSection,
): GeneratedWorkoutExercise[] {
  return exercises
    .filter((e) => e.notes === section)
    .map(convertTemplateExercise);
}

/**
 * Convert template to GeneratedWorkout format for starting a workout
 */
export function templateToGeneratedWorkout(
  template: TemplateWithExercises,
): GeneratedWorkout {
  const exercises = template.workout_exercises || [];

  // Group by section (stored in notes field)
  const warmup = filterBySection(exercises, WORKOUT_SECTIONS.WARMUP);
  const mainWork = filterBySection(exercises, WORKOUT_SECTIONS.MAIN);
  const cooldown = filterBySection(exercises, WORKOUT_SECTIONS.COOLDOWN);

  return {
    name: template.name,
    type: template.type,
    warmup,
    main_work: mainWork,
    cooldown,
    total_duration_minutes: template.duration_minutes,
  };
}
