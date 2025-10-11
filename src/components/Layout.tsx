/** @format */

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { queryKeys } from "../lib/queryKeys";
import { EnhancedWorkout, calculateStreak } from "../types/enhanced-types";

interface LayoutProps {
  user: User;
  onSignOut: () => void;
}

type NavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

export default function Layout({ user, onSignOut }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch workout history for streak calculation
  const { data: workouts = [] } = useQuery({
    queryKey: queryKeys.workouts.streak(user.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as EnhancedWorkout[];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const streak = calculateStreak(workouts);

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { id: "workouts", label: "Workouts", icon: "💪", path: "/workouts" },
    { id: "exercises", label: "Exercises", icon: "🏋️", path: "/exercises" },
    { id: "progress", label: "Progress", icon: "📊", path: "/progress" },
    { id: "settings", label: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const isActiveRoute = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black border-b-2 border-white p-4 flex items-center justify-between z-40">
        <Link
          to="/dashboard"
          className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-text hover:drop-shadow-whiteText hover:text-teal-400 transition-colors"
        >
          workout_gen
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-teal-400 text-2xl"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 w-64 bg-black border-r-2 border-white flex flex-col`}
      >
        {/* Logo - Hidden on mobile (shown in mobile header instead) */}
        <div className="hidden lg:block p-6 border-b-2 border-white">
          <Link
            to="/dashboard"
            className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-text hover:drop-shadow-whiteText hover:text-teal-400 transition-colors"
          >
            workout_gen
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b-2 border-white mt-16 lg:mt-0">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.full_name}
              className="w-12 h-12 rounded-full border-2 border-teal-400"
            />
            <div className="flex-1 min-w-0">
              <p className="font-sans font-bold text-sm truncate">
                {user.user_metadata.full_name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Streak Badge */}
          {streak.current_streak > 0 && (
            <div className="mt-3 px-3 py-2 bg-teal-400/10 border border-teal-400 flex items-center justify-between">
              <span className="text-xs font-mono text-teal-400">
                Current Streak
              </span>
              <span className="font-mono font-bold text-white">
                {streak.current_streak} 🔥
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full text-left px-4 py-3 font-mono transition-all flex items-center gap-3 ${
                isActiveRoute(item.path)
                  ? "bg-teal-400 text-black font-bold"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sign Out Button - Always visible at bottom */}
        <div className="p-4 border-t-2 border-white">
          <button
            onClick={onSignOut}
            className="w-full active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-white cursor-pointer select-none"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto">
          {/* Greeting Section */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-mono font-bold mb-2">
              Hey,{" "}
              <span className="text-teal-400 drop-shadow-whiteText">
                {user.user_metadata.full_name?.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Ready to crush your fitness goals today?
            </p>
          </div>

          {/* Page Content */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
