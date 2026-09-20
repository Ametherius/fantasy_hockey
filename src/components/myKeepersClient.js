"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PICK_FIELDS = ["pick1", "pick2", "pick3", "pick4", "pick5", "pick6"];

export default function MyKeepersClient({
  keepers: initialKeepers,
  teamName,
  userId,
}) {
  const supabase = createClient();
  const router = useRouter();
  const [keepers, setKeepers] = useState(initialKeepers ?? []);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(
      (initialKeepers ?? []).map((k) => [
        k.id,
        {
          team_name: k.team_name ?? "",
          pick1: k.pick1 ?? "",
          pick2: k.pick2 ?? "",
          pick3: k.pick3 ?? "",
          pick4: k.pick4 ?? "",
          pick5: k.pick5 ?? "",
          pick6: k.pick6 ?? "",
        },
      ]),
    ),
  );
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState(null);

  const canDelete = keepers.length > 1;
  const inputClass = "border-2 border-black rounded-lg p-2 w-full text-black";
  const formGroup = "flex flex-col gap-1 mb-3";

  function updateDraft(id, field, value) {
    setDrafts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  async function handleSave(id) {
    const draft = drafts[id];
    if (!draft) return;

    setSavingId(id);
    setMessage(null);

    const payload = {
      team_name: draft.team_name.trim() || null,
      pick1: draft.pick1.trim() || null,
      pick2: draft.pick2.trim() || null,
      pick3: draft.pick3.trim() || null,
      pick4: draft.pick4.trim() || null,
      pick5: draft.pick5.trim() || null,
      pick6: draft.pick6.trim() || null,
      user_id: userId,
    };

    const { error } = await supabase
      .from("keepers")
      .update(payload)
      .eq("id", id);

    setSavingId(null);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setKeepers((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...payload } : k)),
    );
    setMessage({ type: "success", text: "Keepers saved." });
    router.refresh();
  }

  async function handleDelete(id) {
    if (!canDelete) return;
    if (!window.confirm("Delete this keeper submission?")) return;

    setDeletingId(id);
    setMessage(null);

    const { error } = await supabase.from("keepers").delete().eq("id", id);

    setDeletingId(null);

    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }

    setKeepers((prev) => prev.filter((k) => k.id !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setMessage({ type: "success", text: "Keeper submission deleted." });
    router.refresh();
  }

  if (!keepers.length) {
    return (
      <div className="w-full max-w-xl p-6 text-center">
        <p className="text-lg">
          No keeper submissions found for team{" "}
          <strong>{teamName || "(no team name on profile)"}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-8 py-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">My Keepers</h2>
        <p className="text-sm text-gray-600 mt-1">Team: {teamName}</p>
        {!canDelete && (
          <p className="text-xs text-gray-500 mt-2">
            Delete is available when you have more than one submission.
          </p>
        )}
      </div>

      {message && (
        <p
          className={`text-center font-semibold ${
            message.type === "error" ? "text-red-600" : "text-green-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {keepers.map((k, index) => {
        const draft = drafts[k.id] ?? {};
        return (
          <div
            key={k.id}
            className="border-2 border-black rounded-xl p-4 bg-white"
          >
            <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
              <h3 className="font-bold text-xl">
                Submission {index + 1}
              </h3>
              {canDelete && (
                <button
                  type="button"
                  className="bg-white border-2 border-black text-black px-3 py-1 hover:bg-black hover:text-white cursor-pointer"
                  disabled={deletingId === k.id}
                  onClick={() => handleDelete(k.id)}
                >
                  {deletingId === k.id ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>

            <div className={formGroup}>
              <label>Team Name</label>
              <input
                type="text"
                className={inputClass}
                value={draft.team_name ?? ""}
                onChange={(e) =>
                  updateDraft(k.id, "team_name", e.target.value)
                }
              />
            </div>

            {PICK_FIELDS.map((field, i) => (
              <div key={field} className={formGroup}>
                <label>Pick {i + 1}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={draft[field] ?? ""}
                  onChange={(e) => updateDraft(k.id, field, e.target.value)}
                  placeholder="Round - Player Name"
                />
              </div>
            ))}

            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="bg-black text-white px-6 py-2 cursor-pointer hover:bg-white hover:text-black hover:border-2 hover:border-black"
                disabled={savingId === k.id}
                onClick={() => handleSave(k.id)}
              >
                {savingId === k.id ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
