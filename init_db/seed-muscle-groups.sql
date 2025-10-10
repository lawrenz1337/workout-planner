-- Seed Muscle Groups for Existing Exercises
-- Run this AFTER the future-proofing migration

-- ============================================================================
-- UPPER PUSH EXERCISES
-- ============================================================================

-- Push-ups variants
UPDATE exercises SET 
  muscles_primary = ARRAY['chest', 'triceps'],
  muscles_secondary = ARRAY['shoulders', 'core']
WHERE name IN ('Push-ups', 'Wide Push-ups', 'Knee Push-ups', 'Incline Push-ups', 'Wall Push-ups');

UPDATE exercises SET 
  muscles_primary = ARRAY['triceps', 'chest'],
  muscles_secondary = ARRAY['shoulders', 'core']
WHERE name = 'Diamond Push-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders', 'triceps'],
  muscles_secondary = ARRAY['chest', 'core']
WHERE name = 'Pike Push-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['chest', 'triceps', 'shoulders'],
  muscles_secondary = ARRAY['core']
WHERE name = 'Archer Push-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders', 'triceps', 'chest'],
  muscles_secondary = ARRAY['core', 'forearms']
WHERE name = 'Pseudo Planche Push-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['chest', 'shoulders'],
  muscles_secondary = ARRAY['core']
WHERE name = 'Decline Push-ups';

-- Dips
UPDATE exercises SET 
  muscles_primary = ARRAY['chest', 'triceps'],
  muscles_secondary = ARRAY['shoulders', 'core']
WHERE name IN ('Dips', 'Bench Dips', 'Negative Dips');

UPDATE exercises SET 
  muscles_primary = ARRAY['chest', 'triceps', 'shoulders'],
  muscles_secondary = ARRAY['core', 'forearms']
WHERE name = 'Ring Dips';

-- ============================================================================
-- UPPER PULL EXERCISES
-- ============================================================================

-- Pull-ups variants
UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'upper_back'],
  muscles_secondary = ARRAY['biceps', 'forearms', 'core']
WHERE name IN ('Pull-ups', 'Wide Pull-ups', 'Negative Pull-ups', 'Band-Assisted Pull-ups');

UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'biceps'],
  muscles_secondary = ARRAY['upper_back', 'forearms', 'core']
WHERE name = 'Chin-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'upper_back', 'biceps'],
  muscles_secondary = ARRAY['forearms', 'core']
WHERE name = 'Archer Pull-ups';

-- Rows
UPDATE exercises SET 
  muscles_primary = ARRAY['upper_back', 'lats'],
  muscles_secondary = ARRAY['biceps', 'forearms', 'core']
WHERE name IN ('Australian Rows', 'Ring Rows', 'Inverted Rows (Elevated)');

-- Hangs and scapular work
UPDATE exercises SET 
  muscles_primary = ARRAY['forearms', 'lats'],
  muscles_secondary = ARRAY['shoulders', 'core']
WHERE name IN ('Dead Hangs', 'Scapular Pull-ups');

-- Advanced skills
UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'core'],
  muscles_secondary = ARRAY['biceps', 'forearms', 'shoulders']
WHERE name = 'L-sit Pull-ups';

UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'upper_back', 'core'],
  muscles_secondary = ARRAY['biceps', 'forearms']
WHERE name = 'Tuck Front Lever';

-- ============================================================================
-- LOWER BODY EXERCISES
-- ============================================================================

-- Squats
UPDATE exercises SET 
  muscles_primary = ARRAY['quads', 'glutes'],
  muscles_secondary = ARRAY['hamstrings', 'core', 'calves']
WHERE name IN ('Bodyweight Squats', 'Wall Sit', 'Split Squats');

UPDATE exercises SET 
  muscles_primary = ARRAY['quads', 'glutes', 'hamstrings'],
  muscles_secondary = ARRAY['core', 'calves', 'hip_flexors']
WHERE name IN ('Pistol Squats', 'Assisted Pistol Squats', 'Box Pistol Squats', 'Shrimp Squats');

-- Lunges
UPDATE exercises SET 
  muscles_primary = ARRAY['quads', 'glutes'],
  muscles_secondary = ARRAY['hamstrings', 'core', 'calves']
WHERE name IN ('Lunges', 'Bulgarian Split Squats');

-- Plyometrics
UPDATE exercises SET 
  muscles_primary = ARRAY['quads', 'glutes', 'calves'],
  muscles_secondary = ARRAY['hamstrings', 'core']
WHERE name = 'Jump Squats';

-- Posterior chain
UPDATE exercises SET 
  muscles_primary = ARRAY['hamstrings', 'glutes'],
  muscles_secondary = ARRAY['lower_back', 'core']
WHERE name = 'Nordic Curls';

UPDATE exercises SET 
  muscles_primary = ARRAY['glutes', 'hamstrings'],
  muscles_secondary = ARRAY['lower_back', 'core']
WHERE name = 'Glute Bridges';

-- Calves
UPDATE exercises SET 
  muscles_primary = ARRAY['calves'],
  muscles_secondary = ARRAY['ankles']
WHERE name = 'Calf Raises';

-- ============================================================================
-- CORE EXERCISES
-- ============================================================================

-- Planks
UPDATE exercises SET 
  muscles_primary = ARRAY['core', 'abs'],
  muscles_secondary = ARRAY['shoulders', 'glutes']
WHERE name IN ('Plank', 'Knee Plank', 'Incline Plank');

UPDATE exercises SET 
  muscles_primary = ARRAY['obliques', 'core'],
  muscles_secondary = ARRAY['shoulders', 'glutes']
WHERE name = 'Side Plank';

-- Compression exercises
UPDATE exercises SET 
  muscles_primary = ARRAY['abs', 'hip_flexors'],
  muscles_secondary = ARRAY['quads', 'lower_back']
