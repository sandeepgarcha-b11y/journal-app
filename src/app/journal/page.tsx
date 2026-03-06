import Link from "next/link";
import { getEntries } from "@/lib/queries/entries";
import { getDailyAffirmation } from "@/lib/queries/affirmations";
import { JournalSearch } from "@/components/journal/JournalSearch";
import { DailyAffirmationCard } from "@/components/affirmations/DailyAffirmationCard";

export const metadata = {
  title: "Journal — All Entries",
};

export default async function JournalPage() {
  const [entries, affirmation] = await Promise.all([
    getEntries(),
    getDailyAffirmation(),
  ]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Daily affirmation */}
      {affirmation && <DailyAffirmationCard affirmation={affirmation} />}

      {/* Page header */}
      <div className="flex items-center justify-between">
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
          className="rounded-xl bg-terracotta-500 px-5 py-2 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm active:translate-y-0"
        >
          New entry
        </Link>
      </div>

      {/* Searchable entry list */}
      <JournalSearch entries={entries} />
    </div>
  );
}
