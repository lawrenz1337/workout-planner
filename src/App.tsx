/** @format */

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <span className="font-sans text-3xl font-bold text-white drop-shadow-text">
          workout_gen
        </span>
        <button className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-2 px-4 text-white font-mono text-xl bg-black border-2 border-white cursor-pointer select-none">
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 -mt-20">
        <h1 className="text-white text-5xl md:text-7xl w-fit font-mono mb-2">
          hey, I'm <span className="text-teal-400">workout_gen</span>
        </h1>

        <p className="text-white text-xl md:text-2xl font-sans mb-12">
          Generate personalized workout routines
        </p>

        <button className="w-fit active:after:w-0 active:before:h-0 active:translate-x-[6px] active:translate-y-[6px] after:left-[calc(100%+2px)] after:top-[-2px] after:h-[calc(100%+4px)] after:w-[6px] after:transition-all before:transition-all after:skew-y-[45deg] before:skew-x-[45deg] before:left-[-2px] before:top-[calc(100%+2px)] before:h-[6px] before:w-[calc(100%+4px)] before:origin-top-left after:origin-top-left relative transition-all after:content-[''] before:content-[''] after:absolute before:absolute before:bg-teal-400 after:bg-teal-400 hover:bg-gray-900 active:bg-gray-800 flex justify-center items-center py-3 px-6 text-white font-mono text-2xl bg-black border-2 border-white cursor-pointer select-none">
          Get Started
        </button>
      </main>

      {/* Footer spacing */}
      <div className="h-20"></div>
    </div>
  );
}

export default App;
