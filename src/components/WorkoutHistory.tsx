/** @format */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import {
  PersonalRecord,
  calculateStreak,
  formatVolume,
} from "../types/enhanced-types";
import {
  WorkoutExerciseWithLogs,
  WorkoutDetails,
  EnhancedWorkoutLog,
} from "../types/workout-service";
import {
  getWorkoutHistory,
  getWorkoutDetails,
} from "../services/workoutService";

interface WorkoutHistoryProps {
  userId: string;
}

export default function WorkoutHistory({ userId }: WorkoutHistoryProps) {
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(
    null,
  );
  const [showPRs, setShowPRs] = useState(false);

  // Fetch workout history
  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ["workout_history", userId],
    queryFn: async () => {
      return await getWorkoutHistory(userId, { limit: 50 });
    },
  });

  // Fetch personal records
  const { data: personalRecords, isLoading: prsLoading } = useQuery({
    queryKey: ["personal_records", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personal_records")
        .select("*, exercises(*)")
        .eq("user_id", userId)
        .order("achieved_at", { ascending: false });

      if (error) throw error;
      return data as PersonalRecord[];
    },
  });

  // Fetch workout details when one is selected
  const { data: workoutDetails } = useQuery({
    queryKey: ["workout_details", selectedWorkoutId],
    queryFn: async () => {
      if (!selectedWorkoutId) return null;
      const details = await getWorkoutDetails(selectedWorkoutId);
      return details as WorkoutDetails | null;
    },
    enabled: !!selectedWorkoutId,
  });

  // Calculate stats
  const stats = workouts
    ? {
        totalWorkouts: workouts.length,
        totalVolume: workouts.reduce(
          (sum, w) => sum + (w.total_volume || 0),
          0,
        ),
        totalCalories: workouts.reduce(
          (sum, w) => sum + (w.calories_burned || 0),
          0,
        ),
        totalMinutes: workouts.reduce((sum, w) => sum + w.duration_minutes, 0),
        streak: calculateStreak(workouts),
      }
    : null;

  if (workoutsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">
          Loading workouts...
        </div>
      </div>
    );
  }

  // Show workout details modal
  if (selectedWorkoutId && workoutDetails) {
    return (
      <WorkoutDetailsModal
        workout={workoutDetails}
        onClose={() => setSelectedWorkoutId(null)}
      />
    );
  }

  // Show personal records view
  if (showPRs) {
    return (
      <PersonalRecordsView
        personalRecords={personalRecords || []}
        loading={prsLoading}
        onBack={() => setShowPRs(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
            Workout History
          </h2>
          <p className="text-gray-400 font-sans">
            Track your progress and view past workouts
          </p>
        </div>
        <button
          onClick={() => setShowPRs(true)}
          className="px-4 py-2 bg-transparent hover:bg-gray-800 text-yellow-400 font-mono text-sm transition-colors border-2 border-yellow-400 hover:border-yellow-300"
        >
          🏆 View PRs
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-white p-4">
            <p className="text-xs text-gray-400 font-mono mb-1">
              Total Workouts
            </p>
            <p className="text-3xl font-mono text-teal-400">
              {stats.totalWorkouts}
            </p>
          </div>
          <div className="border-2 border-white p-4">
            <p className="text-xs text-gray-400 font-mono mb-1">
              Current Streak
            </p>
            <p className="text-3xl font-mono text-teal-400">
              {stats.streak.current_streak}
              <span className="text-base ml-1">days</span>
            </p>
          </div>
          <div className="border-2 border-white p-4">
            <p className="text-xs text-gray-400 font-mono mb-1">
              Total Calories
            </p>
            <p className="text-3xl font-mono text-teal-400">
              {stats.totalCalories.toLocaleString()}
            </p>
          </div>
          <div className="border-2 border-white p-4">
            <p className="text-xs text-gray-400 font-mono mb-1">Total Time</p>
            <p className="text-3xl font-mono text-teal-400">
              {Math.round(stats.totalMinutes / 60)}
              <span className="text-base ml-1">hrs</span>
            </p>
          </div>
        </div>
      )}

      {/* Recent PRs */}
      {personalRecords && personalRecords.length > 0 && (
        <div className="border-2 border-yellow-400 p-4 bg-yellow-400/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold font-mono text-yellow-400">
              🏆 Recent Personal Records
            </h3>
            <button
              onClick={() => setShowPRs(true)}
              className="text-xs text-yellow-400 hover:text-yellow-300 font-mono"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {personalRecords.slice(0, 3).map((pr) => (
              <div
                key={pr.id}
                className="flex items-center justify-between border-b border-yellow-400/30 pb-2"
              >
                <div>
                  <p className="font-mono text-white text-sm">
                    {pr.exercise?.name}
                  </p>
                  <p className="text-xs text-gray-400 font-sans">
                    {new Date(pr.achieved_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-yellow-400 font-bold">
                    {pr.value}
                    {pr.record_type === "max_weight" && " kg"}
                    {pr.record_type === "max_duration" && "s"}
                    {pr.record_type === "max_reps" && " reps"}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {pr.record_type.replace("_", " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout List */}
      <div>
        <h3 className="text-lg font-bold mb-3 font-mono">Recent Workouts</h3>
        {!workouts || workouts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-600">
            <p className="text-xl font-mono text-gray-400 mb-2">
              No workouts yet
            </p>
            <p className="text-sm text-gray-500 font-sans">
              Complete your first workout to see it here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <button
                key={workout.id}
                onClick={() => setSelectedWorkoutId(workout.id)}
                className="w-full border-2 border-white hover:border-teal-400 p-4 text-left transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-mono font-bold text-white group-hover:text-teal-400 transition-colors">
                      {workout.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      {new Date(
                        workout.completed_at || workout.date,
                      ).toLocaleDateString("en-US", {
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

                <div className="flex gap-4 text-sm font-mono text-gray-400">
                  <span>⏱️ {workout.duration_minutes} min</span>
                  {workout.calories_burned && (
                    <span>🔥 {workout.calories_burned} cal</span>
                  )}
                  {workout.total_volume > 0 && (
                    <span>💪 {formatVolume(workout.total_volume)}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Workout Details Modal
interface WorkoutDetailsModalProps {
  workout: WorkoutDetails;
  onClose: () => void;
}

function WorkoutDetailsModal({ workout, onClose }: WorkoutDetailsModalProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono">
            {workout.name}
          </h2>
          <p className="text-gray-400 font-sans">
            {new Date(workout.completed_at || workout.date).toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            )}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Workout Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border-2 border-white p-3">
          <p className="text-xs text-gray-400 font-mono">Duration</p>
          <p className="text-2xl font-mono text-white">
            {workout.duration_minutes} min
          </p>
        </div>
        {workout.calories_burned && (
          <div className="border-2 border-white p-3">
            <p className="text-xs text-gray-400 font-mono">Calories</p>
            <p className="text-2xl font-mono text-teal-400">
              {workout.calories_burned}
            </p>
          </div>
        )}
        {workout.total_volume > 0 && (
          <div className="border-2 border-white p-3">
            <p className="text-xs text-gray-400 font-mono">Volume</p>
            <p className="text-2xl font-mono text-teal-400">
              {formatVolume(workout.total_volume)}
            </p>
          </div>
        )}
        <div className="border-2 border-white p-3">
          <p className="text-xs text-gray-400 font-mono">Exercises</p>
          <p className="text-2xl font-mono text-white">
            {workout.exercises?.length || 0}
          </p>
        </div>
      </div>

      {/* Exercise List */}
      <div>
        <h3 className="text-lg font-bold mb-3 font-mono text-teal-400">
          Exercises Completed
        </h3>
        <div className="space-y-3">
          {workout.exercises?.map((we: WorkoutExerciseWithLogs) => (
            <div key={we.id} className="border-2 border-white p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-mono font-bold text-white">
                    {we.exercise.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-sans">
                    {we.exercise.category.replace("_", " ")}
                  </p>
                </div>
                <span className="bg-teal-400 text-black px-2 py-1 text-xs font-mono">
                  {we.exercise.difficulty}
                </span>
              </div>

              {/* Sets completed */}
              <div className="space-y-2">
                <p className="text-xs text-gray-400 font-mono">Sets:</p>
                {we.logs.map((log: EnhancedWorkoutLog, idx: number) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 text-sm font-mono bg-black/50 p-2 border border-gray-700"
                  >
                    <span className="text-teal-400">Set {idx + 1}</span>
                    {log.reps_completed && (
                      <span className="text-white">
                        {log.reps_completed} reps
                      </span>
                    )}
                    {log.duration_seconds && (
                      <span className="text-white">
                        {log.duration_seconds}s
                      </span>
                    )}
                    {log.weight_kg && (
                      <span className="text-gray-400">{log.weight_kg} kg</span>
                    )}
                    {log.difficulty_rating && (
                      <span className="text-gray-400">
                        {"⭐".repeat(log.difficulty_rating)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onClose}
        className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none"
      >
        ← Back to History
      </button>
    </div>
  );
}

// Personal Records View
interface PersonalRecordsViewProps {
  personalRecords: PersonalRecord[];
  loading: boolean;
  onBack: () => void;
}

function PersonalRecordsView({
  personalRecords,
  loading,
  onBack,
}: PersonalRecordsViewProps) {
  // Group PRs by exercise
  const prsByExercise = personalRecords.reduce(
    (acc, pr) => {
      const exerciseName = pr.exercise?.name || "Unknown";
      if (!acc[exerciseName]) {
        acc[exerciseName] = [];
      }
      acc[exerciseName].push(pr);
      return acc;
    },
    {} as Record<string, PersonalRecord[]>,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">Loading PRs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono text-yellow-400">
            🏆 Personal Records
          </h2>
          <p className="text-gray-400 font-sans">
            Your all-time best performances
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>

      {personalRecords.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-600">
          <p className="text-xl font-mono text-gray-400 mb-2">
            No personal records yet
          </p>
          <p className="text-sm text-gray-500 font-sans">
            Keep working out to set your first PR!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(prsByExercise).map(([exerciseName, prs]) => (
            <div key={exerciseName} className="border-2 border-yellow-400 p-4">
              <h3 className="font-mono font-bold text-white text-lg mb-3">
                {exerciseName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prs.map((pr) => (
                  <div
                    key={pr.id}
                    className="bg-yellow-400/10 border border-yellow-400 p-3"
                  >
                    <p className="text-xs text-gray-400 font-mono mb-1">
                      {pr.record_type.replace("_", " ").toUpperCase()}
                    </p>
                    <p className="text-2xl font-mono text-yellow-400 font-bold">
                      {pr.value}
                      {pr.record_type === "max_weight" && " kg"}
                      {pr.record_type === "max_duration" && "s"}
                      {pr.record_type === "max_reps" && " reps"}
                    </p>
                    <p className="text-xs text-gray-400 font-sans mt-1">
                      {new Date(pr.achieved_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none"
      >
        ← Back to History
      </button>
    </div>
  );
}
