/** @format */

import { useState } from "react";
import {
  workoutGenerator,
  WorkoutGenerationOptions,
  GeneratedWorkout,
} from "../services/workoutGenerator";
import {
  ExerciseCategory,
  ExerciseDifficulty,
  Equipment,
  getCategoryIcon,
  getCategoryDisplayName,
  getEquipmentDisplayName,
} from "../types/exercise";
import { useExercises } from "../hooks/useExercises";

export default function WorkoutGenerator() {
  const [generatedWorkout, setGeneratedWorkout] =
    useState<GeneratedWorkout | null>(null);

  // Form state
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>(
    ExerciseDifficulty.INTERMEDIATE,
  );
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

  const categories: ExerciseCategory[] = [
    ExerciseCategory.UPPER_PUSH,
    ExerciseCategory.UPPER_PULL,
    ExerciseCategory.LOWER_BODY,
    ExerciseCategory.CORE,
    ExerciseCategory.CARDIO,
    ExerciseCategory.SKILLS,
    ExerciseCategory.MOBILITY,
  ];

  const equipmentOptions: Equipment[] = [
    Equipment.BODYWEIGHT_ONLY,
    Equipment.PULL_UP_BAR,
    Equipment.PARALLETTES,
    Equipment.DIP_BARS,
    Equipment.RINGS,
    Equipment.RESISTANCE_BANDS,
    Equipment.WALL,
    Equipment.BENCH,
    Equipment.AB_ROLLER,
    Equipment.JUMP_ROPE,
  ];

  const toggleCategory = (category: ExerciseCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
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

    if (exercisesLoading) {
      alert("Exercises are not loaded yet, please wait");
      return;
    }

    try {
      const options: WorkoutGenerationOptions = {
        duration_minutes: duration,
        difficulty,
        categories: selectedCategories,
        available_equipment: equipment,
        include_warmup: true,
        include_cooldown: true,
      };

      const workout = workoutGenerator.generateWorkout(exercises, options);
      setGeneratedWorkout(workout);
    } catch (error) {
      console.error("Error generating workout:", error);
      alert("Failed to generate workout. Please try again.");
    }
  };

  if (generatedWorkout) {
    return (
      <WorkoutPreview
        workout={generatedWorkout}
        onBack={() => setGeneratedWorkout(null)}
        onRegenerate={handleGenerate}
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

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-mono text-gray-400 mb-2">
          Difficulty Level
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDifficulty(ExerciseDifficulty.BEGINNER)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              difficulty === ExerciseDifficulty.BEGINNER
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Beginner
          </button>
          <button
            onClick={() => setDifficulty(ExerciseDifficulty.INTERMEDIATE)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              difficulty === ExerciseDifficulty.INTERMEDIATE
                ? "bg-teal-400 text-black border-teal-400"
                : "bg-black text-white border-white hover:border-teal-400"
            }`}
          >
            Intermediate
          </button>
          <button
            onClick={() => setDifficulty(ExerciseDifficulty.ADVANCED)}
            className={`px-4 py-2 font-mono text-sm transition-colors border-2 ${
              difficulty === ExerciseDifficulty.ADVANCED
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
          {equipmentOptions.map((equip) => (
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
        disabled={selectedCategories.length === 0}
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
}

function WorkoutPreview({
  workout,
  onBack,
  onRegenerate,
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
            {workout.total_duration_minutes} minute workout •{" "}
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
                <div>
                  <p className="font-mono text-white">{item.exercise.name}</p>
                  <p className="text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <p className="font-mono text-teal-400">
                  {item.target_duration_seconds}s
                </p>
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
                <div>
                  <p className="font-mono text-white font-bold">
                    {item.exercise.name}
                  </p>
                  <p className="text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <span className="bg-teal-400 text-black px-2 py-1 text-xs font-mono">
                  {item.exercise.difficulty}
                </span>
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
                <div>
                  <p className="font-mono text-white">{item.exercise.name}</p>
                  <p className="text-sm text-gray-400 font-sans">
                    {item.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <p className="font-mono text-teal-400">
                  {item.target_duration_seconds}s
                </p>
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
        <button className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg bg-black border-2 border-teal-400 cursor-pointer select-none">
          💾 Save & Start
        </button>
      </div>
    </div>
  );
}
