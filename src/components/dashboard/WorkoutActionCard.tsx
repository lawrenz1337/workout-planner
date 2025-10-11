/** @format */

import { Link } from "react-router-dom";
import { EnhancedWorkout } from "../../types/enhanced-types";
import {
  getTodayWorkouts,
  getLastWorkout,
  getDaysSince,
} from "../../utils/dateUtils";

interface WorkoutActionCardProps {
  workouts: EnhancedWorkout[];
}

export default function WorkoutActionCard({
  workouts,
}: WorkoutActionCardProps) {
  const todayWorkout = getTodayWorkouts(workouts)[0];
  const lastWorkout = getLastWorkout(workouts);

  const getSuggestedWorkout = () => {
    if (!lastWorkout) return "Get started with your first workout";

    const lastType = lastWorkout.type;
    const daysSinceLastWorkout = getDaysSince(lastWorkout.completed_at!);

    if (daysSinceLastWorkout >= 2) {
      return "Welcome back! Ready to get moving again?";
    }

    // Suggest based on last workout type
    if (lastType === "home") {
      return "Upper body recovered - time for push/pull work";
    }
    return "Lower body and core session recommended";
  };

  if (todayWorkout) {
    return (
      <div className="border-2 border-teal-400 p-4 md:p-6 bg-teal-400/5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl md:text-2xl font-mono font-bold text-teal-400 mb-2">
              🎉 Great Work Today!
            </h3>
            <p className="text-sm text-gray-300 font-sans">
              You completed{" "}
              <span className="text-white font-mono">{todayWorkout.name}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3 text-xs md:text-sm font-mono text-gray-400 mb-4">
          <span>⏱️ {todayWorkout.duration_minutes}min</span>
          {todayWorkout.calories_burned && (
            <span>🔥 {todayWorkout.calories_burned}cal</span>
          )}
          {todayWorkout.total_volume > 0 && (
            <span>💪 {todayWorkout.total_volume}kg</span>
          )}
        </div>

        <Link
          to="/progress"
          className="inline-block px-4 py-2 bg-black border border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-colors font-mono text-sm"
        >
          View Stats →
        </Link>
      </div>
    );
  }

  return (
    <div className="border-2 border-white p-4 md:p-6">
      <h3 className="text-xl md:text-2xl font-mono font-bold text-white mb-2">
        Ready for Today's Workout?
      </h3>
      <p className="text-sm text-gray-400 font-sans mb-4">
        {getSuggestedWorkout()}
      </p>

      <Link
        to="/workouts/new"
        className="inline-block w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 md:py-3 px-4 md:px-6 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
      >
        🏃 Start Workout
      </Link>
    </div>
  );
}
