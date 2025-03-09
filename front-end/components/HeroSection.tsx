import React from "react";

const HeroSection = () => {
  return (
    <div className="relative flex items-center justify-center h-[60vh] bg-gradient-to-r from-slate-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-center px-6 overflow-hidden">
      {/* Background animation or decorative elements (optional) */}
      <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] dark:bg-[url('/images/hero-pattern-dark.svg')] opacity-10"></div>

      {/* Content */}
      
      <div className="relative max-w-4xl space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-900 dark:text-gray-100">
          Unveiling Stories, Sparking Ideas – <br /> Your Gateway to Insightful Reads.
        </h1>
        <p className="text-lg md:text-xl text-gray-800 dark:text-gray-300">
          Explore a world of thought-provoking articles, curated just for you.
        </p>
        <button
          className={`mt-8 px-8 py-3 rounded-lg font-semibold text-lg 
         
              dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white
               bg-slate-200 text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-gray-100 
           transition-all duration-300 transform hover:scale-105`}
        >
          Start Reading
        </button>
      </div>
    </div>
  );
};

export default HeroSection;