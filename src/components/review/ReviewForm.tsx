"use client";

import { saveReview } from "@/lib/actions/reviews";

interface Section {
  prompt: string;
  answer: string;
}

interface ReviewFormProps {
  type: string; // "WEEKLY" | "MONTHLY" | "YEARLY"
  periodKey: string;
  prompts: string[];
  existingSections?: Section[] | null;
}

export function ReviewForm({
  type,
  periodKey,
  prompts,
  existingSections,
}: ReviewFormProps) {
  return (
    <form action={saveReview} className="flex flex-col gap-8">
      {/* Hidden metadata — read by the server action */}
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="periodKey" value={periodKey} />

      {prompts.map((prompt, i) => {
        const savedAnswer = existingSections?.[i]?.answer ?? "";
        return (
          <div key={i} className="flex flex-col gap-2">
            {/* The server action reconstructs sections from prompt_N/answer_N pairs */}
            <input type="hidden" name={`prompt_${i}`} value={prompt} />
            <label
              htmlFor={`answer_${i}`}
              className="text-sm font-semibold text-stone-800 leading-snug"
            >
              {i + 1}. {prompt}
            </label>
            <textarea
              id={`answer_${i}`}
              name={`answer_${i}`}
              rows={4}
              defaultValue={savedAnswer}
              placeholder="Write your reflection here…"
              className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 leading-relaxed shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-300"
            />
          </div>
        );
      })}

      <div className="flex items-center justify-between border-t border-stone-100 pt-4">
        <p className="text-xs text-stone-400">
          You can save a partial draft and come back later.
        </p>
        <button
          type="submit"
          className="rounded-lg bg-stone-800 px-6 py-2 text-sm font-medium text-white transition hover:bg-stone-700 active:bg-stone-900"
        >
          Save review
        </button>
      </div>
    </form>
  );
}
