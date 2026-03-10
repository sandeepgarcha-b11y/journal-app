"use client";

import { DAILY_PROMPTS } from "@/lib/utils/prompts";
import { updateEntry } from "@/lib/actions/entries";
import { SubmitButton } from "@/components/common/SubmitButton";
import type { Entry } from "@/lib/queries/entries";

interface Props {
  entry: Entry;
}

export function EntryEditForm({ entry }: Props) {
  // Extract the saved prompt from the stored JSON (if any)
  const existingPrompt = (() => {
    if (!entry.prompts) return "";
    try {
      const parsed = JSON.parse(entry.prompts) as { prompt: string }[];
      return parsed[0]?.prompt ?? "";
    } catch {
      return "";
    }
  })();

  return (
    <form action={updateEntry} className="flex flex-col gap-6">
      {/* Hidden entry ID — read by the server action */}
      <input type="hidden" name="id" value={entry.id} />

      {/* Prompt picker */}
      <div className="flex flex-col gap-2">
        <label htmlFor="prompt" className="text-sm font-medium text-stone-700">
          Starter prompt{" "}
          <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <select
          id="prompt"
          name="prompt"
          defaultValue={existingPrompt}
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
          defaultValue={entry.content}
          className="w-full resize-none rounded-xl border border-cream-200 bg-white px-4 py-3 text-sm leading-relaxed text-stone-800 shadow-warm-sm transition placeholder:text-stone-300 focus:border-terracotta-300 focus:outline-none focus:ring-2 focus:ring-terracotta-100"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-1">
        <a
          href={`/journal/${entry.id}`}
          className="rounded-xl border border-cream-200 bg-white px-5 py-2 text-sm font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-cream-50"
        >
          Cancel
        </a>
        <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
      </div>
    </form>
  );
}
