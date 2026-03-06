import Link from "next/link";
import { formatEntryDate } from "@/lib/utils/dates";
import type { Entry } from "@/lib/queries/entries";

const TYPE_LABEL: Record<string, string> = {
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

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

  const typeLabel = entry.type !== "DAILY" ? TYPE_LABEL[entry.type] : null;

  return (
    <Link
      href={`/journal/${entry.id}`}
      className="block rounded-2xl border border-cream-200 bg-white p-5 shadow-warm-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {formatEntryDate(entry.date)}
        </p>
        {typeLabel && (
          <span className="rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
            {typeLabel}
          </span>
        )}
      </div>

      {prompt && (
        <p className="mb-1.5 text-sm font-medium text-stone-700 line-clamp-1">
          {prompt}
        </p>
      )}

      <p className="text-sm leading-relaxed text-stone-500 line-clamp-3">
        {excerpt}
      </p>
    </Link>
  );
}
