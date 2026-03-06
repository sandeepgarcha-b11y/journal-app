"use client";

import { useRef } from "react";
import { DAILY_PROMPTS } from "@/lib/utils/prompts";
import { createEntry } from "@/lib/actions/entries";
import { todayDateString } from "@/lib/utils/dates";

export function EntryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const today = todayDateString();

  return (
    <form
      ref={formRef}
      action={createEntry}
      className="flex flex-col gap-5"
    >
      {/* Hidden date field — today's local date as YYYY-MM-DD */}
      <input type="hidden" name="date" value={today} />

      {/* Prompt picker */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="prompt"
          className="text-sm font-medium text-stone-700"
        >
          Choose a starter prompt{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <select
          id="prompt"
          name="prompt"
          className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-700 shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200"
          defaultValue=""
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
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="content"
          className="text-sm font-medium text-stone-700"
        >
          Your entry
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          placeholder="Start writing…"
          className="w-full resize-none rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm text-stone-800 leading-relaxed shadow-sm transition focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-300"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <a
          href="/journal"
          className="rounded-lg border border-stone-300 px-5 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="rounded-lg bg-stone-800 px-6 py-2 text-sm font-medium text-white transition hover:bg-stone-700 active:bg-stone-900"
        >
          Save entry
        </button>
      </div>
    </form>
  );
}
