-- Workout Planner Database Schema
-- Run this in Supabase SQL Editor

-- Create enums
CREATE TYPE exercise_category AS ENUM (
  'upper_push',
  'upper_pull',
  'lower_body',
  'core',
  'cardio',
  'skills',
  'mobility'
);

CREATE TYPE exercise_location AS ENUM (
  'home',
  'gym',
  'both'
);

CREATE TYPE exercise_difficulty AS ENUM (
  'beginner',
  'intermediate',
  'advanced'
);

CREATE TYPE workout_type AS ENUM (
  'home',
  'gym'
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category exercise_category NOT NULL,
  location exercise_location NOT NULL DEFAULT 'home',
  difficulty exercise_difficulty NOT NULL DEFAULT 'intermediate',
  equipment TEXT[] DEFAULT ARRAY['bodyweight_only'],
  description TEXT NOT NULL,
  form_cues TEXT[] DEFAULT ARRAY[]::TEXT[],
  video_url TEXT,
  image_url TEXT,
  default_sets INTEGER NOT NULL DEFAULT 3,
  default_reps INTEGER,
  default_duration_seconds INTEGER,
  is_default BOOLEAN NOT NULL DEFAULT false,
  progression_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  regression_exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_reps_or_duration CHECK (
    default_reps IS NOT NULL OR default_duration_seconds IS NOT NULL
  )
);

-- Workouts table
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type workout_type NOT NULL DEFAULT 'home',
  duration_minutes INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_template BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout exercises (junction table)
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  target_reps INTEGER,
  target_duration_seconds INTEGER,
  rest_seconds INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  
  -- Constraints
  CONSTRAINT valid_target CHECK (
    target_reps IS NOT NULL OR target_duration_seconds IS NOT NULL
  )
);

-- Workout logs table
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps_completed INTEGER,
  duration_seconds INTEGER,
  weight_kg DECIMAL(5, 2),
  difficulty_rating INTEGER CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_completion CHECK (
    reps_completed IS NOT NULL OR duration_seconds IS NOT NULL
  )
);

-- User preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_workout_duration INTEGER NOT NULL DEFAULT 30,
  warmup_duration INTEGER NOT NULL DEFAULT 5,
  cooldown_duration INTEGER NOT NULL DEFAULT 5,
  default_rest_between_sets INTEGER NOT NULL DEFAULT 60,
  difficulty_level exercise_difficulty NOT NULL DEFAULT 'intermediate',
  available_equipment TEXT[] DEFAULT ARRAY['bodyweight_only'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_exercises_category ON exercises(category);
CREATE INDEX idx_exercises_location ON exercises(location);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_is_default ON exercises(is_default);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date ON workouts(date);
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date);

CREATE INDEX idx_workout_exercises_workout_id ON workout_exercises(workout_id);
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);

CREATE INDEX idx_workout_logs_workout_exercise_id ON workout_logs(workout_exercise_id);
CREATE INDEX idx_workout_logs_completed_at ON workout_logs(completed_at);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Exercises policies
-- Everyone can read default exercises
CREATE POLICY "Default exercises are viewable by everyone"
  ON exercises FOR SELECT
  USING (is_default = true);

-- Users can read their own custom exercises
CREATE POLICY "Users can view own exercises"
  ON exercises FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own exercises
CREATE POLICY "Users can create own exercises"
  ON exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own exercises
CREATE POLICY "Users can update own exercises"
  ON exercises FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own exercises
CREATE POLICY "Users can delete own exercises"
  ON exercises FOR DELETE
  USING (auth.uid() = user_id);

-- Workouts policies
CREATE POLICY "Users can view own workouts"
  ON workouts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own workouts"
  ON workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workouts"
  ON workouts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own workouts"
  ON workouts FOR DELETE
  USING (auth.uid() = user_id);

-- Workout exercises policies
CREATE POLICY "Users can view own workout exercises"
  ON workout_exercises FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own workout exercises"
  ON workout_exercises FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON workout_exercises FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises"
  ON workout_exercises FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

-- Workout logs policies
CREATE POLICY "Users can view own workout logs"
  ON workout_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_logs.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own workout logs"
  ON workout_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_logs.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout logs"
  ON workout_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_logs.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout logs"
  ON workout_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises
      JOIN workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_logs.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

-- User preferences policies
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to automatically create user preferences on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_preferences updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();