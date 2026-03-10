"use client";

import { createGoal, updateGoal } from "@/lib/actions/goals";
import type { Goal } from "@/lib/queries/goals";
import { SubmitButton } from "@/components/common/SubmitButton";

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
      <div className="flex flex-col gap-2">
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
          className="rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-warm-sm transition placeholder:text-stone-300 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      {/* Why */}
      <div className="flex flex-col gap-2">
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
          className="w-full resize-none rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-stone-800 shadow-warm-sm transition placeholder:text-stone-300 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      {/* Target date */}
      <div className="flex flex-col gap-2">
        <label htmlFor="goal-targetDate" className="text-sm font-medium text-stone-700">
          Target date{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <input
          id="goal-targetDate"
          type="date"
          name="targetDate"
          defaultValue={targetDateValue}
          className="rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-stone-800 shadow-warm-sm transition focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      <div className="flex justify-end pt-2">
        <SubmitButton pendingText={existing ? "Saving…" : "Creating…"}>
          {existing ? "Save changes" : "Create goal"}
        </SubmitButton>
      </div>
    </form>
  );
}
