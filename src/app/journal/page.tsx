import Link from "next/link";
import { getEntries } from "@/lib/queries/entries";
import { EntryList } from "@/components/journal/EntryList";

export const metadata = {
  title: "Journal — All Entries",
};

export default async function JournalPage() {
  const entries = await getEntries();

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Journal</h1>
          <p className="mt-0.5 text-sm text-stone-400">
            {entries.length === 0
              ? "Nothing written yet"
              : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
          </p>
        </div>

        <Link
          href="/journal/new"
          className="rounded-lg bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          New entry
        </Link>
      </div>

      {/* Entry list */}
      <EntryList entries={entries} />
    </div>
  );
}
