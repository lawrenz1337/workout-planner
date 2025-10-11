/** @format */

import { EnhancedWorkout } from "../../types/enhanced-types";
import {
  getThisMonthWorkouts,
  getThisWeekWorkouts,
  getTotalMinutes,
  getTotalVolume,
} from "../../utils/dateUtils";

interface QuickStatsProps {
  workouts: EnhancedWorkout[];
}

export default function QuickStats({ workouts }: QuickStatsProps) {
  const thisMonthWorkouts = getThisMonthWorkouts(workouts);
  const thisWeekWorkouts = getThisWeekWorkouts(workouts);

  const totalMinutesThisMonth = getTotalMinutes(thisMonthWorkouts);
  const totalVolumeThisWeek = getTotalVolume(thisWeekWorkouts);

  // Find favorite category (most trained this month)
  const categoryCount: Record<string, number> = {};
  thisMonthWorkouts.forEach((w) => {
    const type = w.type;
    categoryCount[type] = (categoryCount[type] || 0) + 1;
  });

  const favoriteType =
    Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "home";

  return (
    <div className="space-y-3">
      <h3 className="text-lg md:text-xl font-mono font-bold mb-3">
        Quick Stats
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">This Month</p>
          <p className="text-2xl md:text-3xl font-mono text-teal-400">
            {thisMonthWorkouts.length}
          </p>
          <p className="text-xs text-gray-500 font-sans">workouts</p>
        </div>

        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">Time Trained</p>
          <p className="text-2xl md:text-3xl font-mono text-teal-400">
            {Math.round(totalMinutesThisMonth / 60)}
          </p>
          <p className="text-xs text-gray-500 font-sans">hours this month</p>
        </div>

        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">Weekly Volume</p>
          <p className="text-2xl md:text-3xl font-mono text-teal-400">
            {totalVolumeThisWeek > 0
              ? Math.round(totalVolumeThisWeek / 1000)
              : 0}
            k
          </p>
          <p className="text-xs text-gray-500 font-sans">kg this week</p>
        </div>

        <div className="border border-white p-3">
          <p className="text-xs text-gray-400 font-mono mb-1">Favorite</p>
          <p className="text-2xl md:text-3xl font-mono text-teal-400">
            {favoriteType === "home" ? "🏠" : "🏋️"}
          </p>
          <p className="text-xs text-gray-500 font-sans capitalize">
            {favoriteType} workouts
          </p>
        </div>
      </div>
    </div>
  );
}
