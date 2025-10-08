-- Additional beginner-friendly regression exercises
-- Run this AFTER the main seed data

-- UPPER PUSH REGRESSIONS
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Knee Push-ups', 'upper_push', 'home', 'beginner', ARRAY['bodyweight_only'], 'Push-ups with knees on ground', ARRAY['Knees on ground', 'Body straight from knees to head', 'Lower chest to ground', 'Easier than regular push-ups'], 3, 15, true),
('Incline Push-ups', 'upper_push', 'home', 'beginner', ARRAY['bench'], 'Push-ups with hands elevated', ARRAY['Hands on elevated surface', 'Higher surface = easier', 'Start with counter height', 'Progress to lower surfaces'], 3, 12, true),
('Wall Push-ups', 'upper_push', 'home', 'beginner', ARRAY['wall'], 'Push-ups against a wall', ARRAY['Hands on wall shoulder width', 'Lean into wall', 'Push back out', 'Easiest push-up variation'], 3, 15, true),
('Bench Dips', 'upper_push', 'home', 'beginner', ARRAY['bench'], 'Dips with feet on ground', ARRAY['Hands on bench behind you', 'Feet on ground', 'Lower and press up', 'Easier than bar dips'], 3, 12, true);

-- UPPER PULL REGRESSIONS
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Negative Pull-ups', 'upper_pull', 'both', 'beginner', ARRAY['pull_up_bar'], 'Lowering phase of pull-up only', ARRAY['Jump to top position', 'Lower slowly (5+ seconds)', 'Reset and repeat', 'Builds strength for full pull-ups'], 3, 5, true),
('Band-Assisted Pull-ups', 'upper_pull', 'both', 'beginner', ARRAY['pull_up_bar', 'resistance_bands'], 'Pull-ups with band assistance', ARRAY['Loop band on bar', 'Place foot/knee in band', 'Band helps push you up', 'Reduce band thickness to progress'], 3, 8, true),
('Dead Hangs', 'upper_pull', 'both', 'beginner', ARRAY['pull_up_bar'], 'Simply hanging from bar', ARRAY['Grip bar and hang', 'Build grip strength', 'Shoulders engaged', 'First step to pull-ups'], 3, 30, true),
('Inverted Rows (Elevated)', 'upper_pull', 'home', 'beginner', ARRAY['pull_up_bar'], 'Rows at easier angle', ARRAY['Higher bar = easier', 'Feet on ground', 'Body at angle', 'Progress to horizontal'], 3, 12, true),
('Scapular Pull-ups', 'upper_pull', 'both', 'beginner', ARRAY['pull_up_bar'], 'Pull-up focusing on shoulder blades', ARRAY['Hang from bar', 'Pull shoulder blades down', 'Small movement', 'Teaches pull-up initiation'], 3, 10, true);

