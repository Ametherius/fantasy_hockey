import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";

export default async function Keepers() {
  const supabase = await createClient();
  const { data: keepers, error } = await supabase.from("keepers").select("*");

  function splitPick(pick) {
    if (!pick) return { number: "", name: "" };
    const match = pick.match(/^(\d+)\s*[-.)]?\s*(.*)$/);
    return {
      number: match?.[1] ?? "",
      name: match?.[2] ?? pick,
    };
  }

  const keeperStyle = `border-b-2 border-gray-700 w-full text-center bg-white p-2`;
  return (
    <div className="flex flex-col flex-1 items-center font-sans bg-white dark:bg-black">
      <Header />
      <main className="grid grid-cols-4 w-full h-full py-32 px-16 bg-white dark:bg-black sm:items-start">
        {keepers.map((k) => {
          const pick1 = splitPick(k.pick1);
          const pick2 = splitPick(k.pick2);
          const pick3 = splitPick(k.pick3);
          const pick4 = splitPick(k.pick4);
          const pick5 = splitPick(k.pick5);
          const pick6 = splitPick(k.pick6);

          return (
            <div key={k.id} className="w-full p-2 h-[calc(100vh - 3rem)]">
              <div className="bg-white blur-xs">
                <div className=" bg-white p-3 flex justify-center border-b-2 border-black">
                  <h1 className="text-black font-bold text-2xl">
                    {k.team_name}
                  </h1>
                </div>
                <div className=" bg-gray-700 flex flex-col justify-center items-center">
                  <p className={keeperStyle}>
                    <strong>({pick1.number}) </strong>
                    {pick1.name}
                  </p>
                  <p className={keeperStyle}>
                    <strong>({pick2.number}) </strong>
                    {pick2.name}
                  </p>
                  <p className={keeperStyle}>
                    <strong>({pick3.number}) </strong>
                    {pick3.name}
                  </p>
                  <p className={keeperStyle}>
                    <strong>({pick4.number}) </strong>
                    {pick4.name}
                  </p>
                  <p className={keeperStyle}>
                    <strong>({pick5.number})</strong> {pick5.name}
                  </p>
                  <p className={keeperStyle}>
                    <strong>({pick6.number})</strong> {pick6.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
