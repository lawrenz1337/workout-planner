/** @format */

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { deleteCurrentUser } from "../services/user";
import ExerciseLibrary from "./ExerciseLibrary";
import WorkoutGenerator from "./WorkoutGenerator";

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

type TabType = "workouts" | "exercises" | "progress" | "settings";
type Tabs = Array<{ id: TabType; label: string; icon: string }>;

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("workouts");
  const [showGenerator, setShowGenerator] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabs: Tabs = [
    { id: "workouts", label: "Workouts", icon: "💪" },
    { id: "exercises", label: "Exercises", icon: "🏋️" },
    { id: "progress", label: "Progress", icon: "📊" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteCurrentUser();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "workouts":
        if (showGenerator) {
          return <WorkoutGenerator />;
        }
        return (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
              My Workouts
            </h2>
            <p className="text-gray-400 font-sans">
              Your workout plans will appear here. Start by creating your first
              workout!
            </p>
            <button
              onClick={() => setShowGenerator(true)}
              className="mt-4 w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
            >
              Create Workout
            </button>
          </div>
        );
      case "exercises":
        return <ExerciseLibrary />;
      case "progress":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
              Your Progress
            </h2>
            <p className="text-gray-400 font-sans">
              Track your fitness journey and see your improvements over time.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
              Settings
            </h2>

            <div className="space-y-4">
              <div className="border-2 border-white p-4">
                <h3 className="text-xl font-bold mb-2 text-red-400 font-mono">
                  Danger Zone
                </h3>
                <p className="text-gray-400 text-sm mb-4 font-sans">
                  Once you delete your account, there is no going back. This
                  action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-red-500 after:bg-red-500 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-red-500 cursor-pointer select-none"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                <div className="bg-black border-2 border-red-500 p-6 max-w-md w-full">
                  <h3 className="text-2xl font-bold mb-4 text-red-400 font-mono">
                    Delete Account?
                  </h3>
                  <p className="text-gray-300 mb-6 font-sans">
                    Are you absolutely sure? This will permanently delete your
                    account, all your workouts, and all associated data. This
                    action cannot be undone.
                  </p>
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-red-500 after:bg-red-500 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-red-500 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isDeleting}
                      className="flex-1 active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-sm bg-black border-2 border-white cursor-pointer select-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black border-b-2 border-white p-4 flex items-center justify-between z-40">
        <span className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-text">
          workout_gen
        </span>
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
          <span className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-text">
            workout_gen
          </span>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b-2 border-white flex items-center gap-3 mt-16 lg:mt-0">
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

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full text-left px-4 py-3 font-mono transition-all flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-teal-400 text-black font-bold"
                  : "text-white hover:bg-gray-800"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
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
      <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto">
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

          <div className="bg-black p-4 md:p-6 border-2 border-white">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
