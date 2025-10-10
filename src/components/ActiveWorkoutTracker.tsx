/** @format */

import { useState, useEffect } from "react";
import {
  GeneratedWorkout,
  GeneratedWorkoutExercise,
} from "../services/workoutGenerator";

interface ActiveWorkoutTrackerProps {
  workout: GeneratedWorkout;
  onComplete: () => void;
  onExit: () => void;
}

type WorkoutSection = "warmup" | "main" | "cooldown";

interface SetLog {
  completed: boolean;
  reps?: number;
  duration?: number;
}

export default function ActiveWorkoutTracker({
  workout,
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

  // Track completed sets for each exercise
  const [setLogs, setSetLogs] = useState<Record<string, SetLog[]>>({});

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

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteSet = () => {
    if (!currentExercise) return;

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

    // Check if all sets completed
    if (currentSet >= currentExercise.sets) {
      // Move to next exercise
      moveToNextExercise();
    } else {
      // Start rest timer
      setCurrentSet(currentSet + 1);
      setIsResting(true);
      setRestTimeRemaining(currentExercise.rest_seconds);
    }
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < currentExercises.length - 1) {
      // Next exercise in same section
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
        // Workout complete!
        onComplete();
      }
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setRestTimeRemaining(0);
  };

  const handleSkipExercise = () => {
    moveToNextExercise();
  };

  if (!currentExercise) {
    return (
      <div className="text-center py-12">
        <p className="text-2xl font-mono text-teal-400 mb-4">
          Workout Complete! 🎉
        </p>
        <button
          onClick={onComplete}
          className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-xl bg-black border-2 border-white cursor-pointer select-none"
        >
          Finish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-mono">
            {currentSection === "warmup"
              ? "🔥 Warmup"
              : currentSection === "main"
                ? "💪 Main Work"
                : "🧘 Cooldown"}
          </h2>
          <p className="text-sm text-gray-400 font-mono">
            Elapsed: {formatTime(elapsedTime)}
          </p>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 border-2 border-red-500 text-red-500 font-mono text-sm hover:bg-red-500 hover:text-black transition-colors"
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
        <div className="h-2 bg-gray-800 border-2 border-white">
          <div
            className="h-full bg-teal-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 font-mono text-center">
          Exercise {getCompletedExercises() + 1} of {getTotalExercises()}
        </div>
      </div>

      {/* Rest Timer (if resting) */}
      {isResting && (
        <div className="border-4 border-teal-400 p-8 text-center bg-black">
          <p className="text-xl font-mono text-teal-400 mb-4">Rest Time</p>
          <p className="text-6xl font-mono text-white mb-6">
            {formatTime(restTimeRemaining)}
          </p>
          <button
            onClick={handleSkipRest}
            className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none"
          >
            Skip Rest
          </button>
        </div>
      )}

      {/* Current Exercise (if not resting) */}
      {!isResting && (
        <div className="border-2 border-teal-400 p-6">
          <div className="mb-4">
            <h3 className="text-3xl font-mono font-bold text-white mb-2">
              {currentExercise.exercise.name}
            </h3>
            <p className="text-sm text-gray-400 font-sans">
              {currentExercise.exercise.description}
            </p>
          </div>

          {/* Target */}
          <div className="mb-6 p-4 bg-black border-2 border-white">
            <p className="text-lg font-mono text-teal-400 mb-2">
              Set {currentSet} of {currentExercise.sets}
            </p>
            <p className="text-4xl font-mono text-white">
              {currentExercise.target_reps
                ? `${currentExercise.target_reps} reps`
                : `${currentExercise.target_duration_seconds}s`}
            </p>
          </div>

          {/* Form Cues */}
          {currentExercise.exercise.form_cues.length > 0 && (
            <div className="mb-6">
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

          {/* Set Indicators */}
          <div className="flex gap-2 mb-6">
            {Array.from({ length: currentExercise.sets }).map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-3 border-2 ${
                  index < currentSet - 1
                    ? "bg-teal-400 border-teal-400"
                    : index === currentSet - 1
                      ? "bg-white border-white animate-pulse"
                      : "bg-black border-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleCompleteSet}
              className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-4 px-6 text-white font-mono text-xl bg-black border-2 border-teal-400 cursor-pointer select-none"
            >
              ✓ Complete Set
            </button>
            <button
              onClick={handleSkipExercise}
              className="px-6 py-4 border-2 border-white text-white font-mono text-sm hover:bg-gray-800 transition-colors"
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
          className="px-6 py-2 border-2 border-white text-white font-mono text-sm hover:bg-gray-800 transition-colors"
        >
          {isPaused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
    </div>
  );
}
