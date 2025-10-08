/** @format */

import { useAuth } from "./hooks/useAuth";
import { supabase } from "./lib/supabase";
import Dashboard from "./components/Dashboard";

const handleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}`,
    },
  });
  if (error) console.error("Error signing in:", error.message);
};

const handleSignOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error signing out:", error.message);
};

function App() {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl md:text-2xl font-mono text-teal-400">
          Loading...
        </div>
      </div>
    );
  }

  // Show dashboard if user is logged in
  if (user) {
    return <Dashboard user={user} onSignOut={handleSignOut} />;
  }

  // Show landing page if user is not logged in
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 sm:py-6">
        <span className="font-sans text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-text">
          workout_gen
        </span>
        <button
          disabled={loading}
          onClick={handleSignIn}
          className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-3 sm:px-4 text-white font-mono text-sm sm:text-base md:text-xl bg-black border-2 border-white cursor-pointer select-none"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 -mt-10 sm:-mt-20">
        <h1 className="text-white text-3xl sm:text-5xl md:text-7xl font-mono mb-4 sm:mb-6 text-center">
          hey, I'm <span className="text-teal-400">workout_gen</span>
        </h1>

        <p className="text-white text-base sm:text-lg md:text-2xl font-sans mb-8 sm:mb-12 text-center max-w-md px-4">
          Generate personalized workout routines
        </p>

        <button
          disabled={loading}
          onClick={handleSignIn}
          className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 sm:py-3 px-5 sm:px-6 text-white font-mono text-lg sm:text-xl md:text-2xl bg-black border-2 border-white cursor-pointer select-none"
        >
          Get Started
        </button>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center py-6 sm:py-8 px-4">
        <a
          href="https://lawrenz1337.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-teal-400 transition-colors font-mono text-xs sm:text-sm flex items-center gap-2"
        >
          Made by <span className="text-teal-400">lawreNz1337</span>
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </footer>
    </div>
  );
}

export default App;
