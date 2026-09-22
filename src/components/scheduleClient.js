"use client";

import { useState } from "react";
import AwayTeam from "./awayTeam";
import HomeTeam from "./homeTeam";

export default function ScheduleClient({ scores }) {
  function formatET(startTimeUTC) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(new Date(startTimeUTC))
      .replace(" ", "");
  }
  const middleStyle =
    "bg-white transform -skew-x-10 h-16 my-2 min-w-14 max-w-20 flex justify-center flex-col shrink-0 items-center p-1 font-bold sm:min-w-14";
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full p-4">
      {scores.map((g) => {
        const homeTeam = {
          abbrev: g.homeTeam.abbrev.trim(),
          logo: g.homeTeam.logo,
          odds: g.homeTeam.odds?.[0]?.value ?? "",
          score: g.homeTeam.score,
        };

        const awayTeam = {
          abbrev: g.awayTeam.abbrev.trim(),
          logo: g.awayTeam.logo,
          odds: g.awayTeam.odds?.[0]?.value ?? "",
          score: g.awayTeam.score,
        };

        if (g.gameState === "FINAL") {
          return (
            <div
              key={g.id}
              className="m-4 flex g-0 items-center justify-center"
            >
              <AwayTeam
                abbrev={awayTeam.abbrev}
                logo={awayTeam.logo}
                score={awayTeam.score}
              />
              <div className={middleStyle}>
                <span>{g.gameState}</span>
                <span>{g.gameOutcome.lastPeriodType}</span>
              </div>
              <HomeTeam
                abbrev={homeTeam.abbrev}
                logo={homeTeam.logo}
                score={homeTeam.score}
              />
            </div>
          );
        } else if (g.gameState === "FUT" || g.gameState === "PRE") {
          return (
            <div
              key={g.id}
              className="m-4 flex g-0 items-center justify-center"
            >
              <AwayTeam
                abbrev={awayTeam.abbrev}
                logo={awayTeam.logo}
                odds={g.awayTeam.odds ? `${awayTeam.odds}` : ""}
              />
              <div className={middleStyle}>
                {g.gameState === "FUT" && <span>VS</span>}
                {g.gameState === "PRE" && <span>PRE</span>}
                <span className="text-xs">{formatET(g.startTimeUTC)} ET</span>
              </div>
              <HomeTeam
                abbrev={homeTeam.abbrev}
                logo={homeTeam.logo}
                odds={g.homeTeam.odds ? `${homeTeam.odds}` : ""}
              />
            </div>
          );
        } else if (g.gameState === "LIVE" || g.gameState === "CRIT") {
          return (
            <div
              key={g.id}
              className="m-4 flex g-0 items-center justify-center"
            >
              <AwayTeam
                abbrev={awayTeam.abbrev}
                logo={awayTeam.logo}
                score={awayTeam.score}
              />
              <div className={middleStyle}>
                {g.periodDescriptor.number <= 3 && (
                  <span>Period {g.periodDescriptor.number}</span>
                )}
                {g.periodDescriptor.number > 3 && (
                  <span>{g.periodDescriptor.periodType}</span>
                )}
                {g.gameState === "LIVE" ||
                  (g.gameState === "CRIT" && (
                    <span>{g.clock?.timeRemaining}</span>
                  ))}
              </div>
              <HomeTeam
                abbrev={homeTeam.abbrev}
                logo={homeTeam.logo}
                score={homeTeam.score}
              />
            </div>
          );
        }
      })}
    </div>
  );
}
