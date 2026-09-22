"use client";
export default function AwayTeam({ abbrev, logo, odds = "", score = "" }) {
  return (
    <div className="bg-white rounded-l-xl flex transform -skew-x-10 h-16 my-2">
      <div className="font-bold text-2xl mx-auto my-auto p-2 hidden lg:block">
        <span>{abbrev}</span>
      </div>
      <div className="flex justify-center items-center sm:min-w-20">
        <img
          src={logo}
          alt={`Logo for ${abbrev}`}
          className="transform skew-x-10 h-full w-full object-contain"
        />
      </div>
      <div className="bg-black border-2 px-6 border-white flex justify-center items-center text-white text-2xl min-w-12 sm:min-w-20 sm:px-6 sm:text-lg">
        <span>{odds}</span>
        <span>{score}</span>
      </div>
    </div>
  );
}
