/** @format */

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import WorkoutGeneratorPage from "./pages/WorkoutGeneratorPage";
import ActiveWorkoutPage from "./pages/ActiveWorkoutPage";
import ExercisesPage from "./pages/ExercisesPage";
import ProgressPage from "./pages/ProgressPage";
import SettingsPage from "./pages/SettingsPage";

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
};

function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      {/* Public route */}
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute user={user} loading={loading}>
            <Layout user={user!} onSignOut={handleSignOut} />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route
          path="/workouts/new"
          element={<WorkoutGeneratorPage user={user!} />}
        />
        <Route
          path="/workouts/active"
          element={<ActiveWorkoutPage user={user!} />}
        />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/progress" element={<ProgressPage user={user!} />} />
        <Route path="/settings" element={<SettingsPage user={user!} />} />
      </Route>

      {/* Catch all - redirect to landing or dashboard */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;
