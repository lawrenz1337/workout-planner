/** @format */

import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
          Dashboard
        </h2>
        <p className="text-gray-400 font-sans mb-6">
          Welcome back! Choose an option to get started.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/workouts/new"
          className="border-2 border-white p-6 hover:border-teal-400 transition-colors group"
        >
          <div className="text-4xl mb-3">💪</div>
          <h3 className="text-xl font-mono font-bold mb-2 group-hover:text-teal-400">
            Create Workout
          </h3>
          <p className="text-gray-400 text-sm font-sans">
            Generate a personalized workout plan
          </p>
        </Link>

        <Link
          to="/exercises"
          className="border-2 border-white p-6 hover:border-teal-400 transition-colors group"
        >
          <div className="text-4xl mb-3">🏋️</div>
          <h3 className="text-xl font-mono font-bold mb-2 group-hover:text-teal-400">
            Exercise Library
          </h3>
          <p className="text-gray-400 text-sm font-sans">
            Browse available exercises
          </p>
        </Link>

        <Link
          to="/progress"
          className="border-2 border-white p-6 hover:border-teal-400 transition-colors group"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-xl font-mono font-bold mb-2 group-hover:text-teal-400">
            View Progress
          </h3>
          <p className="text-gray-400 text-sm font-sans">
            Check your workout history and stats
          </p>
        </Link>

        <Link
          to="/settings"
          className="border-2 border-white p-6 hover:border-teal-400 transition-colors group"
        >
          <div className="text-4xl mb-3">⚙️</div>
          <h3 className="text-xl font-mono font-bold mb-2 group-hover:text-teal-400">
            Settings
          </h3>
          <p className="text-gray-400 text-sm font-sans">
            Update your profile and preferences
          </p>
        </Link>
      </div>
    </div>
  );
}
