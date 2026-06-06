import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";

export default async function Keepers() {
  const supabase = await createClient();
  const { data: keepers, error } = await supabase.from("keepers").select("*");

  const keeperStyle = `border-b border-black w-full text-center p-2`;
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-white dark:bg-black">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {keepers.map((k) => (
          <div
            key={k.id}
            className="w-full p-2 overflow-y-scroll h-[calc(100vh - 3rem)]"
          >
            <div className="rounded-t-lg bg-white p-3 flex justify-center border-b-2 border-black">
              <h2 className="text-black font-bold underline">
                Team Neam: {k.team_name}
              </h2>
            </div>
            <div className="rounded-b-lg bg-white p-4 flex flex-col justify-center items-center">
              <p className={keeperStyle}>Pick 1: {k.pick1}</p>
              <p className={keeperStyle}>Pick 2: {k.pick2}</p>
              <p className={keeperStyle}>Pick 3: {k.pick3}</p>
              <p className={keeperStyle}>Pick 4: {k.pick4}</p>
              <p className={keeperStyle}>Pick 5: {k.pick5}</p>
              <p className={keeperStyle}>Pick 6: {k.pick6}</p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