-- LOWER BODY REGRESSIONS  
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Assisted Pistol Squats', 'lower_body', 'home', 'intermediate', ARRAY['pull_up_bar', 'wall'], 'Pistol squats holding support', ARRAY['Hold pole or TRX', 'One leg extended', 'Use arms minimally', 'Progress to no support'], 3, 8, true),
('Box Pistol Squats', 'lower_body', 'home', 'intermediate', ARRAY['bench'], 'Pistol squats to box', ARRAY['Sit on box behind you', 'One leg out', 'Stand back up', 'Easier than full ROM'], 3, 10, true),
('Split Squats', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only'], 'Static lunge position', ARRAY['One foot forward, one back', 'Lower and raise', 'No stepping', 'Easier than lunges'], 3, 12, true),
('Wall Sit', 'lower_body', 'home', 'beginner', ARRAY['wall'], 'Isometric squat against wall', ARRAY['Back against wall', 'Slide down to 90 degrees', 'Hold position', 'Builds leg endurance'], 3, 45, true),
('Glute Bridges', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only'], 'Hip thrust from ground', ARRAY['Lie on back', 'Push hips up', 'Squeeze glutes', 'Great posterior chain'], 3, 15, true);

-- CORE REGRESSIONS
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Knee Plank', 'core', 'home', 'beginner', ARRAY['bodyweight_only'], 'Plank with knees down', ARRAY['Knees on ground', 'Forearms down', 'Body straight from knees', 'Easier plank variation'], 3, 45, true),
('Incline Plank', 'core', 'home', 'beginner', ARRAY['bench'], 'Plank with hands elevated', ARRAY['Hands on elevated surface', 'Higher = easier', 'Full body straight', 'Progress to ground'], 3, 60, true),
('Dead Bug', 'core', 'home', 'beginner', ARRAY['bodyweight_only'], 'Alternating arm and leg movements', ARRAY['Lie on back', 'Opposite arm and leg', 'Lower back pressed down', 'Great for beginners'], 3, 45, true),
('Bird Dog', 'core', 'home', 'beginner', ARRAY['bodyweight_only'], 'Balance on hands and knees', ARRAY['Hands and knees start', 'Extend opposite arm and leg', 'Hold and switch', 'Core stability'], 3, 30, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Knee Raises', 'core', 'both', 'beginner', ARRAY['pull_up_bar'], 'Raise knees while hanging', ARRAY['Hang from bar', 'Bring knees to chest', 'Lower with control', 'Easier than leg raises'], 3, 12, true),
('Crunches', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat'], 'Basic abdominal crunch', ARRAY['Knees bent, feet flat', 'Lift shoulders off ground', 'Don''t pull on neck', 'Beginner ab exercise'], 3, 20, true);

-- SKILL REGRESSIONS
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Wall Walk', 'skills', 'home', 'beginner', ARRAY['wall'], 'Walk feet up wall from plank', ARRAY['Start in plank facing wall', 'Walk feet up wall', 'Walk hands closer', 'Builds handstand confidence'], 3, 30, true),
('Headstand', 'skills', 'home', 'beginner', ARRAY['wall', 'yoga_mat'], 'Inverted balance on head and forearms', ARRAY['Head and forearms on ground', 'Easier than handstand', 'Use wall for support', 'First inversion'], 3, 20, true),
('Crow Pose', 'skills', 'home', 'beginner', ARRAY['bodyweight_only'], 'Balance on hands with knees on elbows', ARRAY['Squat, hands flat', 'Knees rest on elbows', 'Lean forward', 'Great for balance'], 3, 15, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Negative Dips', 'skills', 'both', 'beginner', ARRAY['dip_bars', 'bench'], 'Lowering phase of dip only', ARRAY['Start at top', 'Lower slowly (5 seconds)', 'Step back to top', 'Builds dip strength'], 3, 5, true);

-- Now link progressions and regressions
-- This creates the progression chains: easiest -> hardest

-- PUSH-UP PROGRESSION CHAIN
-- Wall Push-ups -> Incline Push-ups -> Knee Push-ups -> Regular Push-ups -> Diamond -> Archer

-- First, get the IDs (you'll need to adjust these UUIDs after running)
DO $$
DECLARE
    wall_pushup_id UUID;
    incline_pushup_id UUID;
    knee_pushup_id UUID;
    regular_pushup_id UUID;
    diamond_pushup_id UUID;
    archer_pushup_id UUID;
BEGIN
    -- Get IDs
    SELECT id INTO wall_pushup_id FROM exercises WHERE name = 'Wall Push-ups' LIMIT 1;
    SELECT id INTO incline_pushup_id FROM exercises WHERE name = 'Incline Push-ups' LIMIT 1;
    SELECT id INTO knee_pushup_id FROM exercises WHERE name = 'Knee Push-ups' LIMIT 1;
    SELECT id INTO regular_pushup_id FROM exercises WHERE name = 'Push-ups' LIMIT 1;
    SELECT id INTO diamond_pushup_id FROM exercises WHERE name = 'Diamond Push-ups' LIMIT 1;
    SELECT id INTO archer_pushup_id FROM exercises WHERE name = 'Archer Push-ups' LIMIT 1;
    
    -- Link progressions (each points to next harder)
    UPDATE exercises SET progression_exercise_id = incline_pushup_id WHERE id = wall_pushup_id;
    UPDATE exercises SET progression_exercise_id = knee_pushup_id WHERE id = incline_pushup_id;
    UPDATE exercises SET progression_exercise_id = regular_pushup_id WHERE id = knee_pushup_id;
    UPDATE exercises SET progression_exercise_id = diamond_pushup_id WHERE id = regular_pushup_id;
    UPDATE exercises SET progression_exercise_id = archer_pushup_id WHERE id = diamond_pushup_id;
    
    -- Link regressions (each points to next easier)
    UPDATE exercises SET regression_exercise_id = wall_pushup_id WHERE id = incline_pushup_id;
    UPDATE exercises SET regression_exercise_id = incline_pushup_id WHERE id = knee_pushup_id;
    UPDATE exercises SET regression_exercise_id = knee_pushup_id WHERE id = regular_pushup_id;
    UPDATE exercises SET regression_exercise_id = regular_pushup_id WHERE id = diamond_pushup_id;
    UPDATE exercises SET regression_exercise_id = diamond_pushup_id WHERE id = archer_pushup_id;
END $$;

-- PULL-UP PROGRESSION CHAIN
-- Dead Hang -> Scapular Pulls -> Negative Pull-ups -> Band-Assisted -> Regular Pull-ups
DO $$
DECLARE
    dead_hang_id UUID;
    scap_pullup_id UUID;
    negative_pullup_id UUID;
    assisted_pullup_id UUID;
    regular_pullup_id UUID;
    wide_pullup_id UUID;
BEGIN
    SELECT id INTO dead_hang_id FROM exercises WHERE name = 'Dead Hangs' LIMIT 1;
    SELECT id INTO scap_pullup_id FROM exercises WHERE name = 'Scapular Pull-ups' LIMIT 1;
    SELECT id INTO negative_pullup_id FROM exercises WHERE name = 'Negative Pull-ups' LIMIT 1;
    SELECT id INTO assisted_pullup_id FROM exercises WHERE name = 'Band-Assisted Pull-ups' LIMIT 1;
    SELECT id INTO regular_pullup_id FROM exercises WHERE name = 'Pull-ups' LIMIT 1;
    SELECT id INTO wide_pullup_id FROM exercises WHERE name = 'Wide Pull-ups' LIMIT 1;
    
    -- Progressions
    UPDATE exercises SET progression_exercise_id = scap_pullup_id WHERE id = dead_hang_id;
    UPDATE exercises SET progression_exercise_id = negative_pullup_id WHERE id = scap_pullup_id;
    UPDATE exercises SET progression_exercise_id = assisted_pullup_id WHERE id = negative_pullup_id;
    UPDATE exercises SET progression_exercise_id = regular_pullup_id WHERE id = assisted_pullup_id;
    UPDATE exercises SET progression_exercise_id = wide_pullup_id WHERE id = regular_pullup_id;
    
    -- Regressions
    UPDATE exercises SET regression_exercise_id = dead_hang_id WHERE id = scap_pullup_id;
    UPDATE exercises SET regression_exercise_id = scap_pullup_id WHERE id = negative_pullup_id;
    UPDATE exercises SET regression_exercise_id = negative_pullup_id WHERE id = assisted_pullup_id;
    UPDATE exercises SET regression_exercise_id = assisted_pullup_id WHERE id = regular_pullup_id;
    UPDATE exercises SET regression_exercise_id = regular_pullup_id WHERE id = wide_pullup_id;
END $$;

-- SQUAT PROGRESSION CHAIN
-- Wall Sit -> Bodyweight Squats -> Split Squats -> Assisted Pistol -> Pistol
DO $$
DECLARE
    wall_sit_id UUID;
    squat_id UUID;
    split_squat_id UUID;
    assisted_pistol_id UUID;
    pistol_id UUID;
BEGIN
    SELECT id INTO wall_sit_id FROM exercises WHERE name = 'Wall Sit' LIMIT 1;
    SELECT id INTO squat_id FROM exercises WHERE name = 'Bodyweight Squats' LIMIT 1;
    SELECT id INTO split_squat_id FROM exercises WHERE name = 'Split Squats' LIMIT 1;
    SELECT id INTO assisted_pistol_id FROM exercises WHERE name = 'Assisted Pistol Squats' LIMIT 1;
    SELECT id INTO pistol_id FROM exercises WHERE name = 'Pistol Squats' LIMIT 1;
    
    UPDATE exercises SET progression_exercise_id = squat_id WHERE id = wall_sit_id;
    UPDATE exercises SET progression_exercise_id = split_squat_id WHERE id = squat_id;
    UPDATE exercises SET progression_exercise_id = assisted_pistol_id WHERE id = split_squat_id;
    UPDATE exercises SET progression_exercise_id = pistol_id WHERE id = assisted_pistol_id;
    
    UPDATE exercises SET regression_exercise_id = wall_sit_id WHERE id = squat_id;
    UPDATE exercises SET regression_exercise_id = squat_id WHERE id = split_squat_id;
    UPDATE exercises SET regression_exercise_id = split_squat_id WHERE id = assisted_pistol_id;
    UPDATE exercises SET regression_exercise_id = assisted_pistol_id WHERE id = pistol_id;
END $$;

-- PLANK PROGRESSION CHAIN
-- Incline Plank -> Knee Plank -> Regular Plank
DO $$
DECLARE
    incline_plank_id UUID;
    knee_plank_id UUID;
    regular_plank_id UUID;
BEGIN
    SELECT id INTO incline_plank_id FROM exercises WHERE name = 'Incline Plank' LIMIT 1;
    SELECT id INTO knee_plank_id FROM exercises WHERE name = 'Knee Plank' LIMIT 1;
    SELECT id INTO regular_plank_id FROM exercises WHERE name = 'Plank' LIMIT 1;
    
    UPDATE exercises SET progression_exercise_id = knee_plank_id WHERE id = incline_plank_id;
    UPDATE exercises SET progression_exercise_id = regular_plank_id WHERE id = knee_plank_id;
    
    UPDATE exercises SET regression_exercise_id = incline_plank_id WHERE id = knee_plank_id;
    UPDATE exercises SET regression_exercise_id = knee_plank_id WHERE id = regular_plank_id;
END $$;