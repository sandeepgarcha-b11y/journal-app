"use client";

import { useState } from "react";
import { addCheckin } from "@/lib/actions/goals";
import { SubmitButton } from "@/components/common/SubmitButton";

interface CheckinFormProps {
  goalId: string;
}

const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Low",
  2: "Below avg",
  3: "Okay",
  4: "Good",
  5: "High",
};

export function CheckinForm({ goalId }: CheckinFormProps) {
  const [note, setNote]           = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);

  async function handleAction(formData: FormData) {
    await addCheckin(formData);
    setNote("");
    setConfidence(null);
  }

  return (
    <form action={handleAction} className="flex flex-col gap-4">
      <input type="hidden" name="goalId" value={goalId} />

      {/* Note */}
      <div className="flex flex-col gap-2">
        <label htmlFor="checkin-note" className="text-sm font-medium text-stone-700">
          Progress note
        </label>
        <textarea
          id="checkin-note"
          name="note"
          rows={3}
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How is this goal progressing?"
          className="w-full resize-none rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-warm-sm transition placeholder:text-stone-300 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      {/* Confidence — 1–5 toggle buttons */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-stone-700">
          Confidence{" "}
          <span className="font-normal text-stone-400">(optional · 1–5)</span>
        </p>
        <div className="flex gap-2">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setConfidence(confidence === n ? null : n)}
              title={CONFIDENCE_LABELS[n]}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-all duration-150 hover:-translate-y-px ${
                confidence === n
                  ? "bg-terracotta-500 text-white shadow-warm-sm"
                  : "bg-cream-100 text-stone-500 hover:bg-cream-200"
              }`}
            >
              {n}
            </button>
          ))}
          {confidence !== null && (
            <span className="self-center text-xs text-stone-400">
              — {CONFIDENCE_LABELS[confidence]}
            </span>
          )}
        </div>
        {confidence !== null && (
          <input type="hidden" name="confidence" value={confidence} />
        )}
      </div>

      <div className="flex justify-end">
        <SubmitButton pendingText="Adding…">Add check-in</SubmitButton>
      </div>
    </form>
  );
}
