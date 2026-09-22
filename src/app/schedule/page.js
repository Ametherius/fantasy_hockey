import AwayTeam from "@/components/awayTeam";
import Header from "@/components/header";
import HomeTeam from "@/components/homeTeam";
import ScheduleClient from "@/components/scheduleClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Schedule() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    redirect("/login");
  }

  async function getSchedule() {
    try {
      const result = await fetch("https://api-web.nhle.com/v1/schedule/now");
      const scheduleData = await result.json();

      const currentWeek = scheduleData.gameWeek[0];
      const games = currentWeek.games ?? [];

      if (!games) return;
      return games;
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getScores() {
    try {
      const res = await fetch("https://api-web.nhle.com/v1/score/now");
      const data = await res.json();

      const games = data.games ?? [];
      if (!games) return;
      return games;
    } catch (err) {}
  }

  const games = await getSchedule();
  const scores = await getScores();

  // console.log(scores);

  // console.log(scheduleData);
  return (
    <div className="flex flex-col flex-1 items-center font-sans bg-white dark:bg-black sm:w-full md:w-full lg:w-full overflow-x-hidden">
      <Header />
      <div className="text-center text-white my-8 font-bold">
        <h1 className="text-4xl">Today's Schedule</h1>
      </div>
      <div className="flex justify-center">
        <ScheduleClient games={games} scores={scores} />
      </div>
    </div>
  );
}
