import Link from "next/link";
import { EntryForm } from "@/components/journal/EntryForm";
import { getTodayEntry } from "@/lib/queries/entries";
import { formatEntryDate, todayDateString, toLocalMidnightUTC } from "@/lib/utils/dates";

export const metadata = {
  title: "Journal — New Entry",
};

export default async function NewEntryPage() {
  const existingEntry = await getTodayEntry();
  const todayFormatted = formatEntryDate(toLocalMidnightUTC(todayDateString()));

  return (
    <div className="animate-fade-in">
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
        <div className="rounded-2xl border border-terracotta-100 bg-terracotta-50 p-5">
          <p className="font-medium text-terracotta-700">
            You already have an entry for today.
          </p>
          <p className="mt-1 text-sm text-terracotta-600">
            Writing a second one will create an additional entry for the same day.
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={`/journal/${existingEntry.id}`}
              className="rounded-xl bg-terracotta-500 px-4 py-2 text-sm font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600"
            >
              View today&apos;s entry
            </Link>
            <Link
              href="/journal"
              className="rounded-xl border border-terracotta-200 px-4 py-2 text-sm font-medium text-terracotta-600 transition-all duration-150 hover:bg-terracotta-50"
            >
              Back to journal
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-warm-sm">
          <EntryForm />
        </div>
      )}
    </div>
  );
}
