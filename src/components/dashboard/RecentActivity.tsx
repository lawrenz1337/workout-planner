/** @format */

import { Link } from "react-router-dom";
import { EnhancedWorkout, formatVolume } from "../../types/enhanced-types";

interface RecentActivityProps {
  workouts: EnhancedWorkout[];
  onViewDetails?: (workoutId: string) => void;
}

export default function RecentActivity({
  workouts,
  onViewDetails,
}: RecentActivityProps) {
  const recentWorkouts = workouts
    .filter((w) => w.completed_at)
    .sort(
      (a, b) =>
        new Date(b.completed_at!).getTime() -
        new Date(a.completed_at!).getTime(),
    )
    .slice(0, 3);

  if (recentWorkouts.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-600 p-6 text-center">
        <p className="text-gray-400 font-mono mb-2">No workouts yet</p>
        <p className="text-sm text-gray-500 font-sans">
          Complete your first workout to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg md:text-xl font-mono font-bold">
          Recent Activity
        </h3>
        <Link
          to="/progress"
          className="text-xs md:text-sm text-teal-400 hover:text-teal-300 font-mono"
        >
          View All →
        </Link>
      </div>

      {recentWorkouts.map((workout) => (
        <button
          key={workout.id}
          onClick={() => onViewDetails?.(workout.id)}
          className="w-full border border-white hover:border-teal-400 p-3 md:p-4 text-left transition-all group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-mono font-bold text-white group-hover:text-teal-400 transition-colors text-sm md:text-base">
                {workout.name}
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {new Date(workout.completed_at!).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="bg-teal-400 text-black px-2 py-1 text-xs font-mono">
              {workout.type}
            </span>
          </div>

          <div className="flex gap-3 text-xs font-mono text-gray-400">
            <span>⏱️ {workout.duration_minutes}min</span>
            {workout.calories_burned && (
              <span>🔥 {workout.calories_burned}cal</span>
            )}
            {workout.total_volume > 0 && (
              <span>💪 {formatVolume(workout.total_volume)}</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
