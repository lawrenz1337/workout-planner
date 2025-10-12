/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { workoutGenerator } from "../services/workoutGenerator";
import {
  GeneratedWorkout,
  GeneratedWorkoutExercise,
} from "../types/workout-service";
import {
  ExerciseCategory,
  ExerciseDifficulty,
  Equipment,
  WorkoutType,
  WorkoutGenerationOptions,
  getCategoryIcon,
  getCategoryDisplayName,
  getEquipmentDisplayName,
} from "../types/exercise";
import { useExercises } from "../hooks/useExercises";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useSaveTemplate } from "../hooks/useTemplates";
import { EQUIPMENT_OPTIONS } from "../constants";
import { suggestWorkoutCategories } from "../utils/muscleRecovery";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { queryKeys } from "../lib/queryKeys";
import { useAuth } from "../hooks/useAuth";

interface WorkoutGeneratorProps {
  userId: string;
}

export default function WorkoutGenerator({ userId }: WorkoutGeneratorProps) {
  const navigate = useNavigate();
  const [generatedWorkout, setGeneratedWorkout] =
    useState<GeneratedWorkout | null>(null);
  const [workoutOptions, setWorkoutOptions] =
    useState<WorkoutGenerationOptions | null>(null);

  const { preferences, loading: preferencesLoading } =
    useUserPreferences(userId);

  // Form state - will be pre-filled from preferences
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty[]>([
    ExerciseDifficulty.INTERMEDIATE,
  ]);
  const [workoutType, setWorkoutType] = useState<WorkoutType>(WorkoutType.HOME);
  const [selectedCategories, setSelectedCategories] = useState<
    ExerciseCategory[]
  >([
    ExerciseCategory.UPPER_PUSH,
    ExerciseCategory.UPPER_PULL,
    ExerciseCategory.LOWER_BODY,
    ExerciseCategory.CORE,
  ]);
  const [equipment, setEquipment] = useState<Equipment[]>([
    Equipment.BODYWEIGHT_ONLY,
  ]);
  const [respectRecovery, setRespectRecovery] = useState(true);

  const { data: userWorkouts = [] } = useQuery({
    queryKey: queryKeys.workouts.all(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    },
  });

  // Pre-fill form from user preferences
  useEffect(() => {
    if (preferences) {
      if (preferences.default_workout_duration) {
        setDuration(preferences.default_workout_duration);
      }
      if (preferences.difficulty_level) {
        setDifficulty([preferences.difficulty_level]);
      }
      if (
        preferences.available_equipment &&
        preferences.available_equipment.length > 0
      ) {
        setEquipment(preferences.available_equipment);
      }
    }
  }, [preferences]);

  const categories: ExerciseCategory[] = [
    ExerciseCategory.UPPER_PUSH,
    ExerciseCategory.UPPER_PULL,
    ExerciseCategory.LOWER_BODY,
    ExerciseCategory.CORE,
    ExerciseCategory.CARDIO,
    ExerciseCategory.SKILLS,
    ExerciseCategory.MOBILITY,
  ];

  const toggleDifficulty = (diff: ExerciseDifficulty) => {
    setDifficulty((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff],
    );
  };

  const toggleCategory = (category: ExerciseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleStartWorkout = () => {
    if (generatedWorkout) {
      navigate("/workouts/active", { state: { workout: generatedWorkout } });
    }
  };

  const toggleEquipment = (equip: Equipment) => {
    setEquipment((prev) =>
      prev.includes(equip) ? prev.filter((e) => e !== equip) : [...prev, equip],
    );
  };

  const { exercises, loading: exercisesLoading } = useExercises();

  const handleGenerate = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category");
      return;
    }

    if (difficulty.length === 0) {
      alert("Please select at least one difficulty level");
      return;
    }

    if (exercisesLoading) {
      alert("Exercises are not loaded yet, please wait");
      return;
    }

    try {
      const filteredExercises = exercises.filter((ex) =>
        difficulty.includes(ex.difficulty),
      );

      // Filter categories based on recovery if enabled
      let categoriesToUse = selectedCategories;
      if (respectRecovery && userWorkouts.length > 0) {
        const recoveredCategories = suggestWorkoutCategories(userWorkouts);

        console.log("🔍 Recovery Debug:", {
          selectedCategories,
          recoveredCategories,
          userWorkoutsCount: userWorkouts.length,
        });

        categoriesToUse = selectedCategories.filter((cat) =>
          recoveredCategories.includes(cat),
        );

        console.log("✅ Filtered categories:", categoriesToUse);

        // If all selected categories are fatigued, warn user
        if (categoriesToUse.length === 0) {
          const shouldContinue = window.confirm(
            "All selected muscle groups are still recovering. Continue anyway?",
          );
          if (!shouldContinue) return;
          categoriesToUse = selectedCategories; // Use original selection
          console.log("⚠️ User chose to continue despite fatigue");
        }
      }

      const options: WorkoutGenerationOptions = {
        duration_minutes: duration,
        difficulty: difficulty[0],
        categories: categoriesToUse,
        workout_type: workoutType,
        available_equipment: equipment,
        include_warmup: true,
        include_cooldown: true,
      };

      const workout = workoutGenerator.generateWorkout(
        filteredExercises,
        options,
      );
      setGeneratedWorkout(workout);
      setWorkoutOptions(options);
    } catch (error) {
      console.error("Error generating workout:", error);
      alert("Failed to generate workout. Please try again.");
    }
  };

  const handleSubstituteExercise = (
    section: "warmup" | "main_work" | "cooldown",
    index: number,
  ) => {
    if (!generatedWorkout || !workoutOptions) return;

    const currentExercise = generatedWorkout[section][index];

    const availableExercises = exercises.filter((ex) => {
      if (ex.category !== currentExercise.exercise.category) return false;
      const allWorkoutExercises = [
        ...generatedWorkout.warmup,
        ...generatedWorkout.main_work,
        ...generatedWorkout.cooldown,
      ];
      if (allWorkoutExercises.some((we) => we.exercise.id === ex.id))
        return false;
      if (!difficulty.includes(ex.difficulty)) return false;
      const hasCompatibleEquipment = ex.equipment.some((eq) =>
        workoutOptions.available_equipment.includes(eq),
      );
      if (!hasCompatibleEquipment) return false;
      return true;
    });

    if (availableExercises.length === 0) {
      alert("No alternative exercises found for this category");
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableExercises.length);
    const newExercise = availableExercises[randomIndex];

    const substitutedExercise: GeneratedWorkoutExercise = {
      exercise: newExercise,
      sets: currentExercise.sets,
      target_reps: newExercise.default_reps || currentExercise.target_reps,
      target_duration_seconds:
        newExercise.default_duration_seconds ||
        currentExercise.target_duration_seconds,
      rest_seconds: currentExercise.rest_seconds,
      order_index: currentExercise.order_index,
    };

    const updatedWorkout = { ...generatedWorkout };
    updatedWorkout[section] = [...updatedWorkout[section]];
    updatedWorkout[section][index] = substitutedExercise;

    setGeneratedWorkout(updatedWorkout);
  };

  if (preferencesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">
          Loading your preferences...
        </div>
      </div>
    );
  }

  if (generatedWorkout) {
    return (
      <WorkoutPreview
        workout={generatedWorkout}
        onBack={() => setGeneratedWorkout(null)}
        onRegenerate={handleGenerate}
        handleStartWorkout={handleStartWorkout}
        onSubstitute={handleSubstituteExercise}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
          Generate Workout
        </h2>
        <p className="text-gray-400 font-sans">
          Customize your workout and let AI create the perfect routine
        </p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Workout Duration: {duration} minutes
        </label>
        <input
          type="range"
          min="15"
          max="60"
          step="5"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 appearance-none outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-solid [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-none"
        />
        <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
          <span>15 min</span>
          <span>60 min</span>
        </div>
      </div>

      {/* Workout Type */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Workout Type
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setWorkoutType(WorkoutType.HOME)}
            className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
              workoutType === WorkoutType.HOME
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            🏠 Home Workout
          </button>
          <button
            onClick={() => setWorkoutType(WorkoutType.GYM)}
            className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
              workoutType === WorkoutType.GYM
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            🏋️ Gym Workout
          </button>
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Difficulty Level (select at least 1)
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleDifficulty(ExerciseDifficulty.BEGINNER)}
            className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
              difficulty.includes(ExerciseDifficulty.BEGINNER)
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => toggleDifficulty(ExerciseDifficulty.INTERMEDIATE)}
            className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
              difficulty.includes(ExerciseDifficulty.INTERMEDIATE)
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => toggleDifficulty(ExerciseDifficulty.ADVANCED)}
            className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
              difficulty.includes(ExerciseDifficulty.ADVANCED)
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Advanced
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Target Areas (select at least 1)
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
                selectedCategories.includes(cat)
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              {getCategoryIcon(cat)} {getCategoryDisplayName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Respect Muscle Recovery Toggle */}
      {userWorkouts.filter((w) => w.completed_at).length > 0 && (
        <div className="border border-yellow-400 p-3 md:p-4 bg-yellow-400/5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={respectRecovery}
              onChange={(e) => setRespectRecovery(e.target.checked)}
              className="mt-1 w-4 h-4 bg-black border-2 border-white checked:bg-teal-400 cursor-pointer"
            />
            <div className="flex-1">
              <span className="block text-sm font-mono text-white mb-1">
                💪 Respect Muscle Recovery
              </span>
              <span className="block text-xs text-gray-400 font-sans">
                {respectRecovery
                  ? "Workout will prioritize recovered muscle groups"
                  : "All muscle groups available (may cause overtraining)"}
              </span>
              {respectRecovery && (
                <span className="block text-xs text-teal-400 font-mono mt-2">
                  Suggested:{" "}
                  {suggestWorkoutCategories(userWorkouts)
                    .slice(0, 3)
                    .map((c) => getCategoryDisplayName(c))
                    .join(", ") || "All muscles ready"}
                </span>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Equipment */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Available Equipment
        </label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((equip) => (
            <button
              key={equip}
              onClick={() => toggleEquipment(equip)}
              className={`px-3 md:px-4 py-2 font-mono text-sm transition-colors border md:border-2 ${
                equipment.includes(equip)
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              {getEquipmentDisplayName(equip)}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={selectedCategories.length === 0 || difficulty.length === 0}
        className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg md:text-xl bg-black border-2 border-white cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ✨ Generate Workout
      </button>
    </div>
  );
}

// Workout Preview Component
interface WorkoutPreviewProps {
  workout: GeneratedWorkout;
  onBack: () => void;
  onRegenerate: () => void;
  handleStartWorkout: () => void;
  onSubstitute: (
    section: "warmup" | "main_work" | "cooldown",
    index: number,
  ) => void;
}

function WorkoutPreview({
  workout,
  onBack,
  onRegenerate,
  handleStartWorkout,
  onSubstitute,
}: WorkoutPreviewProps) {
  const { user } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState(workout.name);

  const saveTemplateMutation = useSaveTemplate(user?.id || "");

  const handleSaveAsTemplate = async () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    try {
      await saveTemplateMutation.mutateAsync({
        generatedWorkout: workout,
        templateName: templateName.trim(),
      });

      alert("✓ Template saved successfully!");
      setShowSaveModal(false);
    } catch (error) {
      console.error("Failed to save template:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
            {workout.name}
          </h2>
          <p className="text-gray-400 font-sans">
            {workout.total_duration_minutes} minute {workout.type} workout •{" "}
            {workout.main_work.length} exercises
          </p>
        </div>
      </div>

      {/* Warmup */}
      {workout.warmup.length > 0 && (
        <div className="border md:border-2 border-white p-3 md:p-4">
          <h3 className="text-lg md:text-xl font-bold mb-3 font-mono text-teal-400">
            Warmup (5 min)
          </h3>
          <div className="space-y-2">
            {workout.warmup.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div className="flex-1">
                  <p className="font-mono text-white text-sm md:text-base">
                    {item.exercise.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <p className="font-mono text-teal-400 text-sm md:text-base">
                    {item.target_duration_seconds}s
                  </p>
                  <button
                    onClick={() => onSubstitute("warmup", index)}
                    className="px-2 py-1 text-xs bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-mono transition-colors border border-gray-600 hover:border-white"
                    title="Substitute exercise"
                  >
                    🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Work */}
      <div className="border md:border-2 border-teal-400 p-3 md:p-4">
        <h3 className="text-lg md:text-xl font-bold mb-3 font-mono text-teal-400">
          Main Work
        </h3>
        <div className="space-y-2 md:space-y-3">
          {workout.main_work.map((item, index) => (
            <div
              key={index}
              className="border md:border-2 border-white p-2 md:p-3"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-mono text-white font-bold text-sm md:text-base">
                    {item.exercise.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-teal-400 text-black px-2 py-1 text-xs font-mono">
                    {item.exercise.difficulty}
                  </span>
                  <button
                    onClick={() => onSubstitute("main_work", index)}
                    className="px-2 py-1 text-xs bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-mono transition-colors border border-gray-600 hover:border-white"
                    title="Substitute exercise"
                  >
                    🔄
                  </button>
                </div>
              </div>
              <div className="flex gap-2 md:gap-4 text-xs md:text-sm font-mono">
                <span className="text-teal-400">{item.sets} sets</span>
                <span className="text-gray-400">×</span>
                <span className="text-white">
                  {item.target_reps
                    ? `${item.target_reps} reps`
                    : `${item.target_duration_seconds}s`}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{item.rest_seconds}s rest</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cooldown */}
      {workout.cooldown.length > 0 && (
        <div className="border md:border-2 border-white p-3 md:p-4">
          <h3 className="text-lg md:text-xl font-bold mb-3 font-mono text-teal-400">
            Cooldown (5 min)
          </h3>
          <div className="space-y-2">
            {workout.cooldown.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div className="flex-1">
                  <p className="font-mono text-white text-sm md:text-base">
                    {item.exercise.name}
                  </p>
                  <p className="text-xs md:text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <p className="font-mono text-teal-400 text-sm md:text-base">
                    {item.target_duration_seconds}s
                  </p>
                  <button
                    onClick={() => onSubstitute("cooldown", index)}
                    className="px-2 py-1 text-xs bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white font-mono transition-colors border border-gray-600 hover:border-white"
                    title="Substitute exercise"
                  >
                    🔄
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 md:gap-4 flex-col sm:flex-row">
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-yellow-400 after:bg-yellow-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-4 md:px-6 text-white font-mono text-base md:text-lg bg-black border-2 border-yellow-400 cursor-pointer select-none"
        >
          💾 Save as Template
        </button>

        <button
          onClick={onRegenerate}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-4 md:px-6 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
        >
          🔄 Regenerate
        </button>
        <button
          onClick={onBack}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-4 md:px-6 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
        >
          ← Back
        </button>
        <button
          onClick={handleStartWorkout}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-4 md:px-6 text-white font-mono text-base md:text-lg bg-black border-2 border-teal-400 cursor-pointer select-none"
        >
          🏃 Start Workout
        </button>
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-2 border-yellow-400 p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400 font-mono">
              Save as Template
            </h3>
            <p className="text-gray-300 mb-4 font-sans text-sm">
              Give this workout a memorable name so you can quickly start it
              later.
            </p>

            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g., Monday Upper Body"
              className="w-full bg-black text-white border-2 border-white px-4 py-3 font-mono focus:border-yellow-400 focus:outline-none mb-6"
              autoFocus
            />

            <div className="flex gap-4 flex-col sm:flex-row">
              <button
                onClick={handleSaveAsTemplate}
                disabled={
                  saveTemplateMutation.isPending || !templateName.trim()
                }
                className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-yellow-400 after:bg-yellow-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-yellow-400 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saveTemplateMutation.isPending ? "Saving..." : "Save Template"}
              </button>
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={saveTemplateMutation.isPending}
                className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-white cursor-pointer select-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
