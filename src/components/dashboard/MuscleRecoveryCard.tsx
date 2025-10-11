/** @format */

import {
  EnhancedWorkout,
  getMuscleGroupDisplayName,
  getMuscleGroupIcon,
} from "../../types/enhanced-types";
import {
  calculateMuscleRecovery,
  getRecoveryMessage,
  MuscleRecoveryStatus,
} from "../../utils/muscleRecovery";

interface MuscleRecoveryCardProps {
  workouts: EnhancedWorkout[];
}

export default function MuscleRecoveryCard({
  workouts,
}: MuscleRecoveryCardProps) {
  const completedWorkouts = workouts.filter((w) => w.completed_at);

  // Don't show if no workouts yet
  if (completedWorkouts.length === 0) {
    return null;
  }

  const recoveryStatus = calculateMuscleRecovery(workouts);

  // Group muscles by category for better display
  const upperBody = recoveryStatus.filter((s) =>
    ["chest", "shoulders", "triceps", "lats", "upper_back", "biceps"].includes(
      s.muscle
    )
  );

  const lowerBody = recoveryStatus.filter((s) =>
    ["quads", "hamstrings", "glutes", "calves", "legs"].includes(s.muscle)
  );

  const core = recoveryStatus.filter((s) =>
    ["abs", "obliques", "core"].includes(s.muscle)
  );

  const recovered = recoveryStatus.filter((s) => s.isRecovered).length;
  const total = recoveryStatus.length;

  return (
    <div className="border-2 border-white p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-mono font-bold text-white">
            💪 Muscle Recovery
          </h3>
          <p className="text-xs text-gray-400 font-mono mt-1">
            {recovered}/{total} muscle groups ready
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl md:text-3xl font-mono text-teal-400">
            {Math.round((recovered / total) * 100)}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Upper Body */}
        <MuscleGroupSection title="Upper Body" muscles={upperBody} />

        {/* Lower Body */}
        <MuscleGroupSection title="Lower Body" muscles={lowerBody} />

        {/* Core */}
        <MuscleGroupSection title="Core" muscles={core} />
      </div>
    </div>
  );
}

interface MuscleGroupSectionProps {
  title: string;
  muscles: MuscleRecoveryStatus[];
}

function MuscleGroupSection({ title, muscles }: MuscleGroupSectionProps) {
  // Don't render section if no muscles in this category
  if (muscles.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs text-gray-400 font-mono mb-2">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {muscles.map((status) => {
          const isRecovered = status.isRecovered;
          const percentRecovered = status.percentRecovered;

          return (
            <div
              key={status.muscle}
              className={`
                border p-2 transition-all
                ${
                  isRecovered
                    ? "border-teal-400 bg-teal-400/10"
                    : percentRecovered > 75
                      ? "border-yellow-400 bg-yellow-400/5"
                      : "border-gray-600 bg-gray-800/50"
                }
              `}
              title={getRecoveryMessage(status)}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">
                  {getMuscleGroupIcon(status.muscle)}
                </span>
                <span className="text-xs font-mono text-white truncate flex-1">
                  {getMuscleGroupDisplayName(status.muscle)}
                </span>
              </div>

              {/* Recovery bar */}
              <div className="h-1 bg-gray-700 w-full">
                <div
                  className={`h-full transition-all ${
                    isRecovered ? "bg-teal-400" : "bg-yellow-400"
                  }`}
                  style={{ width: `${Math.min(100, percentRecovered)}%` }}
                />
              </div>

              <p
                className={`text-xs font-mono mt-1 ${
                  isRecovered ? "text-teal-400" : "text-gray-400"
                }`}
              >
                {isRecovered ? "Ready" : `${status.hoursUntilRecovered}h`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
