/** @format */

import { useState } from "react";
import { useExercises } from "../hooks/useExercises";
import {
  ExerciseCategory,
  ExerciseDifficulty,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../types/exercise";
import {
  EnhancedExercise,
  getMuscleGroupDisplayName,
  getMuscleGroupIcon,
} from "../types/enhanced-types";

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

export default function ExerciseLibrary() {
  const { exercises, loading } = useExercises();
  const [selectedCategory, setSelectedCategory] = useState<
    ExerciseCategory | "all"
  >("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ExerciseDifficulty | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExercise, setSelectedExercise] =
    useState<EnhancedExercise | null>(null);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesCategory =
      selectedCategory === "all" || exercise.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" ||
      exercise.difficulty === selectedDifficulty;
    const matchesSearch =
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const categories: ExerciseCategory[] = [
    ExerciseCategory.UPPER_PUSH,
    ExerciseCategory.UPPER_PULL,
    ExerciseCategory.LOWER_BODY,
    ExerciseCategory.CORE,
    ExerciseCategory.CARDIO,
    ExerciseCategory.SKILLS,
    ExerciseCategory.MOBILITY,
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-2xl font-mono text-teal-400">
          Loading exercises...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
          Exercise Library
        </h2>
        <p className="text-gray-400 font-sans">
          Browse {exercises.length} exercises across all categories
        </p>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black text-white border md:border-2 border-white px-3 md:px-4 py-2 md:py-3 font-sans focus:border-teal-400 focus:outline-none"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3 md:space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                selectedCategory === "all"
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                  selectedCategory === cat
                    ? "bg-teal-400 text-black border-teal-400"
                    : "bg-black text-white border-white hover:border-teal-400"
                }`}
              >
                {getCategoryIcon(cat)} {getCategoryDisplayName(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-2">
            Difficulty
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty("all")}
              className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                selectedDifficulty === "all"
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDifficulty(ExerciseDifficulty.BEGINNER)}
              className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                selectedDifficulty === ExerciseDifficulty.BEGINNER
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() =>
                setSelectedDifficulty(ExerciseDifficulty.INTERMEDIATE)
              }
              className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                selectedDifficulty === ExerciseDifficulty.INTERMEDIATE
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setSelectedDifficulty(ExerciseDifficulty.ADVANCED)}
              className={`px-3 md:px-4 py-2 font-mono text-xs md:text-sm transition-colors border md:border-2 ${
                selectedDifficulty === ExerciseDifficulty.ADVANCED
                  ? "bg-teal-400 text-black border-teal-400"
                  : "bg-black text-white border-white hover:border-teal-400"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400 font-mono">
        Showing {filteredExercises.length} exercise
        {filteredExercises.length !== 1 ? "s" : ""}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="bg-black border md:border-2 border-white hover:border-teal-400 p-3 md:p-4 text-left transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl">
                  {getCategoryIcon(exercise.category)}
                </span>
                <div>
                  <h3 className="font-bold text-white group-hover:text-teal-400 transition-colors font-mono text-sm md:text-base">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    {getCategoryDisplayName(exercise.category)}
                  </p>
                </div>
              </div>
              <span
                className={`${difficultyColors[exercise.difficulty]} text-xs px-2 py-1 text-black font-mono`}
              >
                {exercise.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 font-sans">
              {exercise.description}
            </p>
            <div className="mt-2 md:mt-3 text-xs text-gray-500 font-mono">
              {exercise.default_reps
                ? `${exercise.default_sets}x${exercise.default_reps} reps`
                : exercise.default_duration_seconds
                  ? `${exercise.default_sets}x${exercise.default_duration_seconds}s`
                  : ""}
            </div>
          </button>
        ))}
      </div>

      {/* No Results */}
      {filteredExercises.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl font-mono">No exercises found</p>
          <p className="text-sm mt-2 font-sans">Try adjusting your filters</p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          exercises={exercises}
          onNavigate={(exercise) => setSelectedExercise(exercise)}
        />
      )}
    </div>
  );
}

// Exercise Detail Modal Component
interface ExerciseDetailModalProps {
  exercise: EnhancedExercise;
  onClose: () => void;
  exercises: EnhancedExercise[];
  onNavigate: (exercise: EnhancedExercise) => void;
}

