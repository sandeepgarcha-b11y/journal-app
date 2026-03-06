import Link from "next/link";
import { EntryForm } from "@/components/journal/EntryForm";
import { getTodayEntry } from "@/lib/queries/entries";
import { formatEntryDate, todayDateString, toLocalMidnightUTC } from "@/lib/utils/dates";

export const metadata = {
  title: "Journal — New Entry",
};

export default async function NewEntryPage() {
  // Check if today already has an entry
  const existingEntry = await getTodayEntry();
  const todayFormatted = formatEntryDate(toLocalMidnightUTC(todayDateString()));

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <Link
          href="/journal"
          className="mb-3 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
        >
          ← Back to journal
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">New Entry</h1>
        <p className="mt-0.5 text-sm text-stone-400">{todayFormatted}</p>
      </div>

      {/* Guard: already wrote today */}
      {existingEntry ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-medium text-amber-800">
            You already have an entry for today.
          </p>
          <p className="mt-1 text-sm text-amber-600">
            Writing a second one will create an additional entry for the same
            day.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={`/journal/${existingEntry.id}`}
              className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
            >
              View today&apos;s entry
            </Link>
            <Link
              href="/journal"
              className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
            >
              Back to journal
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <EntryForm />
        </div>
      )}
    </div>
  );
}
