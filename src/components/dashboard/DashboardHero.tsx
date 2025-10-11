/** @format */

import { EnhancedWorkout, calculateStreak } from "../../types/enhanced-types";
import {
  getThisWeekWorkouts,
  getLastWeekWorkouts,
  getTotalMinutes,
} from "../../utils/dateUtils";

interface DashboardHeroProps {
  workouts: EnhancedWorkout[];
}

export default function DashboardHero({ workouts }: DashboardHeroProps) {
  const streak = calculateStreak(workouts);

  const thisWeekWorkouts = getThisWeekWorkouts(workouts);
  const lastWeekWorkouts = getLastWeekWorkouts(workouts);

  const thisWeekMinutes = getTotalMinutes(thisWeekWorkouts);
  const lastWeekMinutes = getTotalMinutes(lastWeekWorkouts);
  const minutesDiff = thisWeekMinutes - lastWeekMinutes;

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "";
    if (streak < 3) return "🔥";
    if (streak < 7) return "🔥🔥";
    if (streak < 14) return "🔥🔥🔥";
    return "🔥🔥🔥💪";
  };

  return (
    <div className="border-2 border-teal-400 p-4 md:p-6 bg-gradient-to-br from-teal-400/5 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-mono font-bold text-teal-400">
              {streak.current_streak} Day Streak
            </h2>
            <span className="text-2xl md:text-3xl">
              {getStreakEmoji(streak.current_streak)}
            </span>
          </div>
          <p className="text-sm text-gray-400 font-mono">
            Longest: {streak.longest_streak} days
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">This Week</p>
          <p className="text-xl md:text-2xl font-mono text-white">
            {thisWeekWorkouts.length}
          </p>
          <p className="text-xs text-gray-500 font-sans">workouts</p>
        </div>

        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">Minutes</p>
          <p className="text-xl md:text-2xl font-mono text-white">
            {thisWeekMinutes}
          </p>
          <p className="text-xs text-gray-500 font-sans">this week</p>
        </div>

        <div className="border border-white p-3 col-span-2 md:col-span-1">
          <p className="text-xs text-gray-400 font-mono mb-1">vs Last Week</p>
          <p
            className={`text-xl md:text-2xl font-mono ${minutesDiff >= 0 ? "text-teal-400" : "text-red-400"}`}
          >
            {minutesDiff >= 0 ? "+" : ""}
            {minutesDiff}m
          </p>
          <p className="text-xs text-gray-500 font-sans">
            {minutesDiff >= 0 ? "📈 Keep it up!" : "📉 You got this"}
          </p>
        </div>
      </div>
    </div>
  );
}
