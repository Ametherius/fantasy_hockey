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
  const inputClass =
    "border-2 border-black rounded-lg p-2 w-full min-w-0 text-black text-base";
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
      <div className="w-full max-w-xl px-2 py-4 text-center sm:p-6">
        <p className="text-base sm:text-lg break-words">
          No keeper submissions found for team{" "}
          <strong>{teamName || "(no team name on profile)"}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 max-w-2xl flex-col gap-6 py-2 sm:gap-8 sm:py-6">
      <div className="px-1 text-center">
        <h2 className="text-xl font-bold sm:text-2xl">My Keepers</h2>
        <p className="mt-1 break-words text-sm text-gray-600">
          Team: {teamName}
        </p>
        {!canDelete && (
          <p className="mt-2 text-xs text-gray-500">
            Delete is available when you have more than one submission.
          </p>
        )}
      </div>

      {message && (
        <p
          className={`px-1 text-center text-sm font-semibold sm:text-base ${
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
            className="min-w-0 rounded-xl border-2 border-black bg-white p-3 sm:p-4 md:p-6"
          >
            <div className="mb-4 flex flex-col gap-3 border-b-2 border-black pb-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold sm:text-xl">
                Submission {index + 1}
              </h3>
              {canDelete && (
                <button
                  type="button"
                  className="w-full cursor-pointer border-2 border-black bg-white px-3 py-2 text-black hover:bg-black hover:text-white sm:w-auto sm:py-1"
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
                onChange={(e) => updateDraft(k.id, "team_name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
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
            </div>

            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="w-full cursor-pointer bg-black px-6 py-2.5 text-white hover:border-2 hover:border-black hover:bg-white hover:text-black sm:w-auto"
                disabled="true"
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
