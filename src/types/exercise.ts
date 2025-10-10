/** @format */

// Exercise category enum
export enum ExerciseCategory {
  UPPER_PUSH = "upper_push",
  UPPER_PULL = "upper_pull",
  LOWER_BODY = "lower_body",
  CORE = "core",
  CARDIO = "cardio",
  SKILLS = "skills",
  MOBILITY = "mobility",
}

// Exercise location enum
export enum ExerciseLocation {
  HOME = "home",
  GYM = "gym",
  BOTH = "both",
}

// Exercise difficulty enum
export enum ExerciseDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

// Equipment types
export enum Equipment {
  BODYWEIGHT_ONLY = "bodyweight_only",
  PULL_UP_BAR = "pull_up_bar",
  PARALLETTES = "parallettes",
  DIP_BARS = "dip_bars",
  RINGS = "rings",
  RESISTANCE_BANDS = "resistance_bands",
  YOGA_MAT = "yoga_mat",
  WALL = "wall",
  BENCH = "bench",
  BARBELL = "barbell",
  DUMBBELLS = "dumbbells",
  KETTLEBELL = "kettlebell",
  AB_ROLLER = "ab_roller",
  JUMP_ROPE = "jump_rope",
}

// Exercise interface
export interface Exercise {
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
  created_at: string;
}

// Workout type enum
export enum WorkoutType {
  HOME = "home",
  GYM = "gym",
}

// Workout interface
export interface Workout {
  id: string;
  user_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes: number;
  date: string;
  is_template: boolean;
  notes?: string;
  created_at: string;
}

// Workout exercise interface
export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise?: Exercise; // Joined data
  order_index: number;
  sets: number;
  target_reps?: number;
  target_duration_seconds?: number;
  rest_seconds: number;
  notes?: string;
}

// Workout log interface
export interface WorkoutLog {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  reps_completed?: number;
  duration_seconds?: number;
  weight_kg?: number;
  difficulty_rating?: number; // 1-5
  completed_at: string;
}

// User preferences interface
export interface UserPreferences {
  user_id: string;
  default_workout_duration: number;
  warmup_duration: number;
  cooldown_duration: number;
  default_rest_between_sets: number;
  difficulty_level: ExerciseDifficulty;
  available_equipment: Equipment[];
}

// Workout generation options
export interface WorkoutGenerationOptions {
  duration_minutes: number;
  categories: ExerciseCategory[];
  difficulty: ExerciseDifficulty;
  workout_type: WorkoutType;
  available_equipment: Equipment[];
  include_warmup: boolean;
  include_cooldown: boolean;
}

// Helper function to get category display name
export function getCategoryDisplayName(category: ExerciseCategory): string {
  const displayNames: Record<ExerciseCategory, string> = {
    [ExerciseCategory.UPPER_PUSH]: "Upper Push",
    [ExerciseCategory.UPPER_PULL]: "Upper Pull",
    [ExerciseCategory.LOWER_BODY]: "Lower Body",
    [ExerciseCategory.CORE]: "Core",
    [ExerciseCategory.CARDIO]: "Cardio",
    [ExerciseCategory.SKILLS]: "Skills",
    [ExerciseCategory.MOBILITY]: "Mobility",
  };
  return displayNames[category];
}

// Helper function to get category icon
export function getCategoryIcon(category: ExerciseCategory): string {
  const icons: Record<ExerciseCategory, string> = {
    [ExerciseCategory.UPPER_PUSH]: "💪",
    [ExerciseCategory.UPPER_PULL]: "🤸",
    [ExerciseCategory.LOWER_BODY]: "🦵",
    [ExerciseCategory.CORE]: "🎯",
    [ExerciseCategory.CARDIO]: "❤️",
    [ExerciseCategory.SKILLS]: "🎪",
    [ExerciseCategory.MOBILITY]: "🧘",
  };
  return icons[category];
}

// Helper function to get equipment display name
export function getEquipmentDisplayName(equipment: Equipment): string {
  const displayNames: Record<Equipment, string> = {
    [Equipment.BODYWEIGHT_ONLY]: "Bodyweight Only",
    [Equipment.PULL_UP_BAR]: "Pull-up Bar",
    [Equipment.PARALLETTES]: "Parallettes",
    [Equipment.DIP_BARS]: "Dip Bars",
    [Equipment.RINGS]: "Rings",
    [Equipment.RESISTANCE_BANDS]: "Resistance Bands",
    [Equipment.YOGA_MAT]: "Yoga Mat",
    [Equipment.WALL]: "Wall",
    [Equipment.BENCH]: "Bench",
    [Equipment.BARBELL]: "Barbell",
    [Equipment.DUMBBELLS]: "Dumbbells",
    [Equipment.KETTLEBELL]: "Kettlebell",
    [Equipment.JUMP_ROPE]: "Jump Rope",
    [Equipment.AB_ROLLER]: "Ab Roller",
  };
  return displayNames[equipment];
}
