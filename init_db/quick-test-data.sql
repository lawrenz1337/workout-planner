-- QUICK TEST DATA - Minimal script for fast testing
-- Replace 'YOUR_USER_ID_HERE' with your actual UUID (2 places) and run in Supabase SQL Editor
--
-- HOW TO GET YOUR USER ID:
-- SELECT id, email FROM auth.users;

-- Create 10 quick workouts with volume for the last 14 days
INSERT INTO workouts (user_id, name, type, duration_minutes, date, completed_at, total_volume, calories_burned)
SELECT
  'YOUR_USER_ID_HERE'::UUID, -- ⚠️ REPLACE THIS!
  CASE WHEN (gs.day % 2) = 0 THEN 'Upper Body Workout' ELSE 'Lower Body Workout' END,
  'home',
  40 + (random() * 20)::INTEGER,
  CURRENT_DATE - (14 - gs.day)::INTEGER,
  (CURRENT_DATE - (14 - gs.day)::INTEGER)::TIMESTAMP + INTERVAL '10 hours' + (random() * INTERVAL '10 hours'),
  2000 + (gs.day * 100) + (random() * 800)::INTEGER,
  300 + (random() * 100)::INTEGER
FROM generate_series(0, 13) AS gs(day)
WHERE gs.day % 3 != 0; -- Skip every 3rd day (rest days)

-- Verify the data
SELECT
  COUNT(*) as workout_count,
  SUM(total_volume) as total_vol,
  MIN(completed_at)::DATE as first_workout,
  MAX(completed_at)::DATE as last_workout
FROM workouts
WHERE user_id = 'YOUR_USER_ID_HERE'::UUID -- ⚠️ REPLACE THIS TOO!
  AND completed_at >= CURRENT_DATE - INTERVAL '14 days';

-- ✅ If successful, you should see ~10 workouts with 20k-35k total volume
-- ✅ Refresh your dashboard to see the Volume Progress Chart populated!
