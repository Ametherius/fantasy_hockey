import Header from "@/components/header";
import MyKeepersClient from "@/components/myKeepersClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function MyKeepers() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const teamName = (user.user_metadata?.teamName ?? "").trim();

  let keepers = [];
  if (teamName) {
    const { data, error } = await supabase
      .from("keepers")
      .select("*")
      .eq("team_name", teamName)
      .order("id", { ascending: true });

    if (error) {
      console.error("[mykeepers]", error.message);
    } else {
      keepers = data ?? [];
    }
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col items-center overflow-x-hidden font-sans bg-white dark:bg-black">
      <Header />
      <main className="flex w-full max-w-3xl min-w-0 flex-1 flex-col items-center bg-white px-3 py-6 sm:px-6 sm:py-10 dark:bg-black">
        <MyKeepersClient
          keepers={keepers}
          teamName={teamName}
          userId={user.id}
        />
      </main>
    </div>
  );
}
