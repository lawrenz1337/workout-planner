/** @format */

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

type TabType = "workouts" | "exercises" | "progress" | "settings";

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("workouts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabs = [
    { id: "workouts" as TabType, label: "Workouts", icon: "💪" },
    { id: "exercises" as TabType, label: "Exercises", icon: "🏋️" },
    { id: "progress" as TabType, label: "Progress", icon: "📊" },
    { id: "settings" as TabType, label: "Settings", icon: "⚙️" },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Call Supabase Edge Function or RPC to delete user
      const { error } = await supabase.rpc("delete_user");

      if (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again or contact support.");
      } else {
        // Sign out after successful deletion
        await supabase.auth.signOut();
      }
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
        return (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">My Workouts</h2>
            <p className="text-gray-400">
              Your workout plans will appear here. Start by creating your first
              workout!
            </p>
            <button className="mt-4 w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none">
              Create Workout
            </button>
          </div>
        );
      case "exercises":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Exercise Library
            </h2>
            <p className="text-gray-400">
              Browse and manage your exercise database.
            </p>
          </div>
        );
      case "progress":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Your Progress
            </h2>
            <p className="text-gray-400">
              Track your fitness journey and see your improvements over time.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Settings</h2>

            <div className="space-y-4">
              <div className="border-2 border-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-2 text-red-400">
                  Danger Zone
                </h3>
                <p className="text-gray-400 text-sm mb-4">
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
                <div className="bg-black border-2 border-red-500 rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-2xl font-bold mb-4 text-red-400">
                    Delete Account?
                  </h3>
                  <p className="text-gray-300 mb-6">
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
    <div className="min-h-screen bg-black text-white flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black border-b-2 border-teal-400 p-4 flex items-center justify-between z-40">
        <span className="font-sans text-xl font-bold text-white drop-shadow-text">
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
        } lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 w-64 bg-black border-r-2 border-teal-400 flex flex-col`}
      >
        {/* Logo - Hidden on mobile (shown in mobile header instead) */}
        <div className="hidden lg:block p-6 border-b-2 border-gray-800">
          <span className="font-sans text-2xl font-bold text-white drop-shadow-text">
            workout_gen
          </span>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b-2 border-gray-800 flex items-center gap-3 mt-16 lg:mt-0">
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
        <nav className="flex-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-mono transition-all flex items-center gap-3 ${
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

        {/* Sign Out Button */}
        <div className="p-4 border-t-2 border-gray-800">
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
              <span className="text-teal-400">
                {user.user_metadata.full_name?.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-gray-400 font-sans text-sm md:text-base">
              Ready to crush your fitness goals today?
            </p>
          </div>

          <div className="bg-black rounded-lg p-4 md:p-6 border-2 border-gray-800">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
