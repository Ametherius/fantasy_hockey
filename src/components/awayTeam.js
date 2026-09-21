"use client";
export default function AwayTeam({ abbrev, logo, odds = "", score = "" }) {
  return (
    <div className="bg-white rounded-l-xl grid grid-cols-3 transform -skew-x-10 h-16 my-2 w-80">
      <div className="p-4 font-bold text-2xl mx-auto my-auto">
        <span>{abbrev}</span>
      </div>
      <div>
        <img
          src={logo}
          alt={`Logo for ${abbrev}`}
          className="h-16 transform skew-x-10"
        />
      </div>
      <div className="bg-black border-2 border-white flex justify-center items-center text-white text-2xl">
        <span>{odds}</span>
      </div>
    </div>
  );
}
