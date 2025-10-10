-- Seed data for default exercises
-- Run this AFTER the main migration

-- UPPER PUSH EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Push-ups', 'upper_push', 'home', 'beginner', ARRAY['bodyweight_only'], 'Classic push-up with hands shoulder-width apart', ARRAY['Keep core tight', 'Lower chest to ground', 'Full elbow extension at top', 'Body in straight line'], 3, 12, true),
('Diamond Push-ups', 'upper_push', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Push-ups with hands forming a diamond shape', ARRAY['Hands form diamond under chest', 'Elbows stay close to body', 'Focus on triceps engagement'], 3, 10, true),
('Wide Push-ups', 'upper_push', 'home', 'beginner', ARRAY['bodyweight_only'], 'Push-ups with hands wider than shoulders', ARRAY['Hands 1.5x shoulder width', 'Emphasizes chest', 'Control the descent'], 3, 12, true),
('Pike Push-ups', 'upper_push', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Push-ups with hips elevated', ARRAY['Form an inverted V shape', 'Head goes toward ground', 'Shoulders do most work', 'Precursor to handstand push-ups'], 3, 8, true),
('Archer Push-ups', 'upper_push', 'home', 'advanced', ARRAY['bodyweight_only'], 'Push-ups shifting weight to one arm', ARRAY['Start wide', 'Shift weight to one side', 'Other arm stays straight', 'Progression to one-arm'], 3, 6, true),
('Dips', 'upper_push', 'both', 'intermediate', ARRAY['dip_bars', 'parallettes'], 'Parallel bar dips', ARRAY['Lean slightly forward', 'Lower until upper arms parallel', 'Full lockout at top', 'Don''t shrug shoulders'], 3, 10, true),
('Ring Dips', 'upper_push', 'home', 'advanced', ARRAY['rings'], 'Dips performed on gymnastic rings', ARRAY['Turn rings out at top', 'Extreme stability required', 'Lower with control', 'Advanced variation'], 3, 6, true),
('Pseudo Planche Push-ups', 'upper_push', 'home', 'advanced', ARRAY['bodyweight_only'], 'Push-ups with hands by hips, leaning forward', ARRAY['Hands by hips', 'Lean forward significantly', 'Straight body', 'Planche prerequisite'], 3, 5, true);

-- UPPER PULL EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Pull-ups', 'upper_pull', 'both', 'intermediate', ARRAY['pull_up_bar'], 'Overhand grip pull-ups', ARRAY['Dead hang start', 'Pull chin over bar', 'Control descent', 'Full arm extension'], 3, 8, true),
('Chin-ups', 'upper_pull', 'both', 'beginner', ARRAY['pull_up_bar'], 'Underhand grip pull-ups', ARRAY['Palms facing you', 'Easier than pull-ups', 'More bicep involvement', 'Chin clears bar'], 3, 10, true),
('Wide Pull-ups', 'upper_pull', 'both', 'advanced', ARRAY['pull_up_bar'], 'Pull-ups with wide grip', ARRAY['Hands much wider than shoulders', 'Lat focused', 'Harder range of motion', 'Upper back emphasis'], 3, 6, true),
('Archer Pull-ups', 'upper_pull', 'both', 'advanced', ARRAY['pull_up_bar'], 'Pull-ups pulling to one side', ARRAY['Wide grip', 'Pull to one arm', 'Other arm stays straight', 'One-arm progression'], 3, 4, true),
('Australian Rows', 'upper_pull', 'home', 'beginner', ARRAY['pull_up_bar'], 'Horizontal pulling under low bar', ARRAY['Body straight', 'Chest to bar', 'Squeeze shoulder blades', 'Beginner pulling movement'], 3, 12, true),
('Ring Rows', 'upper_pull', 'home', 'beginner', ARRAY['rings'], 'Rows performed on rings', ARRAY['More unstable than bar', 'Adjust height for difficulty', 'Pull chest to rings', 'Great for beginners'], 3, 12, true),
('L-sit Pull-ups', 'upper_pull', 'both', 'advanced', ARRAY['pull_up_bar'], 'Pull-ups while holding L-sit position', ARRAY['Legs straight out', 'Extreme core requirement', 'Advanced variation', 'Maintain L throughout'], 3, 5, true);

-- LOWER BODY EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Bodyweight Squats', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only'], 'Basic squat movement', ARRAY['Feet shoulder width', 'Hips below knees', 'Chest up', 'Weight on heels'], 3, 15, true),
('Pistol Squats', 'lower_body', 'home', 'advanced', ARRAY['bodyweight_only'], 'Single-leg squat', ARRAY['One leg extended forward', 'Full depth on one leg', 'Balance challenge', 'Ultimate leg exercise'], 3, 5, true),
('Bulgarian Split Squats', 'lower_body', 'home', 'intermediate', ARRAY['bench'], 'Rear foot elevated split squat', ARRAY['Back foot on bench', 'Lower back knee', 'Front leg does work', 'Great for balance'], 3, 10, true),
('Lunges', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only'], 'Forward or reverse lunges', ARRAY['Step forward or back', 'Lower until back knee near ground', 'Push back to start', 'Alternate legs'], 3, 12, true),
('Jump Squats', 'lower_body', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Explosive squat with jump', ARRAY['Squat down', 'Explode up into jump', 'Land softly', 'Power development'], 3, 10, true),
('Nordic Curls', 'lower_body', 'home', 'advanced', ARRAY['bodyweight_only', 'wall'], 'Bodyweight hamstring curl', ARRAY['Anchor feet', 'Lower body forward', 'Hamstrings resist', 'One of hardest leg exercises'], 3, 5, true),
('Calf Raises', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only'], 'Standing calf raises', ARRAY['Rise on toes', 'Full range of motion', 'Squeeze at top', 'Can do single leg'], 3, 20, true),
('Shrimp Squats', 'lower_body', 'home', 'advanced', ARRAY['bodyweight_only'], 'Single leg squat holding back foot', ARRAY['Hold back foot behind', 'Lower on one leg', 'Pistol alternative', 'Easier on balance'], 3, 8, true);

-- CORE EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Plank', 'core', 'home', 'beginner', ARRAY['bodyweight_only'], 'Front plank hold', ARRAY['Forearms on ground', 'Body straight', 'Don''t let hips sag', 'Squeeze glutes and core'], 3, 60, true),
('Side Plank', 'core', 'home', 'beginner', ARRAY['bodyweight_only'], 'Lateral plank hold', ARRAY['On one forearm', 'Stack feet', 'Hips up', 'Both sides'], 3, 45, true),
('Hollow Hold', 'core', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Core compression hold', ARRAY['Lower back pressed to ground', 'Arms and legs extended', 'Body in banana shape', 'Gymnastics fundamental'], 3, 30, true),
('Arch Hold', 'core', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Superman hold', ARRAY['Lying on stomach', 'Lift arms and legs', 'Only hips touch ground', 'Opposite of hollow'], 3, 30, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Hanging Leg Raises', 'core', 'both', 'intermediate', ARRAY['pull_up_bar'], 'Raise legs while hanging', ARRAY['Dead hang', 'Raise legs to L-position', 'Control descent', 'No swinging'], 3, 12, true),
('Lying Leg Raises', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat'], 'Leg raises on ground', ARRAY['Press lower back down', 'Raise legs to 90 degrees', 'Lower slowly', 'Don''t arch back'], 3, 15, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('L-sit Hold', 'core', 'both', 'advanced', ARRAY['parallettes', 'pull_up_bar'], 'Hold body with legs extended', ARRAY['Legs parallel to ground', 'Shoulders depressed', 'Extreme compression', 'Core and shoulder strength'], 3, 15, true);

-- CARDIO EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Burpees', 'cardio', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Full body cardio movement', ARRAY['Squat, hands down', 'Jump back to plank', 'Push-up optional', 'Jump up explosively'], 3, 15, true),
('Mountain Climbers', 'cardio', 'home', 'beginner', ARRAY['bodyweight_only'], 'Running motion in plank', ARRAY['Plank position', 'Drive knees to chest', 'Keep hips low', 'Fast pace'], 3, 30, true),
('Jumping Jacks', 'cardio', 'home', 'beginner', ARRAY['bodyweight_only'], 'Classic jumping exercise', ARRAY['Jump feet wide', 'Arms overhead', 'Return to start', 'Maintain rhythm'], 3, 30, true),
('High Knees', 'cardio', 'home', 'beginner', ARRAY['bodyweight_only'], 'Running in place with high knees', ARRAY['Drive knees up high', 'Quick pace', 'Pump arms', 'Stay on toes'], 3, 30, true),
('Jump Squats', 'cardio', 'home', 'intermediate', ARRAY['bodyweight_only'], 'Explosive squat jumps', ARRAY['Squat down', 'Explode up', 'Land softly', 'Repeat quickly'], 3, 15, true);

-- SKILLS EXERCISES  
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Wall Handstand Hold', 'skills', 'home', 'intermediate', ARRAY['wall'], 'Handstand against wall', ARRAY['Kick up to wall', 'Arms locked', 'Body straight', 'Look at ground'], 3, 30, true),
('Freestanding Handstand', 'skills', 'home', 'advanced', ARRAY['bodyweight_only'], 'Handstand without support', ARRAY['Perfect balance required', 'Finger pressure for balance', 'Tight body', 'Advanced skill'], 3, 15, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Handstand Push-ups', 'skills', 'home', 'advanced', ARRAY['wall'], 'Push-ups in handstand position', ARRAY['Against wall', 'Lower head to ground', 'Press back up', 'Ultimate push strength'], 3, 5, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Tuck Front Lever', 'skills', 'both', 'intermediate', ARRAY['pull_up_bar'], 'Front lever with knees tucked', ARRAY['Hang from bar', 'Pull into horizontal', 'Knees to chest', 'Back parallel to ground'], 3, 10, true),
('Front Lever', 'skills', 'both', 'advanced', ARRAY['pull_up_bar'], 'Horizontal hold under bar', ARRAY['Body parallel to ground', 'Face up', 'Straight body', 'Elite level strength'], 3, 5, true),
('Tuck Planche', 'skills', 'home', 'advanced', ARRAY['bodyweight_only', 'parallettes'], 'Planche with knees tucked', ARRAY['Lean far forward', 'Knees tucked', 'Hands by hips', 'Feet off ground'], 3, 10, true);

INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Muscle-up Progression', 'skills', 'both', 'advanced', ARRAY['pull_up_bar', 'rings'], 'Transition from pull-up to dip', ARRAY['Explosive pull', 'High pull', 'Quick transition', 'Advanced movement'], 3, 3, true);

-- MOBILITY EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Cat-Cow Stretch', 'mobility', 'home', 'beginner', ARRAY['yoga_mat'], 'Spinal mobility flow', ARRAY['On hands and knees', 'Arch and round spine', 'Follow with head', 'Breathe with movement'], 2, 60, true),
('Shoulder Dislocates', 'mobility', 'home', 'beginner', ARRAY['resistance_bands'], 'Shoulder mobility with band/stick', ARRAY['Wide grip on band', 'Move over head to back', 'Keep arms straight', 'Gradually narrow grip'], 2, 45, true),
('Wrist Circles', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only'], 'Wrist mobility warm-up', ARRAY['Hands together', 'Make circles', 'Both directions', 'Essential before handstands'], 2, 30, true),
('Deep Squat Hold', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only'], 'Bottom squat position hold', ARRAY['Hips below knees', 'Heels down', 'Chest up', 'Open hips'], 2, 60, true),
('Pike Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only'], 'Hamstring flexibility', ARRAY['Fold forward', 'Legs straight', 'Reach for toes', 'Breathe into stretch'], 2, 60, true),
('Hip Circles', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only'], 'Hip mobility circles', ARRAY['Stand on one leg', 'Circle other leg', 'Both directions', 'Controlled movement'], 2, 30, true);

-- CORE EXERCISES - Ab Roller
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, is_default) VALUES
('Ab Roller (Kneeling)', 'core', 'home', 'intermediate', ARRAY['ab_roller'], 'Roll out from knees with ab roller', ARRAY['Start on knees', 'Roll forward slowly', 'Keep core tight', 'Don''t let hips sag', 'Roll back to start'], 3, 10, true),
('Ab Roller (Standing)', 'core', 'home', 'advanced', ARRAY['ab_roller'], 'Roll out from standing position with ab roller', ARRAY['Start standing', 'Roll forward to full extension', 'Extreme core strength required', 'Most difficult ab exercise', 'Keep legs straight'], 3, 5, true);

-- CARDIO EXERCISES - Jump Rope
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_duration_seconds, is_default) VALUES
('Jump Rope', 'cardio', 'home', 'beginner', ARRAY['jump_rope'], 'Basic jump rope for cardio', ARRAY['Jump on balls of feet', 'Keep jumps small and quick', 'Wrists do the work', 'Maintain rhythm'], 3, 60, true),
('Jump Rope (Double Unders)', 'cardio', 'home', 'advanced', ARRAY['jump_rope'], 'Advanced jump rope with double rotation per jump', ARRAY['Jump higher than normal', 'Rope passes under feet twice', 'Quick wrist rotation', 'Advanced cardio'], 3, 30, true),
('Jump Rope (High Knees)', 'cardio', 'home', 'intermediate', ARRAY['jump_rope'], 'Jump rope while driving knees high', ARRAY['Bring knees to hip height', 'Combines cardio with leg work', 'Maintain pace', 'Harder than regular jumping'], 3, 45, true);

-- ============================================================================
-- ADD COMPREHENSIVE BODYWEIGHT EXERCISES FOR HOME WORKOUTS
-- Run this in Supabase SQL Editor
-- ============================================================================

-- MOBILITY & WARMUP EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, default_duration_seconds, is_default, muscles_primary, muscles_secondary) VALUES
('Arm Circles', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Dynamic shoulder warm-up with circular arm movements', ARRAY['Stand with arms extended', 'Make large circles', 'Both directions', 'Gradually increase size'], 2, NULL, 30, true, ARRAY['shoulders']::TEXT[], ARRAY['upper_back', 'chest']::TEXT[]),
('Leg Swings', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'wall']::TEXT[], 'Dynamic leg mobility swings', ARRAY['Hold wall for balance', 'Swing leg forward and back', 'Keep core engaged', 'Controlled movement'], 2, 15, NULL, true, ARRAY['hip_flexors', 'hamstrings']::TEXT[], ARRAY['glutes', 'core']::TEXT[]),
('Ankle Circles', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Ankle mobility circles', ARRAY['Seated or standing', 'Circle ankles slowly', 'Both directions', 'Full range of motion'], 2, NULL, 30, true, ARRAY['ankles', 'calves']::TEXT[], ARRAY[]::TEXT[]),
('Neck Rolls', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Gentle neck mobility circles', ARRAY['Slow controlled movements', 'Both directions', 'No forcing', 'Relax shoulders'], 2, NULL, 30, true, ARRAY['spine']::TEXT[], ARRAY['shoulders']::TEXT[]),
('Torso Twists', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Rotational spine mobility', ARRAY['Hands on hips or extended', 'Rotate through spine', 'Keep hips stable', 'Both directions'], 2, 15, NULL, true, ARRAY['obliques', 'spine']::TEXT[], ARRAY['core', 'lower_back']::TEXT[]),
('Inchworms', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Dynamic full-body warm-up movement', ARRAY['Bend forward to hands on ground', 'Walk hands out to plank', 'Walk feet to hands', 'Great hamstring stretch'], 2, 8, NULL, true, ARRAY['hamstrings', 'core']::TEXT[], ARRAY['shoulders', 'lower_back']::TEXT[]),
('World''s Greatest Stretch', 'mobility', 'home', 'intermediate', ARRAY['bodyweight_only']::TEXT[], 'Multi-planar full-body stretch', ARRAY['Lunge position', 'Rotate torso to front leg', 'Reach arm overhead', 'Opens hips and thoracic spine'], 2, 6, NULL, true, ARRAY['hips', 'hip_flexors']::TEXT[], ARRAY['spine', 'hamstrings', 'shoulders']::TEXT[]),
('Scapular Shrugs', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Shoulder blade activation in plank', ARRAY['Hold plank position', 'Push shoulder blades apart', 'Squeeze together', 'Prepares for push-ups'], 2, 10, NULL, true, ARRAY['shoulders', 'upper_back']::TEXT[], ARRAY['core']::TEXT[]),
('Thoracic Rotations', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Upper spine rotation mobility', ARRAY['On hands and knees', 'Hand behind head', 'Rotate elbow to ceiling', 'Follow with eyes'], 2, 10, NULL, true, ARRAY['spine', 'upper_back']::TEXT[], ARRAY['shoulders', 'obliques']::TEXT[]),
('Arm Swings', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Dynamic arm warm-up swings', ARRAY['Stand relaxed', 'Swing arms across body', 'Gradually increase range', 'Loosens shoulders'], 2, NULL, 30, true, ARRAY['shoulders', 'chest']::TEXT[], ARRAY['upper_back']::TEXT[]);

-- COOLDOWN & STATIC STRETCHES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, default_duration_seconds, is_default, muscles_primary, muscles_secondary) VALUES
('Quad Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'wall']::TEXT[], 'Standing quadriceps stretch', ARRAY['Pull heel to glutes', 'Keep knees together', 'Hold wall if needed', 'Feel stretch in front thigh'], 2, NULL, 45, true, ARRAY['quads']::TEXT[], ARRAY['hip_flexors']::TEXT[]),
('Standing Hamstring Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Standing forward fold hamstring stretch', ARRAY['Feet hip width', 'Hinge at hips', 'Reach toward toes', 'Keep slight knee bend'], 2, NULL, 45, true, ARRAY['hamstrings', 'lower_back']::TEXT[], ARRAY['calves']::TEXT[]),
('Butterfly Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Seated groin and hip stretch', ARRAY['Sit with soles together', 'Pull feet close', 'Press knees down gently', 'Keep back straight'], 2, NULL, 60, true, ARRAY['hips', 'hip_flexors']::TEXT[], ARRAY['lower_back']::TEXT[]),
('Seated Spinal Twist', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Seated rotation stretch for spine', ARRAY['Sit with one leg bent', 'Twist toward bent knee', 'Use arm to deepen twist', 'Both sides'], 2, NULL, 45, true, ARRAY['spine', 'obliques']::TEXT[], ARRAY['lower_back', 'hips']::TEXT[]),
('Child''s Pose', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Restorative yoga pose for back and shoulders', ARRAY['Knees wide, sit on heels', 'Arms extended forward', 'Forehead to ground', 'Breathe deeply'], 2, NULL, 60, true, ARRAY['lower_back', 'spine']::TEXT[], ARRAY['shoulders', 'hips']::TEXT[]),
('Cobra Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Prone back extension stretch', ARRAY['Lie face down', 'Hands under shoulders', 'Press chest up', 'Keep hips down'], 2, NULL, 30, true, ARRAY['abs', 'spine']::TEXT[], ARRAY['chest', 'shoulders']::TEXT[]),
('Downward Dog Hold', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Inverted V yoga pose', ARRAY['Hands and feet on ground', 'Hips to ceiling', 'Press heels down', 'Straighten legs'], 2, NULL, 45, true, ARRAY['hamstrings', 'calves']::TEXT[], ARRAY['shoulders', 'lower_back']::TEXT[]),
('Figure-4 Hip Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Supine piriformis and hip stretch', ARRAY['Lie on back', 'Cross ankle over knee', 'Pull knee toward chest', 'Feel stretch in hip'], 2, NULL, 45, true, ARRAY['hips', 'glutes']::TEXT[], ARRAY['lower_back']::TEXT[]),
('Tricep Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Overhead tricep stretch', ARRAY['Reach arm overhead', 'Bend elbow behind head', 'Pull elbow with other hand', 'Both arms'], 2, NULL, 30, true, ARRAY['triceps']::TEXT[], ARRAY['shoulders']::TEXT[]),
('Chest Doorway Stretch', 'mobility', 'home', 'beginner', ARRAY['wall']::TEXT[], 'Chest and shoulder stretch using wall', ARRAY['Arm on wall/doorframe', 'Step forward gently', 'Feel stretch across chest', 'Both sides'], 2, NULL, 45, true, ARRAY['chest']::TEXT[], ARRAY['shoulders']::TEXT[]),
('Calf Stretch', 'mobility', 'home', 'beginner', ARRAY['bodyweight_only', 'wall']::TEXT[], 'Standing calf stretch against wall', ARRAY['Front leg bent', 'Back leg straight', 'Heel down on back leg', 'Lean into wall'], 2, NULL, 45, true, ARRAY['calves']::TEXT[], ARRAY['ankles']::TEXT[]);

-- ADDITIONAL CORE EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, default_duration_seconds, is_default, muscles_primary, muscles_secondary) VALUES
('Russian Twists', 'core', 'home', 'intermediate', ARRAY['bodyweight_only']::TEXT[], 'Seated rotational core exercise', ARRAY['Lean back slightly', 'Feet off ground', 'Rotate side to side', 'Touch ground each side'], 3, 20, NULL, true, ARRAY['obliques', 'abs']::TEXT[], ARRAY['core', 'hip_flexors']::TEXT[]),
('Bicycle Crunches', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Alternating elbow to knee crunches', ARRAY['Hands behind head', 'Bring opposite elbow to knee', 'Extend other leg', 'Continuous motion'], 3, 20, NULL, true, ARRAY['abs', 'obliques']::TEXT[], ARRAY['hip_flexors']::TEXT[]),
('Flutter Kicks', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Alternating leg raises for lower abs', ARRAY['Lie on back', 'Legs straight', 'Alternate small kicks', 'Lower back pressed down'], 3, 30, NULL, true, ARRAY['abs', 'hip_flexors']::TEXT[], ARRAY['core']::TEXT[]),
('Reverse Crunches', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Lower ab focused crunches', ARRAY['Knees bent', 'Lift hips off ground', 'Bring knees to chest', 'Control descent'], 3, 15, NULL, true, ARRAY['abs']::TEXT[], ARRAY['hip_flexors', 'core']::TEXT[]),
('Side Plank (Knee Down)', 'core', 'home', 'beginner', ARRAY['bodyweight_only', 'yoga_mat']::TEXT[], 'Easier side plank variation', ARRAY['Bottom knee on ground', 'Top leg straight', 'Hips up', 'Easier than full side plank'], 3, NULL, 30, true, ARRAY['obliques', 'core']::TEXT[], ARRAY['shoulders']::TEXT[]);

-- ADDITIONAL LOWER BODY EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, default_duration_seconds, is_default, muscles_primary, muscles_secondary) VALUES
('Step-ups', 'lower_body', 'home', 'beginner', ARRAY['bench']::TEXT[], 'Single leg step onto elevated surface', ARRAY['Step fully onto bench', 'Drive through heel', 'Control descent', 'Alternate legs'], 3, 12, NULL, true, ARRAY['quads', 'glutes']::TEXT[], ARRAY['hamstrings', 'calves', 'core']::TEXT[]),
('Single Leg Deadlifts', 'lower_body', 'home', 'intermediate', ARRAY['bodyweight_only']::TEXT[], 'Balance and hamstring exercise', ARRAY['Stand on one leg', 'Hinge at hip', 'Reach toward ground', 'Feel stretch in hamstring'], 3, 10, NULL, true, ARRAY['hamstrings', 'glutes']::TEXT[], ARRAY['lower_back', 'core', 'balance']::TEXT[]),
('Reverse Lunges', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Backward stepping lunges', ARRAY['Step backward', 'Lower back knee', 'Push through front heel', 'Easier than forward lunges'], 3, 12, NULL, true, ARRAY['quads', 'glutes']::TEXT[], ARRAY['hamstrings', 'core', 'calves']::TEXT[]),
('Squat Pulses', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Small pulsing movements in squat position', ARRAY['Hold squat position', 'Small up and down pulses', 'Stay low', 'Burns legs'], 3, NULL, 30, true, ARRAY['quads', 'glutes']::TEXT[], ARRAY['hamstrings', 'core']::TEXT[]),
('Sumo Squats', 'lower_body', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Wide stance squats targeting inner thighs', ARRAY['Feet wide, toes out', 'Squat straight down', 'Knees track over toes', 'Emphasizes inner thigh'], 3, 15, NULL, true, ARRAY['quads', 'glutes']::TEXT[], ARRAY['hamstrings', 'hip_flexors', 'core']::TEXT[]);

-- ADDITIONAL CARDIO EXERCISES
INSERT INTO exercises (name, category, location, difficulty, equipment, description, form_cues, default_sets, default_reps, default_duration_seconds, is_default, muscles_primary, muscles_secondary) VALUES
('Butt Kickers', 'cardio', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Running in place kicking heels to glutes', ARRAY['Run in place', 'Kick heels to glutes', 'Quick pace', 'Pump arms'], 3, 30, NULL, true, ARRAY['cardiovascular', 'hamstrings']::TEXT[], ARRAY['calves', 'core']::TEXT[]),
('Skaters', 'cardio', 'home', 'intermediate', ARRAY['bodyweight_only']::TEXT[], 'Lateral jumping exercise', ARRAY['Jump side to side', 'Land on one foot', 'Swing arms across', 'Like speed skating'], 3, 20, NULL, true, ARRAY['cardiovascular', 'legs']::TEXT[], ARRAY['glutes', 'core', 'balance']::TEXT[]),
('Seal Jacks', 'cardio', 'home', 'beginner', ARRAY['bodyweight_only']::TEXT[], 'Jumping jacks with horizontal arm movement', ARRAY['Jump feet wide', 'Arms extend to sides', 'Clap in front', 'Different from jumping jacks'], 3, 30, NULL, true, ARRAY['cardiovascular']::TEXT[], ARRAY['shoulders', 'core']::TEXT[]);