/** @format */

import { useState } from "react";
import { User } from "@supabase/supabase-js";

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

type TabType = "workouts" | "exercises" | "progress" | "settings";

export default function Dashboard({ user, onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("workouts");

  const tabs = [
    { id: "workouts" as TabType, label: "Workouts", icon: "💪" },
    { id: "exercises" as TabType, label: "Exercises", icon: "🏋️" },
    { id: "progress" as TabType, label: "Progress", icon: "📊" },
    { id: "settings" as TabType, label: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "workouts":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">My Workouts</h2>
            <p className="text-gray-400">
              Your workout plans will appear here. Start by creating your first
              workout!
            </p>
            <button className="mt-4 w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-lg bg-black border-2 border-white cursor-pointer select-none">
              Create Workout
            </button>
          </div>
        );
      case "exercises":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Exercise Library</h2>
            <p className="text-gray-400">
              Browse and manage your exercise database.
            </p>
          </div>
        );
      case "progress":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
            <p className="text-gray-400">
              Track your fitness journey and see your improvements over time.
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4">Settings</h2>
            <p className="text-gray-400">Manage your account preferences.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r-2 border-teal-400 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b-2 border-gray-800">
          <span className="font-sans text-2xl font-bold text-white drop-shadow-text">
            workout_gen
          </span>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b-2 border-gray-800 flex items-center gap-3">
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
              onClick={() => setActiveTab(tab.id)}
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
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-mono font-bold mb-2">
              Hey,{" "}
              <span className="text-teal-400">
                {user.user_metadata.full_name?.split(" ")[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-gray-400 font-sans">
              Ready to crush your fitness goals today?
            </p>
          </div>

          <div className="bg-black rounded-lg p-6 border-2 border-gray-800">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}
