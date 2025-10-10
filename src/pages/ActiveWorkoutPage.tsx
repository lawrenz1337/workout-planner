/** @format */

import { User } from "@supabase/supabase-js";
import { useNavigate, useLocation } from "react-router-dom";
import ActiveWorkoutTracker from "../components/ActiveWorkoutTracker";
import { GeneratedWorkout } from "../types/workout-service";
import { useUserPreferences } from "../hooks/useUserPreferences";

interface ActiveWorkoutPageProps {
  user: User;
}

export default function ActiveWorkoutPage({ user }: ActiveWorkoutPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { preferences } = useUserPreferences(user.id);

  // Get workout data from location state (passed from WorkoutGenerator)
  const workout = location.state?.workout as GeneratedWorkout | undefined;

  const handleComplete = () => {
    navigate("/progress");
  };

  const handleExit = () => {
    navigate("/workouts");
  };

  // If no workout data, redirect to workouts page
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
