"use client";

import { useState } from "react";
import { logMood } from "@/lib/actions/mood";
import { todayDateString } from "@/lib/utils/dates";
import type { MoodLog } from "@/lib/queries/mood";

const SCORE_LABELS: Record<number, string> = {
  1: "Terrible",
  2: "Very bad",
  3: "Bad",
  4: "Below average",
  5: "Okay",
  6: "Above average",
  7: "Good",
  8: "Very good",
  9: "Great",
  10: "Excellent",
};

// Maps score to a Tailwind text colour class
function scoreColour(score: number): string {
  if (score <= 3) return "text-red-500";
  if (score <= 5) return "text-amber-500";
  if (score <= 7) return "text-yellow-500";
  return "text-emerald-500";
}

interface MoodFormProps {
  existing: MoodLog | null;
}

export function MoodForm({ existing }: MoodFormProps) {
  const [score, setScore] = useState(existing?.score ?? 5);
  const [note, setNote] = useState(existing?.note ?? "");
  const today = todayDateString();
  const isEdit = existing !== null;

  // Wrap the server action so we can clear the note field after a successful save.
  async function handleAction(formData: FormData) {
    await logMood(formData);
    setNote("");
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-stone-800">
          {isEdit ? "Update today's mood" : "Log today's mood"}
        </h2>
        <span className={`text-2xl font-bold tabular-nums ${scoreColour(score)}`}>
          {score}
          <span className="ml-1 text-sm font-normal text-stone-400">/ 10</span>
        </span>
      </div>

      <form action={handleAction} className="flex flex-col gap-5">
        <input type="hidden" name="date" value={today} />

        {/* Score slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>1 — Terrible</span>
            <span className={`font-medium ${scoreColour(score)}`}>
              {SCORE_LABELS[score]}
            </span>
            <span>10 — Excellent</span>
          </div>
          <input
            type="range"
            name="score"
            min={1}
            max={10}
            step={1}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-stone-800"
          />
          {/* Score pip row */}
          <div className="flex justify-between px-0.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setScore(n)}
                className={`h-6 w-6 rounded-full text-xs font-medium transition ${
                  n === score
                    ? "bg-stone-800 text-white"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Optional note */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mood-note"
            className="text-sm font-medium text-stone-700"
          >
            Note{" "}
            <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <textarea
            id="mood-note"
            name="note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's influencing your mood today?"
            className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 leading-relaxed shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-stone-800 px-6 py-2 text-sm font-medium text-white transition hover:bg-stone-700 active:bg-stone-900"
          >
            {isEdit ? "Update" : "Save mood"}
          </button>
        </div>
      </form>
    </div>
  );
}