function ExerciseDetailModal({
  exercise,
  onClose,
  exercises,
  onNavigate,
}: ExerciseDetailModalProps) {
  const progression = exercises.find(
    (e) => e.id === exercise.progression_exercise_id
  );
  const regression = exercises.find(
    (e) => e.id === exercise.regression_exercise_id
  );

  return (
    <div>
      <div
        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-3 md:p-4 m-0"
        onClick={onClose}
      >
        <div
          className="bg-black border md:border-2 border-teal-400 p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-3xl md:text-4xl">
                {getCategoryIcon(exercise.category)}
              </span>
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-mono">
                  {exercise.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs md:text-sm text-gray-400 font-mono">
                    {getCategoryDisplayName(exercise.category)}
                  </span>
                  <span
                    className={`${difficultyColors[exercise.difficulty]} text-xs px-2 py-1 text-black font-mono`}
                  >
                    {exercise.difficulty}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl md:text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div className="mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
              Description
            </h3>
            <p className="text-sm md:text-base text-gray-300 font-sans">
              {exercise.description}
            </p>
          </div>

          {/* Form Cues */}
          {exercise.form_cues.length > 0 && (
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
                Form Cues
              </h3>
              <ul className="space-y-2">
                {exercise.form_cues.map((cue, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm md:text-base text-gray-300 font-sans"
                  >
                    <span className="text-teal-400 mt-1">•</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Default Sets/Reps */}
          <div className="mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
              Recommended Volume
            </h3>
            <p className="text-sm md:text-base text-gray-300 font-mono">
              {exercise.default_sets} sets ×{" "}
              {exercise.default_reps
                ? `${exercise.default_reps} reps`
                : exercise.default_duration_seconds
                  ? `${exercise.default_duration_seconds}s`
                  : ""}
            </p>
          </div>

          {/* Equipment */}
          <div className="mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
              Equipment
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map((equip) => (
                <span
                  key={equip}
                  className="bg-black border border-white text-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm font-mono"
                >
                  {equip.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Muscle Groups */}
          {(exercise.muscles_primary?.length > 0 ||
            exercise.muscles_secondary?.length > 0) && (
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
                Muscles Worked
              </h3>

              {/* Primary Muscles */}
              {exercise.muscles_primary &&
                exercise.muscles_primary.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-400 font-mono mb-2">
                      PRIMARY
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles_primary.map((muscle) => (
                        <span
                          key={muscle}
                          className="bg-black border border-white text-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm font-mono flex items-center gap-1"
                        >
                          <span>{getMuscleGroupIcon(muscle)}</span>
                          <span>{getMuscleGroupDisplayName(muscle)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Secondary Muscles */}
              {exercise.muscles_secondary &&
                exercise.muscles_secondary.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-2">
                      SECONDARY
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.muscles_secondary.map((muscle) => (
                        <span
                          key={muscle}
                          className="bg-black border border-white text-gray-300 px-2 md:px-3 py-1 text-xs md:text-sm font-mono flex items-center gap-1"
                        >
                          <span>{getMuscleGroupIcon(muscle)}</span>
                          <span>{getMuscleGroupDisplayName(muscle)}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}

          {/* Progressions */}
          {(regression || progression) && (
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-bold mb-2 text-teal-400 font-mono">
                Progression Path
              </h3>
              <div className="space-y-2">
                {regression && (
                  <button
                    onClick={() => onNavigate(regression)}
                    className="w-full bg-black border md:border-2 border-white hover:border-teal-400 p-3 text-left transition-all"
                  >
                    <p className="text-xs text-gray-400 mb-1 font-mono">
                      ← Easier
                    </p>
                    <p className="text-sm md:text-base text-white font-mono">
                      {regression.name}
                    </p>
                  </button>
                )}
                <div className="bg-teal-400 bg-opacity-20 border md:border-2 border-teal-400 p-3">
                  <p className="text-xs text-teal-400 mb-1 font-mono">
                    Current
                  </p>
                  <p className="text-sm md:text-base text-white font-mono font-bold">
                    {exercise.name}
                  </p>
                </div>
                {progression && (
                  <button
                    onClick={() => onNavigate(progression)}
                    className="w-full bg-black border md:border-2 border-white hover:border-teal-400 p-3 text-left transition-all"
                  >
                    <p className="text-xs text-gray-400 mb-1 font-mono">
                      Harder →
                    </p>
                    <p className="text-sm md:text-base text-white font-mono">
                      {progression.name}
                    </p>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
