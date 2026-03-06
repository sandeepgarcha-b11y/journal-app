import Link from "next/link";
import { formatEntryDate } from "@/lib/utils/dates";
import type { Entry } from "@/lib/queries/entries";

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const prompt = (() => {
    if (!entry.prompts) return null;
    try {
      const parsed = JSON.parse(entry.prompts) as { prompt: string }[];
      return parsed[0]?.prompt ?? null;
    } catch {
      return null;
    }
  })();

  const excerpt =
    entry.content.length > 160
      ? entry.content.slice(0, 160).trimEnd() + "…"
      : entry.content;

  return (
    <Link
      href={`/journal/${entry.id}`}
      className="block group rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow-md"
    >
      <p className="mb-1 text-xs font-medium tracking-wide text-stone-400 uppercase">
        {formatEntryDate(entry.date)}
      </p>

      {prompt && (
        <p className="mb-2 text-sm font-medium text-stone-600 line-clamp-1">
          {prompt}
        </p>
      )}

      <p className="text-stone-700 text-sm leading-relaxed line-clamp-3">
        {excerpt}
      </p>
    </Link>
  );
}
