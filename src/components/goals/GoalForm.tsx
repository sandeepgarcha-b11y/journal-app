"use client";

import { createGoal, updateGoal } from "@/lib/actions/goals";
import type { Goal } from "@/lib/queries/goals";

interface GoalFormProps {
  /** Pass an existing goal to put the form in edit mode. */
  existing?: Goal | null;
}

export function GoalForm({ existing }: GoalFormProps) {
  const action = existing ? updateGoal : createGoal;

  // Format UTC midnight Date → "YYYY-MM-DD" for the date input
  const targetDateValue = existing?.targetDate
    ? new Date(existing.targetDate).toISOString().split("T")[0]
    : "";

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Hidden ID in edit mode */}
      {existing && <input type="hidden" name="id" value={existing.id} />}

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-title" className="text-sm font-medium text-stone-700">
          Goal{" "}
          <span className="font-normal text-stone-400">(required)</span>
        </label>
        <input
          id="goal-title"
          type="text"
          name="title"
          required
          defaultValue={existing?.title ?? ""}
          placeholder="What do you want to achieve?"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-300"
        />
      </div>

      {/* Why */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-why" className="text-sm font-medium text-stone-700">
          Why{" "}
          <span className="font-normal text-stone-400">(optional — your motivation)</span>
        </label>
        <textarea
          id="goal-why"
          name="why"
          rows={3}
          defaultValue={existing?.why ?? ""}
          placeholder="What's driving you to achieve this?"
          className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 leading-relaxed shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-300"
        />
      </div>

      {/* Target date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="goal-targetDate" className="text-sm font-medium text-stone-700">
          Target date{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <input
          id="goal-targetDate"
          type="date"
          name="targetDate"
          defaultValue={targetDateValue}
          className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="rounded-lg bg-stone-800 px-6 py-2 text-sm font-medium text-white transition hover:bg-stone-700 active:bg-stone-900"
        >
          {existing ? "Save changes" : "Create goal"}
        </button>
      </div>
    </form>
  );
}
