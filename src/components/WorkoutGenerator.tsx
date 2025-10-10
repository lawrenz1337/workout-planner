/** @format */

import { useEffect, useState } from "react";
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
import { EQUIPMENT_OPTIONS } from "../constants";
import ActiveWorkoutTracker from "./ActiveWorkoutTracker";

interface WorkoutGeneratorProps {
  userId: string;
  userWeightKg?: number;
}

export default function WorkoutGenerator({
  userId,
  userWeightKg,
}: WorkoutGeneratorProps) {
  const [generatedWorkout, setGeneratedWorkout] =
    useState<GeneratedWorkout | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
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

  // Pre-fill form from user preferences
  useEffect(() => {
    if (preferences) {
      // Set duration from preferences
      if (preferences.default_workout_duration) {
        setDuration(preferences.default_workout_duration);
      }

      // Set difficulty from preferences
      if (preferences.difficulty_level) {
        setDifficulty([preferences.difficulty_level]);
      }

      // Set equipment from preferences
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

  // Equipment options imported from constants

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
    setIsWorkoutActive(true);
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

      const options: WorkoutGenerationOptions = {
        duration_minutes: duration,
        difficulty: difficulty[0],
        categories: selectedCategories,
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

  if (isWorkoutActive && generatedWorkout) {
    return (
      <ActiveWorkoutTracker
        workout={generatedWorkout}
        userId={userId}
        userWeightKg={userWeightKg}
        onComplete={() => {
          setIsWorkoutActive(false);
          setGeneratedWorkout(null);
        }}
        onExit={() => {
          if (
            confirm(
              "Are you sure you want to exit? Your progress will be lost.",
            )
          ) {
            setIsWorkoutActive(false);
          }
        }}
      />
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
    <div className="space-y-6">
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
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              workoutType === WorkoutType.HOME
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            🏠 Home Workout
          </button>
          <button
            onClick={() => setWorkoutType(WorkoutType.GYM)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
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
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              difficulty.includes(ExerciseDifficulty.BEGINNER)
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => toggleDifficulty(ExerciseDifficulty.INTERMEDIATE)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              difficulty.includes(ExerciseDifficulty.INTERMEDIATE)
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => toggleDifficulty(ExerciseDifficulty.ADVANCED)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
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
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
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
              className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
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
        className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-xl bg-black border-2 border-white cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
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
  return (
    <div className="space-y-6">
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
        <div className="border-2 border-white p-4">
          <h3 className="text-xl font-bold mb-3 font-mono text-teal-400">
            Warmup (5 min)
          </h3>
          <div className="space-y-2">
            {workout.warmup.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div className="flex-1">
                  <p className="font-mono text-white">{item.exercise.name}</p>
                  <p className="text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-teal-400">
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
      <div className="border-2 border-teal-400 p-4">
        <h3 className="text-xl font-bold mb-3 font-mono text-teal-400">
          Main Work
        </h3>
        <div className="space-y-3">
          {workout.main_work.map((item, index) => (
            <div key={index} className="border-2 border-white p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-mono text-white font-bold">
                    {item.exercise.name}
                  </p>
                  <p className="text-sm text-gray-400 font-sans">
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
              <div className="flex gap-4 text-sm font-mono">
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
        <div className="border-2 border-white p-4">
          <h3 className="text-xl font-bold mb-3 font-mono text-teal-400">
            Cooldown (5 min)
          </h3>
          <div className="space-y-2">
            {workout.cooldown.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-700 pb-2"
              >
                <div className="flex-1">
                  <p className="font-mono text-white">{item.exercise.name}</p>
                  <p className="text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-teal-400">
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
      <div className="flex gap-4 flex-col sm:flex-row">
        <button
          onClick={onRegenerate}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none"
        >
          🔄 Regenerate
        </button>
        <button
          onClick={onBack}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none"
        >
          ← Back
        </button>
        <button
          onClick={handleStartWorkout}
          className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg bg-black border-2 border-teal-400 cursor-pointer select-none"
        >
          🏃 Start Workout
        </button>
      </div>
    </div>
  );
}
