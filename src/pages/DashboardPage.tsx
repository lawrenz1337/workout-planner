/** @format */

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { queryKeys } from "../lib/queryKeys";
import { useAuth } from "../hooks/useAuth";
import { PersonalRecord, EnhancedWorkout } from "../types/enhanced-types";
import DashboardHero from "../components/dashboard/DashboardHero";
import WorkoutActionCard from "../components/dashboard/WorkoutActionCard";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickStats from "../components/dashboard/QuickStats";
import WorkoutCalendar from "../components/dashboard/WorkoutCalendar";
import PersonalRecordsPreview from "../components/dashboard/PersonalRecordsPreview";
import MuscleRecoveryCard from "../components/dashboard/MuscleRecoveryCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch workout history (raw data for dashboard widgets)
  const { data: workouts = [], isLoading: workoutsLoading } = useQuery({
    queryKey: queryKeys.workouts.all(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as EnhancedWorkout[];
    },
    enabled: !!user?.id,
  });

  // Fetch personal records
  const { data: personalRecords = [], isLoading: prsLoading } = useQuery({
    queryKey: queryKeys.personalRecords.all(user?.id || ""),
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("personal_records")
        .select("*, exercises(*)")
        .eq("user_id", user.id)
        .order("achieved_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as PersonalRecord[];
    },
    enabled: !!user?.id,
  });

  const handleViewWorkoutDetails = (workoutId: string) => {
    navigate("/progress", { state: { selectedWorkoutId: workoutId } });
  };

  if (workoutsLoading || prsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <DashboardHero workouts={workouts} />

      {/* Workout Action Card */}
      <WorkoutActionCard workouts={workouts} />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <RecentActivity
          workouts={workouts}
          onViewDetails={handleViewWorkoutDetails}
        />

        {/* Quick Stats */}
        <QuickStats workouts={workouts} />
      </div>

      {/* Muscle Recovery Status */}
      <MuscleRecoveryCard workouts={workouts} />

      {/* Personal Records */}
      {personalRecords.length > 0 && (
        <PersonalRecordsPreview personalRecords={personalRecords} />
      )}

      {/* Workout Calendar */}
      <WorkoutCalendar workouts={workouts} />
    </div>
  );
}
