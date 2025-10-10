-- Future-Proofing Migration for Workout Planner
-- Run this in Supabase SQL Editor AFTER the initial migration

-- ============================================================================
-- 1. ADD MUSCLE GROUPS TO EXERCISES (Critical for analytics)
-- ============================================================================
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS
  muscles_primary TEXT[] DEFAULT ARRAY[]::TEXT[];

ALTER TABLE exercises ADD COLUMN IF NOT EXISTS
  muscles_secondary TEXT[] DEFAULT ARRAY[]::TEXT[];

COMMENT ON COLUMN exercises.muscles_primary IS 'Primary muscles worked (e.g., chest, triceps)';
COMMENT ON COLUMN exercises.muscles_secondary IS 'Secondary muscles worked (e.g., shoulders, core)';

-- ============================================================================
-- 2. ENHANCED WORKOUT TRACKING
-- ============================================================================
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS
  completed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE workouts ADD COLUMN IF NOT EXISTS
  total_volume INTEGER DEFAULT 0;

ALTER TABLE workouts ADD COLUMN IF NOT EXISTS
  calories_burned INTEGER;

COMMENT ON COLUMN workouts.completed_at IS 'When the workout was actually completed (null if not started)';
COMMENT ON COLUMN workouts.total_volume IS 'Total volume in kg (sum of sets × reps × weight)';
COMMENT ON COLUMN workouts.calories_burned IS 'Estimated calories burned using MET values';

-- ============================================================================
-- 3. BETTER WORKOUT LOGS
-- ============================================================================
ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS
  notes TEXT;

ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS
  form_rating INTEGER CHECK (form_rating >= 1 AND form_rating <= 5);

ALTER TABLE workout_logs ADD COLUMN IF NOT EXISTS
  perceived_exertion INTEGER CHECK (perceived_exertion >= 1 AND perceived_exertion <= 10);

COMMENT ON COLUMN workout_logs.notes IS 'User notes about this set (e.g., "felt easy", "struggled")';
COMMENT ON COLUMN workout_logs.form_rating IS 'Self-rated form quality (1-5 stars)';
COMMENT ON COLUMN workout_logs.perceived_exertion IS 'RPE scale 1-10 (Rate of Perceived Exertion)';

-- ============================================================================
-- 4. USER BODY METRICS (for calorie calculations)
-- ============================================================================
ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS
  weight_kg DECIMAL(5,2);

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS
  height_cm INTEGER;

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS
  age INTEGER;

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS
  sex TEXT CHECK (sex IN ('male', 'female', 'other'));

ALTER TABLE user_preferences ADD COLUMN IF NOT EXISTS
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active', 'extra_active')) DEFAULT 'moderate';

COMMENT ON COLUMN user_preferences.weight_kg IS 'User body weight for calorie calculations';
COMMENT ON COLUMN user_preferences.height_cm IS 'User height in centimeters';
COMMENT ON COLUMN user_preferences.age IS 'User age for BMR calculations';
COMMENT ON COLUMN user_preferences.sex IS 'Biological sex for calorie calculations';
COMMENT ON COLUMN user_preferences.activity_level IS 'General activity level for TDEE calculations';

-- ============================================================================
-- 5. PERSONAL RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('max_reps', 'max_weight', 'max_duration', 'total_volume')),
  value DECIMAL(10,2) NOT NULL,
  workout_log_id UUID REFERENCES workout_logs(id) ON DELETE SET NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  -- Only one PR per user/exercise/type combination
  UNIQUE(user_id, exercise_id, record_type)
);

COMMENT ON TABLE personal_records IS 'Tracks personal records (PRs) for each exercise';
COMMENT ON COLUMN personal_records.record_type IS 'Type of record: max_reps, max_weight, max_duration, or total_volume';
COMMENT ON COLUMN personal_records.value IS 'The record value (reps, kg, seconds, or volume)';
COMMENT ON COLUMN personal_records.workout_log_id IS 'Links to the workout log where this PR was achieved';

-- ============================================================================
-- 6. BODY METRICS TABLE (Optional - for serious trackers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS body_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg DECIMAL(5,2),
  body_fat_percentage DECIMAL(4,2),
  measurements JSONB,
  progress_photos TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate entries for same user/date
  UNIQUE(user_id, date)
);

COMMENT ON TABLE body_metrics IS 'Tracks body measurements over time';
COMMENT ON COLUMN body_metrics.measurements IS 'JSON object with measurements like {"chest": 100, "waist": 80, "arms": 35}';
COMMENT ON COLUMN body_metrics.progress_photos IS 'Array of photo URLs for progress tracking';

-- ============================================================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Workout queries by completion date
CREATE INDEX IF NOT EXISTS idx_workouts_user_completed 
  ON workouts(user_id, completed_at DESC NULLS LAST);

-- Exercise progress queries
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise 
  ON workout_logs(workout_exercise_id, completed_at DESC);

-- Personal records lookups
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise 
  ON personal_records(user_id, exercise_id);

