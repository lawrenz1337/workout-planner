/** @format */

import { Link } from "react-router-dom";

export default function WorkoutsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 font-mono">
        My Workouts
      </h2>
      <p className="text-gray-400 font-sans">
        Your workout plans will appear here. Start by creating your first
        workout!
      </p>
      <Link
        to="/workouts/new"
        className="mt-4 inline-block w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-base md:text-lg bg-black border-2 border-white cursor-pointer select-none"
      >
        Create Workout
      </Link>
    </div>
  );
}
