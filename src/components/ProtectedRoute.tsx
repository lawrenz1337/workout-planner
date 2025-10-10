/** @format */

import { Navigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface ProtectedRouteProps {
  user: User | null;
  loading: boolean;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  user,
  loading,
  children,
}: ProtectedRouteProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl md:text-2xl font-mono text-teal-400">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