CREATE INDEX IF NOT EXISTS idx_personal_records_achieved 
  ON personal_records(user_id, achieved_at DESC);

-- Body metrics queries
CREATE INDEX IF NOT EXISTS idx_body_metrics_user_date 
  ON body_metrics(user_id, date DESC);

-- Muscle group filtering
CREATE INDEX IF NOT EXISTS idx_exercises_muscles 
  ON exercises USING GIN (muscles_primary);

-- ============================================================================
-- 8. ROW LEVEL SECURITY FOR NEW TABLES
-- ============================================================================

-- Enable RLS
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;

-- Personal Records Policies
CREATE POLICY "Users can view own PRs"
  ON personal_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own PRs"
  ON personal_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PRs"
  ON personal_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own PRs"
  ON personal_records FOR DELETE
  USING (auth.uid() = user_id);

-- Body Metrics Policies
CREATE POLICY "Users can view own metrics"
  ON body_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own metrics"
  ON body_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own metrics"
  ON body_metrics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own metrics"
  ON body_metrics FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 9. HELPER FUNCTIONS
-- ============================================================================

-- Function to calculate total workout volume
CREATE OR REPLACE FUNCTION calculate_workout_volume(workout_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  total_vol INTEGER;
BEGIN
  SELECT COALESCE(SUM(
    COALESCE(wl.reps_completed, 0) * 
    COALESCE(wl.weight_kg, 0)
  ), 0)
  INTO total_vol
  FROM workout_logs wl
  JOIN workout_exercises we ON we.id = wl.workout_exercise_id
  WHERE we.workout_id = workout_id_param;
  
  RETURN total_vol;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_workout_volume IS 'Calculates total volume (reps × weight) for a workout';

-- Function to check and update personal records
CREATE OR REPLACE FUNCTION check_personal_record(
  user_id_param UUID,
  exercise_id_param UUID,
  workout_log_id_param UUID,
  reps_completed_param INTEGER,
  weight_kg_param DECIMAL,
  duration_seconds_param INTEGER
)
RETURNS VOID AS $$
DECLARE
  current_max_reps DECIMAL;
  current_max_weight DECIMAL;
  current_max_duration DECIMAL;
BEGIN
  -- Check max reps PR
  IF reps_completed_param IS NOT NULL THEN
    SELECT value INTO current_max_reps
    FROM personal_records
    WHERE user_id = user_id_param 
      AND exercise_id = exercise_id_param 
      AND record_type = 'max_reps';
    
    IF current_max_reps IS NULL OR reps_completed_param > current_max_reps THEN
      INSERT INTO personal_records (user_id, exercise_id, record_type, value, workout_log_id)
      VALUES (user_id_param, exercise_id_param, 'max_reps', reps_completed_param, workout_log_id_param)
      ON CONFLICT (user_id, exercise_id, record_type) 
      DO UPDATE SET value = reps_completed_param, workout_log_id = workout_log_id_param, achieved_at = NOW();
    END IF;
  END IF;
  
  -- Check max weight PR
  IF weight_kg_param IS NOT NULL THEN
    SELECT value INTO current_max_weight
    FROM personal_records
    WHERE user_id = user_id_param 
      AND exercise_id = exercise_id_param 
      AND record_type = 'max_weight';
    
    IF current_max_weight IS NULL OR weight_kg_param > current_max_weight THEN
      INSERT INTO personal_records (user_id, exercise_id, record_type, value, workout_log_id)
      VALUES (user_id_param, exercise_id_param, 'max_weight', weight_kg_param, workout_log_id_param)
      ON CONFLICT (user_id, exercise_id, record_type) 
      DO UPDATE SET value = weight_kg_param, workout_log_id = workout_log_id_param, achieved_at = NOW();
    END IF;
  END IF;
  
  -- Check max duration PR
  IF duration_seconds_param IS NOT NULL THEN
    SELECT value INTO current_max_duration
    FROM personal_records
    WHERE user_id = user_id_param 
      AND exercise_id = exercise_id_param 
      AND record_type = 'max_duration';
    
    IF current_max_duration IS NULL OR duration_seconds_param > current_max_duration THEN
      INSERT INTO personal_records (user_id, exercise_id, record_type, value, workout_log_id)
      VALUES (user_id_param, exercise_id_param, 'max_duration', duration_seconds_param, workout_log_id_param)
      ON CONFLICT (user_id, exercise_id, record_type) 
      DO UPDATE SET value = duration_seconds_param, workout_log_id = workout_log_id_param, achieved_at = NOW();
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_personal_record IS 'Automatically checks and updates personal records after each logged set';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Future-proofing migration completed successfully!';
  RAISE NOTICE 'New columns added: muscles_primary, muscles_secondary, completed_at, total_volume, calories_burned';
  RAISE NOTICE 'New tables created: personal_records, body_metrics';
  RAISE NOTICE 'Helper functions created: calculate_workout_volume, check_personal_record';
END $$;