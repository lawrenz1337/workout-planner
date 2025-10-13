/** @format */

import { useState, useEffect } from "react";
import {
  GeneratedWorkout,
  GeneratedWorkoutExercise,
  WorkoutSection,
  SetLog,
} from "../types/workout-service";
import {
  saveWorkout,
  logWorkoutSet,
  completeWorkout,
} from "../services/workoutService";
import { PersonalRecord } from "../types/enhanced-types";
import { formatTime } from "../utils/time-formatter";

interface ActiveWorkoutTrackerProps {
  workout: GeneratedWorkout;
  userId: string;
  userWeightKg?: number;
  onComplete: () => void;
  onExit: () => void;
}

export default function ActiveWorkoutTracker({
  workout,
  userId,
  userWeightKg,
  onComplete,
  onExit,
}: ActiveWorkoutTrackerProps) {
  const [currentSection, setCurrentSection] =
    useState<WorkoutSection>("warmup");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [workoutStartTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);

  // Track workout ID and exercise IDs after saving
  const [workoutId, setWorkoutId] = useState<string | null>(null);
  const [workoutExerciseIds, setWorkoutExerciseIds] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  // Completion state
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionData, setCompletionData] = useState<{
    newPRs: PersonalRecord[];
    totalVolume: number;
    caloriesBurned: number;
  } | null>(null);

  // Track completed sets for each exercise
  const [setLogs, setSetLogs] = useState<Record<string, SetLog[]>>({});

  // Save workout to database on mount
  useEffect(() => {
    const initWorkout = async () => {
      if (workoutId) return;

      setIsSaving(true);
      try {
        const result = await saveWorkout({
          userId,
          generatedWorkout: workout,
          userWeightKg,
        });
        setWorkoutId(result.workoutId);
        setWorkoutExerciseIds(result.workoutExerciseIds);
      } catch (error) {
        console.error("Failed to save workout:", error);
        alert("Failed to save workout. Progress may not be tracked.");
      } finally {
        setIsSaving(false);
      }
    };

    initWorkout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get current exercises based on section
  const getCurrentExercises = (): GeneratedWorkoutExercise[] => {
    switch (currentSection) {
      case "warmup":
        return workout.warmup;
      case "main":
        return workout.main_work;
      case "cooldown":
        return workout.cooldown;
    }
  };

  const currentExercises = getCurrentExercises();
  const currentExercise = currentExercises[currentExerciseIndex];

  // Calculate progress
  const getTotalExercises = () => {
    return (
      workout.warmup.length + workout.main_work.length + workout.cooldown.length
    );
  };

  const getCompletedExercises = () => {
    let completed = 0;
    if (currentSection === "main" || currentSection === "cooldown") {
      completed += workout.warmup.length;
    }
    if (currentSection === "cooldown") {
      completed += workout.main_work.length;
    }
    completed += currentExerciseIndex;
    return completed;
  };

  const progressPercentage =
    (getCompletedExercises() / getTotalExercises()) * 100;

  // Elapsed time timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, workoutStartTime]);

  // Rest timer
  useEffect(() => {
    if (!isResting || isPaused || restTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setRestTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, isPaused, restTimeRemaining]);

  const handleCompleteSet = async () => {
    if (!currentExercise || !workoutId) return;

    const key = `${currentSection}-${currentExerciseIndex}`;
    const exerciseLogs = setLogs[key] || [];

    // Mark current set as completed
    const updatedLogs = [...exerciseLogs];
    updatedLogs[currentSet - 1] = {
      completed: true,
      reps: currentExercise.target_reps,
      duration: currentExercise.target_duration_seconds,
    };

    setSetLogs({ ...setLogs, [key]: updatedLogs });

    // Log to database
    const workoutExerciseId =
      workoutExerciseIds[currentExercise.order_index.toString()];

    if (workoutExerciseId) {
      try {
        await logWorkoutSet({
          workoutExerciseId,
          setNumber: currentSet,
          repsCompleted: currentExercise.target_reps,
          durationSeconds: currentExercise.target_duration_seconds,
          difficultyRating: 3, // Could add UI for this later
        });
      } catch (error) {
        console.error("Failed to log set:", error);
      }
    }

    // Check if all sets completed
    if (currentSet >= currentExercise.sets) {
      moveToNextExercise();
    } else {
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTimeRemaining(currentExercise.rest_seconds);
    }
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < currentExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      // Move to next section
      if (currentSection === "warmup" && workout.main_work.length > 0) {
        setCurrentSection("main");
        setCurrentExerciseIndex(0);
        setCurrentSet(1);
        setIsResting(false);
      } else if (currentSection === "main" && workout.cooldown.length > 0) {
        setCurrentSection("cooldown");
        setCurrentExerciseIndex(0);
        setCurrentSet(1);
        setIsResting(false);
      } else {
        handleWorkoutComplete();
      }
    }
  };

  const handleWorkoutComplete = async () => {
    if (!workoutId) {
      onComplete();
      return;
    }

    setIsCompleting(true);
    try {
      const result = await completeWorkout({
        workoutId,
        userId,
      });

      setCompletionData({
        newPRs: result.new_personal_records,
        totalVolume: result.total_volume,
        caloriesBurned: result.calories_burned,
      });
    } catch (error) {
      console.error("Failed to complete workout:", error);
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const handleSkipExercise = () => {
    moveToNextExercise();
  };

  // Show completion modal with PRs
  if (completionData) {
    return (
      <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto text-center">
        <div className="border-2 md:border-4 border-teal-400 p-4 md:p-8 bg-black">
          <h2 className="text-3xl md:text-4xl font-mono font-bold text-teal-400 mb-4 md:mb-6">
            Workout Complete! 🎉
          </h2>

          <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="border md:border-2 border-white p-3 md:p-4">
              <p className="text-xs text-gray-400 font-mono">Time</p>
              <p className="text-2xl md:text-3xl font-mono text-white">
                {formatTime(elapsedTime)}
              </p>
            </div>
            <div className="border md:border-2 border-white p-3 md:p-4">
              <p className="text-xs text-gray-400 font-mono">Calories</p>
              <p className="text-2xl md:text-3xl font-mono text-teal-400">
                {completionData.caloriesBurned}
              </p>
            </div>
          </div>

          {completionData.totalVolume > 0 && (
            <div className="border md:border-2 border-white p-3 md:p-4 mb-4 md:mb-6">
              <p className="text-xs text-gray-400 font-mono">Total Volume</p>
              <p className="text-2xl md:text-3xl font-mono text-white">
                {completionData.totalVolume} kg
              </p>
            </div>
          )}

          {completionData.newPRs.length > 0 && (
            <div className="border-2 md:border-4 border-yellow-400 p-4 md:p-6 mb-4 md:mb-6 bg-yellow-400/10">
              <p className="text-xl md:text-2xl font-mono font-bold text-yellow-400 mb-3 md:mb-4">
                🏆 New Personal Records!
              </p>
              <div className="space-y-2">
                {completionData.newPRs.map((pr) => {
                  // Handle both 'exercise' and 'exercises' properties (Supabase returns 'exercises')
                  const exercise = pr.exercise || pr.exercises;

                  return (
                    <div
                      key={pr.id}
                      className="text-left border md:border-2 border-yellow-400 p-2 md:p-3"
                    >
                      <p className="font-mono text-white font-bold text-sm md:text-base">
                        {exercise?.name || "Unknown Exercise"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-300 font-sans">
                        {pr.record_type.replace("_", " ")}: {pr.value}
                        {pr.record_type === "max_weight" ? " kg" : ""}
                        {pr.record_type === "max_duration" ? "s" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onComplete}
            className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-lg md:text-xl bg-black border-2 border-white cursor-pointer select-none"
          >
            Finish
          </button>
        </div>
      </div>
    );
  }

  if (!currentExercise) {
    return (
      <div className="text-center py-12">
        <p className="text-xl md:text-2xl font-mono text-teal-400 mb-4">
          {isCompleting ? "Saving workout..." : "Workout Complete! 🎉"}
        </p>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="text-center py-12">
        <p className="text-xl md:text-2xl font-mono text-teal-400">
          Starting workout...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-mono">
            {currentSection === "warmup"
              ? "🔥 Warmup"
              : currentSection === "main"
                ? "💪 Main Work"
                : "🧘 Cooldown"}
          </h2>
          <p className="text-2xl md:text-3xl font-mono text-teal-400 mt-1">
            {formatTime(elapsedTime)}
          </p>
        </div>
        <button
          onClick={onExit}
          className="px-4 md:px-6 py-2 md:py-3 bg-transparent hover:bg-red-900/30 text-red-500 font-bold rounded-none transition-all border md:border-2 border-red-500 hover:border-red-400 font-mono text-sm md:text-base"
        >
          Exit
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-2 bg-gray-800 border md:border-2 border-white">
          <div
            className="h-full bg-teal-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 font-mono text-center">
          Exercise {getCompletedExercises() + 1} of {getTotalExercises()}
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="border-2 md:border-4 border-teal-400 p-4 md:p-8 text-center bg-black">
          <p className="text-lg md:text-xl font-mono text-teal-400 mb-3 md:mb-4">
            Rest Time
          </p>
          <p className="text-5xl md:text-6xl font-mono text-white mb-4 md:mb-6">
            {formatTime(restTimeRemaining)}
          </p>
          <button
            onClick={handleSkipRest}
            className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
          >
            Skip Rest
          </button>
        </div>
      )}

      {/* Current Exercise */}
      {!isResting && (
        <div className="border md:border-2 border-teal-400 p-3 md:p-6">
          <div className="mb-3 md:mb-4">
            <h3 className="text-2xl md:text-3xl font-mono font-bold text-white mb-2">
              {currentExercise.exercise.name}
            </h3>
            <p className="text-sm text-gray-400 font-sans">
              {currentExercise.exercise.description}
            </p>
          </div>

          {/* Target */}
          <div className="mb-4 md:mb-6 p-3 md:p-4 bg-black border md:border-2 border-white">
            <p className="text-base md:text-lg font-mono text-teal-400 mb-2">
              Set {currentSet} of {currentExercise.sets}
            </p>
            <p className="text-3xl md:text-4xl font-mono text-white">
              {currentExercise.target_reps
                ? `${currentExercise.target_reps} reps`
                : `${currentExercise.target_duration_seconds}s`}
            </p>
          </div>

          {/* Form Cues */}
          {currentExercise.exercise.form_cues.length > 0 && (
            <div className="mb-4 md:mb-6">
              <p className="text-sm font-mono text-gray-400 mb-2">Form Cues:</p>
              <ul className="space-y-1">
                {currentExercise.exercise.form_cues
                  .slice(0, 3)
                  .map((cue, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-300 font-sans flex items-start gap-2"
                    >
                      <span className="text-teal-400">•</span>
                      <span>{cue}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Section Indicators */}
          <div className="mb-4 md:mb-6 space-y-2">
            <p className="text-xs font-mono text-gray-400">Workout Progress:</p>
            <div className="flex gap-1 md:gap-2">
              <div className="flex-1 space-y-1">
                <p className="text-xs font-mono text-gray-400">🔥 Warmup</p>
                <div
                  className={`h-2 md:h-3 border md:border-2 transition-all ${
                    currentSection === "warmup"
                      ? "bg-teal-400 border-teal-400 animate-pulse"
                      : getCompletedExercises() >= workout.warmup.length
                        ? "bg-teal-400 border-teal-400"
                        : "bg-black border-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-mono text-gray-400">💪 Main</p>
                <div
                  className={`h-2 md:h-3 border md:border-2 transition-all ${
                    currentSection === "main"
                      ? "bg-teal-400 border-teal-400 animate-pulse"
                      : getCompletedExercises() >=
                          workout.warmup.length + workout.main_work.length
                        ? "bg-teal-400 border-teal-400"
                        : getCompletedExercises() > workout.warmup.length
                          ? "bg-teal-400/50 border-teal-400"
                          : "bg-black border-gray-600"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-xs font-mono text-gray-400">🧘 Cooldown</p>
                <div
                  className={`h-2 md:h-3 border md:border-2 transition-all ${
                    currentSection === "cooldown"
                      ? "bg-teal-400 border-teal-400 animate-pulse"
                      : "bg-black border-gray-600"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Set Indicators */}
          <div className="mb-4 md:mb-6">
            <p className="text-xs font-mono text-gray-400 mb-2">
              Current Exercise Sets:
            </p>
            <div className="flex gap-1 md:gap-2">
              {Array.from({ length: currentExercise.sets }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 md:h-3 border md:border-2 ${
                    index < currentSet - 1
                      ? "bg-teal-400 border-teal-400"
                      : index === currentSet - 1
                        ? "bg-white border-white animate-pulse"
                        : "bg-black border-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 md:gap-4">
            <button
              onClick={handleCompleteSet}
              className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-800 text-white font-mono text-sm transition-colors border md:border-2 border-teal-400 hover:border-gray-500"
            >
              ✓ Complete Set
            </button>
            <button
              onClick={handleSkipExercise}
              className="px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-gray-800 text-white font-mono text-sm transition-colors border md:border-2 border-white hover:border-gray-500"
            >
              Skip →
            </button>
          </div>
        </div>
      )}

      {/* Pause Button */}
      <div className="text-center">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="px-4 md:px-6 py-2 bg-transparent hover:bg-gray-800 text-white font-mono text-sm transition-colors border md:border-2 border-white hover:border-gray-500"
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
