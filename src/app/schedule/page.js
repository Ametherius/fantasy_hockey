import AwayTeam from "@/components/awayTeam";
import Header from "@/components/header";
import HomeTeam from "@/components/homeTeam";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Schedule() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/login");
  }

  const result = await fetch("https://api-web.nhle.com/v1/schedule/now");
  const scheduleData = await result.json();

  const currentWeek = scheduleData.gameWeek[0];
  const games = currentWeek.games ?? [];
  console.log(currentWeek);

  function formatET(startTimeUTC) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(startTimeUTC));
  }
  // console.log(scheduleData);
  return (
    <div className="flex flex-col flex-1 items-center font-sans bg-white dark:bg-black">
      <Header />
      <div className="text-center text-white my-8 font-bold">
        <h1 className="text-4xl">Today's Schedule</h1>
      </div>
      <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-2 p-3">
        {games.map((g) => (
          <div className="flex full m-4" key={g.id}>
            <AwayTeam
              abbrev={g.awayTeam.abbrev.trim()}
              logo={g.awayTeam.logo}
              odds={g.awayTeam.odds[0].value}
            />
            <div className="bg-white transform -skew-x-10 h-16 my-2 w-18 flex flex-col justify-center items-center font-bold">
              <span>VS</span>
              <span className="text-xs">{formatET(g.startTimeUTC)} ET</span>
            </div>
            <HomeTeam
              abbrev={g.homeTeam.abbrev.trim()}
              logo={g.homeTeam.logo}
              odds={g.homeTeam.odds[0].value}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
