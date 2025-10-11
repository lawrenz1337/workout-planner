/** @format */

import { EnhancedWorkout } from "../../types/enhanced-types";

interface WorkoutCalendarProps {
  workouts: EnhancedWorkout[];
}

export default function WorkoutCalendar({ workouts }: WorkoutCalendarProps) {
  // Get last 28 days (4 weeks)
  const days: Date[] = [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  // Map workouts to dates
  const workoutsByDate = new Map<string, EnhancedWorkout>();
  workouts
    .filter((w) => w.completed_at)
    .forEach((workout) => {
      const date = new Date(workout.completed_at!);
      const dateKey = date.toISOString().split("T")[0];
      // Only keep one workout per day (the first one encountered)
      if (!workoutsByDate.has(dateKey)) {
        workoutsByDate.set(dateKey, workout);
      }
    });

  const getWorkoutTypeIcon = (type: string) => {
    if (type === "home") return "🏠";
    if (type === "gym") return "🏋️";
    return "💪"; // fallback
  };

  const getWorkoutTypeColor = (type: string) => {
    if (type === "home") return "bg-blue-500 border-blue-400";
    if (type === "gym") return "bg-purple-500 border-purple-400";
    return "bg-teal-500 border-teal-400"; // fallback
  };

  const getDayLabel = (date: Date) => {
    const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
    return dayNames[date.getDay()];
  };

  const isToday = (date: Date) => {
    const todayStr = today.toISOString().split("T")[0];
    const dateStr = date.toISOString().split("T")[0];
    return todayStr === dateStr;
  };

  // Calculate current streak
  const calculateCurrentStreak = () => {
    let streak = 0;
    const sortedDays = [...days].reverse();

    for (const day of sortedDays) {
      const dateKey = day.toISOString().split("T")[0];
      if (workoutsByDate.has(dateKey)) {
        streak++;
      } else {
        // Stop counting if we hit a rest day (unless it's today)
        if (!isToday(day)) break;
      }
    }
    return streak;
  };

  const currentStreak = calculateCurrentStreak();
  const completedDays = workoutsByDate.size;

  // Group days into weeks for better layout
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-mono font-bold">Last 28 Days</h3>
        <div className="text-sm font-mono text-gray-400">
          {completedDays}/{days.length} days
        </div>
      </div>

      <div className="border border-white p-4">
        {/* Day labels */}
        <div className="flex gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs text-gray-400 font-mono"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((date, dayIndex) => {
                const dateKey = date.toISOString().split("T")[0];
                const workout = workoutsByDate.get(dateKey);
                const hasWorkout = !!workout;
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={dayIndex}
                    className={`
                      flex-1 aspect-square border-2
                      ${
                        hasWorkout
                          ? getWorkoutTypeColor(workout.type)
                          : isTodayDate
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gray-800 border-gray-700"
                      }
                      ${hasWorkout ? "hover:scale-110" : ""}
                      ${isTodayDate && !hasWorkout ? "border-dashed" : ""}
                      transition-all cursor-pointer relative group
                      flex items-center justify-center
                    `}
                    title={
                      hasWorkout
                        ? `${workout.name} (${workout.duration_minutes}min)`
                        : isTodayDate
                          ? "Today - No workout yet"
                          : "Rest day"
                    }
                  >
                    {/* Workout type icon */}
                    {hasWorkout && (
                      <span className="text-xs md:text-sm">
                        {getWorkoutTypeIcon(workout.type)}
                      </span>
                    )}

                    {/* Today indicator */}
                    {isTodayDate && !hasWorkout && (
                      <div className="w-1 h-1 rounded-full bg-teal-400" />
                    )}

                    {/* Tooltip on hover */}
                    {hasWorkout && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 whitespace-nowrap">
                        <div className="bg-black border border-teal-400 px-2 py-1 text-xs font-mono">
                          <div className="font-bold text-white">
                            {workout.name}
                          </div>
                          <div className="text-gray-400">
                            {date.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-teal-400">
                            {workout.duration_minutes}min •{" "}
                            {workout.type === "home" ? "Home" : "Gym"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend and stats */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400 font-mono">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 border border-blue-400" />
              <span>Home</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 border border-purple-400" />
              <span>Gym</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-800 border border-gray-700" />
              <span>Rest</span>
            </div>
          </div>
          {currentStreak > 0 && (
            <div className="text-teal-400">🔥 {currentStreak} day streak</div>
          )}
        </div>
      </div>
    </div>
  );
}
