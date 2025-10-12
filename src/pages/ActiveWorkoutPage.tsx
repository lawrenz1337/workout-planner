/** @format */

import { User } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import ActiveWorkoutTracker from "../components/ActiveWorkoutTracker";
import { GeneratedWorkout } from "../types/workout-service";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { useLoadTemplate } from "../hooks/useTemplates";

interface ActiveWorkoutPageProps {
  user: User;
}

export default function ActiveWorkoutPage({ user }: ActiveWorkoutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUserPreferences(user.id);

  // Get workout data from location state
  const passedWorkout = location.state?.workout as GeneratedWorkout | undefined;
  const templateId = location.state?.templateId as string | undefined;

  // Load template if templateId is provided
  const {
    workout: loadedWorkout,
    isLoading,
    error,
  } = useLoadTemplate(templateId);

  // Use either the passed workout or the loaded template
  const workout = passedWorkout || loadedWorkout;

  const handleComplete = () => {
    navigate("/progress");
  };

  const handleExit = () => {
    navigate("/workouts");
  };

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl font-mono text-red-400 mb-4">
          Failed to load template
        </p>
        <p className="text-sm text-gray-400 font-sans mb-6">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
        <button
          onClick={() => navigate("/workouts")}
          className="px-4 py-2 bg-transparent hover:bg-gray-800 text-white font-mono text-sm transition-colors border-2 border-white"
        >
          ← Back to Workouts
        </button>
      </div>
    );
  }

  // Show loading state while loading template
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl font-mono text-teal-400">
          Loading workout...
        </div>
      </div>
    );
  }

  // Redirect if no workout data available
  if (!workout) {
    navigate("/workouts");
    return null;
  }

  return (
    <ActiveWorkoutTracker
      workout={workout}
      userId={user.id}
      userWeightKg={preferences?.weight_kg}
      onComplete={handleComplete}
      onExit={handleExit}
    />
  );
}
