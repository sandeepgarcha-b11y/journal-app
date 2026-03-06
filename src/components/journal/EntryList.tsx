import Link from "next/link";
import { EntryCard } from "./EntryCard";
import type { Entry } from "@/lib/queries/entries";

interface EntryListProps {
  entries: Entry[];
}

export function EntryList({ entries }: EntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 py-16 text-center">
        <p className="text-2xl mb-3">📓</p>
        <p className="text-stone-600 font-medium mb-1">No entries yet.</p>
        <p className="text-stone-400 text-sm mb-6">
          Start writing to capture your thoughts.
        </p>
        <Link
          href="/journal/new"
          className="rounded-lg bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
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
