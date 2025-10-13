-- Seed test workouts with volume data for VolumeProgressChart
-- This script creates realistic workout data for the last 30 days
-- Run this AFTER migrations and seed-exercises.sql
--
-- IMPORTANT: Replace '020c273a-e19b-4692-ae55-a3ba5732d00c' with your actual Supabase auth.users UUID
-- You can find your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Variables (replace this with your actual user ID)
DO $$
DECLARE
  test_user_id UUID := '020c273a-e19b-4692-ae55-a3ba5732d00c'; -- ⚠️ CHANGE THIS!

  -- Exercise IDs (we'll fetch these dynamically)
  pushup_id UUID;
  squat_id UUID;
  pullup_id UUID;
  dips_id UUID;
  lunges_id UUID;

  -- Workout variables
  workout_id UUID;
  workout_exercise_id UUID;
  workout_date DATE;
  day_offset INTEGER;
  volume_base INTEGER;

BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = test_user_id) THEN
    RAISE EXCEPTION 'User ID % not found. Please update test_user_id variable with a valid user ID.', test_user_id;
  END IF;

  -- Fetch exercise IDs
  SELECT id INTO pushup_id FROM exercises WHERE name = 'Push-ups' AND is_default = true LIMIT 1;
  SELECT id INTO squat_id FROM exercises WHERE name = 'Bodyweight Squats' AND is_default = true LIMIT 1;
  SELECT id INTO pullup_id FROM exercises WHERE name = 'Pull-ups' AND is_default = true LIMIT 1;
  SELECT id INTO dips_id FROM exercises WHERE name = 'Dips' AND is_default = true LIMIT 1;
  SELECT id INTO lunges_id FROM exercises WHERE name = 'Lunges' AND is_default = true LIMIT 1;

  -- Generate workouts for the last 30 days with realistic progression
  FOR day_offset IN 0..29 LOOP
    workout_date := CURRENT_DATE - (29 - day_offset);

    -- Skip some days (rest days) - skip 30% of days
    CONTINUE WHEN (day_offset % 3 = 0 AND day_offset % 6 != 0);

    -- Calculate volume with progression (increases over time)
    volume_base := 2000 + (day_offset * 50) + (random() * 500)::INTEGER;

    -- Alternate between upper body and lower body days
    IF day_offset % 2 = 0 THEN
      -- UPPER BODY DAY (Push + Pull)
      workout_id := gen_random_uuid();

      INSERT INTO workouts (
        id,
        user_id,
        name,
        type,
        duration_minutes,
        date,
        is_template,
        completed_at,
        total_volume,
        calories_burned
      ) VALUES (
        workout_id,
        test_user_id,
        'Upper Body Workout',
        'home',
        45 + (random() * 15)::INTEGER,
        workout_date,
        false,
        workout_date::TIMESTAMP + INTERVAL '10 hours' + (random() * INTERVAL '8 hours'),
        volume_base,
        300 + (random() * 100)::INTEGER
      );

      -- Add Push-ups (3 sets x 12 reps x 0 kg = bodyweight, calculate volume differently)
      workout_exercise_id := gen_random_uuid();
      INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, sets, target_reps, rest_seconds, notes)
      VALUES (workout_exercise_id, workout_id, pushup_id, 0, 3, 12, 60, 'warmup');

      -- Log sets with increasing weight simulation (use bodyweight * reps as "volume")
      FOR set_num IN 1..3 LOOP
        INSERT INTO workout_logs (workout_exercise_id, set_number, reps_completed, weight_kg, difficulty_rating)
        VALUES (workout_exercise_id, set_num, 12 + (random() * 3)::INTEGER, 70 + (random() * 10), 3);
      END LOOP;

      -- Add Dips (3 sets x 10 reps)
      IF dips_id IS NOT NULL THEN
        workout_exercise_id := gen_random_uuid();
        INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, sets, target_reps, rest_seconds, notes)
        VALUES (workout_exercise_id, workout_id, dips_id, 1, 3, 10, 90, 'main');

        FOR set_num IN 1..3 LOOP
          INSERT INTO workout_logs (workout_exercise_id, set_number, reps_completed, weight_kg, difficulty_rating)
          VALUES (workout_exercise_id, set_num, 10 + (random() * 2)::INTEGER, 75 + (random() * 10), 4);
        END LOOP;
      END IF;

      -- Add Pull-ups (4 sets x 8 reps with added weight)
      IF pullup_id IS NOT NULL THEN
        workout_exercise_id := gen_random_uuid();
        INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, sets, target_reps, rest_seconds, notes)
        VALUES (workout_exercise_id, workout_id, pullup_id, 2, 4, 8, 120, 'main');

        FOR set_num IN 1..4 LOOP
          INSERT INTO workout_logs (workout_exercise_id, set_number, reps_completed, weight_kg, difficulty_rating)
          VALUES (workout_exercise_id, set_num, 8 + (random() * 2)::INTEGER, 80 + (day_offset * 0.5) + (random() * 5), 4);
        END LOOP;
      END IF;

    ELSE
      -- LOWER BODY DAY
      workout_id := gen_random_uuid();

      INSERT INTO workouts (
        id,
        user_id,
        name,
        type,
        duration_minutes,
        date,
        is_template,
        completed_at,
        total_volume,
        calories_burned
      ) VALUES (
        workout_id,
        test_user_id,
        'Lower Body Workout',
        'home',
        40 + (random() * 15)::INTEGER,
        workout_date,
        false,
        workout_date::TIMESTAMP + INTERVAL '18 hours' + (random() * INTERVAL '2 hours'),
        volume_base + 500,
        350 + (random() * 100)::INTEGER
      );

      -- Add Squats (4 sets x 15 reps)
      workout_exercise_id := gen_random_uuid();
      INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, sets, target_reps, rest_seconds, notes)
      VALUES (workout_exercise_id, workout_id, squat_id, 0, 4, 15, 90, 'main');

      FOR set_num IN 1..4 LOOP
        INSERT INTO workout_logs (workout_exercise_id, set_number, reps_completed, weight_kg, difficulty_rating)
        VALUES (workout_exercise_id, set_num, 15 + (random() * 3)::INTEGER, 75 + (random() * 10), 4);
      END LOOP;

      -- Add Lunges (3 sets x 12 reps per leg)
      IF lunges_id IS NOT NULL THEN
        workout_exercise_id := gen_random_uuid();
        INSERT INTO workout_exercises (id, workout_id, exercise_id, order_index, sets, target_reps, rest_seconds, notes)
        VALUES (workout_exercise_id, workout_id, lunges_id, 1, 3, 12, 60, 'main');

        FOR set_num IN 1..3 LOOP
          INSERT INTO workout_logs (workout_exercise_id, set_number, reps_completed, weight_kg, difficulty_rating)
          VALUES (workout_exercise_id, set_num, 12 + (random() * 2)::INTEGER, 70 + (random() * 10), 3);
        END LOOP;
      END IF;
    END IF;

  END LOOP;

  RAISE NOTICE 'Successfully created ~20 test workouts over the last 30 days for user %', test_user_id;
  RAISE NOTICE 'Total volume range: 2000-5000 kg with upward progression';
  RAISE NOTICE 'You should now see the VolumeProgressChart populated with data!';

END $$;

-- Verify the data was created
DO $$
DECLARE
  workout_count INTEGER;
  total_vol INTEGER;
  test_user_id UUID := '020c273a-e19b-4692-ae55-a3ba5732d00c'; -- ⚠️ MUST MATCH ABOVE!
BEGIN
  SELECT COUNT(*), SUM(total_volume)
  INTO workout_count, total_vol
  FROM workouts
  WHERE user_id = test_user_id
    AND completed_at IS NOT NULL
    AND completed_at >= CURRENT_DATE - INTERVAL '30 days';

  RAISE NOTICE '✅ Verification: % completed workouts, %kg total volume', workout_count, total_vol;
END $$;