WHERE name = 'Hollow Hold';

UPDATE exercises SET 
  muscles_primary = ARRAY['lower_back', 'glutes'],
  muscles_secondary = ARRAY['hamstrings', 'shoulders']
WHERE name = 'Arch Hold';

-- Leg raises
UPDATE exercises SET 
  muscles_primary = ARRAY['abs', 'hip_flexors'],
  muscles_secondary = ARRAY['obliques', 'core']
WHERE name IN ('Hanging Leg Raises', 'Lying Leg Raises', 'Knee Raises');

-- Advanced core
UPDATE exercises SET 
  muscles_primary = ARRAY['abs', 'core'],
  muscles_secondary = ARRAY['hip_flexors', 'shoulders']
WHERE name = 'L-sit Hold';

UPDATE exercises SET 
  muscles_primary = ARRAY['abs', 'core', 'obliques'],
  muscles_secondary = ARRAY['shoulders', 'hip_flexors']
WHERE name IN ('Ab Roller (Kneeling)', 'Ab Roller (Standing)');

-- Basic core
UPDATE exercises SET 
  muscles_primary = ARRAY['abs'],
  muscles_secondary = ARRAY['obliques', 'hip_flexors']
WHERE name = 'Crunches';

UPDATE exercises SET 
  muscles_primary = ARRAY['core', 'abs'],
  muscles_secondary = ARRAY['obliques', 'glutes']
WHERE name IN ('Dead Bug', 'Bird Dog');

-- ============================================================================
-- CARDIO EXERCISES
-- ============================================================================

UPDATE exercises SET 
  muscles_primary = ARRAY['full_body', 'cardiovascular'],
  muscles_secondary = ARRAY['core', 'legs', 'shoulders']
WHERE name = 'Burpees';

UPDATE exercises SET 
  muscles_primary = ARRAY['core', 'hip_flexors', 'cardiovascular'],
  muscles_secondary = ARRAY['shoulders', 'legs']
WHERE name = 'Mountain Climbers';

UPDATE exercises SET 
  muscles_primary = ARRAY['cardiovascular', 'legs'],
  muscles_secondary = ARRAY['core', 'calves']
WHERE name IN ('Jumping Jacks', 'High Knees', 'Jump Rope', 'Jump Rope (High Knees)');

UPDATE exercises SET 
  muscles_primary = ARRAY['cardiovascular', 'calves'],
  muscles_secondary = ARRAY['coordination']
WHERE name = 'Jump Rope (Double Unders)';

-- ============================================================================
-- SKILLS EXERCISES
-- ============================================================================

-- Handstands
UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders', 'core'],
  muscles_secondary = ARRAY['triceps', 'forearms', 'balance']
WHERE name IN ('Wall Handstand Hold', 'Freestanding Handstand', 'Wall Walk', 'Headstand');

UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders', 'triceps'],
  muscles_secondary = ARRAY['core', 'balance']
WHERE name = 'Handstand Push-ups';

-- Levers
UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'core', 'abs'],
  muscles_secondary = ARRAY['shoulders', 'biceps']
WHERE name IN ('Tuck Front Lever', 'Front Lever');

-- Planche
UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders', 'core', 'chest'],
  muscles_secondary = ARRAY['triceps', 'forearms']
WHERE name = 'Tuck Planche';

-- Other skills
UPDATE exercises SET 
  muscles_primary = ARRAY['lats', 'shoulders', 'chest'],
  muscles_secondary = ARRAY['triceps', 'core']
WHERE name = 'Muscle-up Progression';

UPDATE exercises SET 
  muscles_primary = ARRAY['core', 'arms'],
  muscles_secondary = ARRAY['shoulders', 'balance']
WHERE name = 'Crow Pose';

-- ============================================================================
-- MOBILITY EXERCISES
-- ============================================================================

UPDATE exercises SET 
  muscles_primary = ARRAY['spine', 'core'],
  muscles_secondary = ARRAY['shoulders', 'hips']
WHERE name = 'Cat-Cow Stretch';

UPDATE exercises SET 
  muscles_primary = ARRAY['shoulders'],
  muscles_secondary = ARRAY['chest', 'upper_back']
WHERE name = 'Shoulder Dislocates';

UPDATE exercises SET 
  muscles_primary = ARRAY['wrists', 'forearms'],
  muscles_secondary = ARRAY[]::TEXT[]
WHERE name = 'Wrist Circles';

UPDATE exercises SET 
  muscles_primary = ARRAY['hips', 'ankles'],
  muscles_secondary = ARRAY['quads', 'glutes']
WHERE name = 'Deep Squat Hold';

UPDATE exercises SET 
  muscles_primary = ARRAY['hamstrings', 'lower_back'],
  muscles_secondary = ARRAY['calves']
WHERE name = 'Pike Stretch';

UPDATE exercises SET 
  muscles_primary = ARRAY['hips'],
  muscles_secondary = ARRAY['glutes', 'hip_flexors']
WHERE name = 'Hip Circles';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Show exercises that still need muscle groups assigned
DO $$
DECLARE
  missing_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM exercises
  WHERE is_default = true 
    AND (muscles_primary IS NULL OR muscles_primary = ARRAY[]::TEXT[]);
  
  IF missing_count > 0 THEN
    RAISE NOTICE '⚠️  % exercises still need muscle groups assigned', missing_count;
    RAISE NOTICE 'Run this query to see them:';
    RAISE NOTICE 'SELECT name, category FROM exercises WHERE is_default = true AND (muscles_primary IS NULL OR muscles_primary = ARRAY[]::TEXT[]);';
  ELSE
    RAISE NOTICE '✅ All exercises have muscle groups assigned!';
  END IF;
END $$;