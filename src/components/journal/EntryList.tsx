import Link from "next/link";
import { EntryCard } from "./EntryCard";
import type { Entry } from "@/lib/queries/entries";

interface EntryListProps {
  entries: Entry[];
}

export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-cream-200 bg-white py-16 text-center shadow-warm-sm">
        <p className="mb-3 text-2xl">📓</p>
        <p className="mb-1 font-medium text-stone-700">No entries yet.</p>
        <p className="mb-6 text-sm text-stone-400">
          Start writing to capture your thoughts.
        </p>
        <Link
          href="/journal/new"
          className="rounded-xl bg-terracotta-500 px-5 py-2 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm"
        >
          Write your first entry
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
