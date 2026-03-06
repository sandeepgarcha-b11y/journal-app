"use client";

import Link from "next/link";
import { saveReview } from "@/lib/actions/reviews";

interface Section {
  prompt: string;
  answer: string;
}

interface ActiveGoal {
  id: string;
  title: string;
}

interface ReviewFormProps {
  type: string; // "WEEKLY" | "MONTHLY" | "YEARLY"
  periodKey: string;
  prompts: string[];
  existingSections?: Section[] | null;
  /** Passed only for weekly reviews — shows active goals as a reference panel. */
  activeGoals?: ActiveGoal[];
}

export function ReviewForm({
  type,
  periodKey,
  prompts,
  existingSections,
  activeGoals,
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

      {/* Weekly review: active goals reference panel */}
      {type === "WEEKLY" && activeGoals && activeGoals.length > 0 && (
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="mb-0.5 text-sm font-semibold text-stone-700">
            Active goals
          </p>
          <p className="mb-3 text-xs text-stone-400">
            How did each goal go this week? Add a check-in after saving your
            review.
          </p>
          <div className="flex flex-col gap-2">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center justify-between gap-3"
              >
                <p className="text-sm text-stone-600">{goal.title}</p>
                <Link
                  href={`/goals/${goal.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs font-medium text-stone-500 underline decoration-stone-300 transition hover:text-stone-900"
                >
                  Add check-in ↗
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

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
