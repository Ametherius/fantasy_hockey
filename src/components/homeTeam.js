"use client";
export default function HomeTeam({ abbrev, logo, odds = "", score = "" }) {
  return (
    <div className="bg-white rounded-r-xl grid grid-cols-3 transform -skew-x-10 h-16 my-2 w-80">
      <div className="bg-black border-2 border-white flex justify-center items-center text-2xl text-white">
        {odds}
      </div>
      <div>
        <img
          src={logo}
          alt={`Logo for ${abbrev}`}
          className="h-16 transform skew-x-10"
        />
      </div>
      <div className="flex justify-center items-center font-bold text-2xl">
        <span>{abbrev}</span>
      </div>
    </div>
  );
}
