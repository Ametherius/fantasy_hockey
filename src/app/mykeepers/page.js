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
    <div className="flex flex-col flex-1 items-center font-sans bg-white dark:bg-black">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-10 px-6 bg-white dark:bg-black">
        <MyKeepersClient
          keepers={keepers}
          teamName={teamName}
          userId={user.id}
        />
      </main>
    </div>
  );
}
