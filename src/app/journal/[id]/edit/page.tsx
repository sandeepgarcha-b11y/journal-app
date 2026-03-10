import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntryById } from "@/lib/queries/entries";
import { EntryEditForm } from "@/components/journal/EntryEditForm";
import { formatEntryDate } from "@/lib/utils/dates";

export const metadata = { title: "Journal — Edit entry" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: Props) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) notFound();

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <Link
        href={`/journal/${id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-stone-400 transition hover:text-terracotta-600"
      >
        ← Back to entry
      </Link>

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-terracotta-500">
          {formatEntryDate(entry.date)}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-900">
          Edit entry
        </h1>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-warm">
        <EntryEditForm entry={entry} />
      </div>
    </div>
  );
}
