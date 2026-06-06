"use client";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const inputStyle = `border-2 border-black rounded-lg p-2 m-1`;
  const [teamName, setTeamName] = useState("");
  const [pick1, setPick1] = useState("");
  const [pick2, setPick2] = useState("");
  const [pick3, setPick3] = useState("");
  const [pick4, setPick4] = useState("");
  const [pick5, setPick5] = useState("");
  const [pick6, setPick6] = useState("");
  const supabase = createClient();
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmission(e) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("keepers").insert({
      team_name: teamName.trim(),
      pick1: pick1.trim() || null,
      pick2: pick2.trim() || null,
      pick3: pick3.trim() || null,
      pick4: pick4.trim() || null,
      pick5: pick5.trim() || null,
      pick6: pick6.trim() || null,
    });
    setSubmitting(false);
    setTeamName("");
    setPick1("");
    setPick2("");
    setPick3("");
    setPick4("");
    setPick5("");
    setPick6("");

    if (error) {
      setStatus({ type: "error", message: error.message });
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-6 px-26 bg-white dark:bg-black sm:items-start">
        <div className="bg-white rounded-xl p-1 flex justify-center">
          <form>
            <h2 className="font-bold text-center text-2xl p-2 mb-2 w-90">
              Submit Keepers
            </h2>
            <div className="flex-flex-col items-center">
              <div className="flex justify-center">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className={inputStyle}
                  placeholder="Team Name"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick1}
                  onChange={(e) => setPick1(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #1"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick2}
                  onChange={(e) => setPick2(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #2"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick3}
                  onChange={(e) => setPick3(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #3"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick4}
                  onChange={(e) => setPick4(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #4"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick5}
                  onChange={(e) => setPick5(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #5"
                />
              </div>
              <div className="flex justify-center">
                <input
                  type="text"
                  value={pick6}
                  onChange={(e) => setPick6(e.target.value)}
                  className={inputStyle}
                  placeholder="Keeper #6"
                />
              </div>
              <div className="flex justify-center my-3">
                <button
                  type="submit"
                  className="bg-black p-3 text-white mt-3 cursor-pointer"
                  onClick={handleSubmission}
                >
                  Submit Keepers
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
