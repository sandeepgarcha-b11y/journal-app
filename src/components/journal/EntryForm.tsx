"use client";

import { useRef } from "react";
import { DAILY_PROMPTS } from "@/lib/utils/prompts";
import { createEntry } from "@/lib/actions/entries";
import { todayDateString } from "@/lib/utils/dates";
import { SubmitButton } from "@/components/common/SubmitButton";

export function EntryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const today = todayDateString();

  return (
    <form ref={formRef} action={createEntry} className="flex flex-col gap-6">
      {/* Hidden date field — today's local date as YYYY-MM-DD */}
      <input type="hidden" name="date" value={today} />

      {/* Prompt picker */}
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium text-stone-700">
          Choose a starter prompt{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <select
          id="prompt"
          name="prompt"
          defaultValue=""
          className="w-full rounded-xl border border-cream-200 bg-white px-4 py-2.5 text-sm text-stone-700 shadow-warm-sm transition focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        >
          <option value="">— No prompt, just write —</option>
          {DAILY_PROMPTS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Content textarea */}
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium text-stone-700">
          Your entry
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          placeholder="Start writing…"
          className="w-full resize-none rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-warm-sm transition placeholder:text-stone-300 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <a
          href="/journal"
          className="rounded-xl border border-cream-200 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-cream-50"
        >
          Cancel
        </a>
        <SubmitButton>Save entry</SubmitButton>
      </div>
    </form>
  );
}
