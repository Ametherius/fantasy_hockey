import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import KeepersClient from "../../components/keepersClient.js";

export default async function Keepers() {
  const supabase = await createClient();
  const { data: keepers, error } = await supabase.from("keepers").select("*");
  useEffect(() => {
    supabase.auth.getUser().then(({ data: data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );

    return () => subscription.unsubscribe();
  });

  if (!data?.claims) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col flex-1 items-center font-sans bg-white dark:bg-black">
      <Header />
      <main className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 w-full h-full py-32 px-16 bg-white dark:bg-black sm:items-start">
        <KeepersClient keepers={keepers} />
      </main>
    </div>
  );
}
