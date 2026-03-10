import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntryById } from "@/lib/queries/entries";
import { deleteEntry } from "@/lib/actions/entries";
import { formatEntryDate } from "@/lib/utils/dates";
import { DeleteButton } from "@/components/common/DeleteButton";

export const metadata = {
  title: "Journal — Entry",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = await getEntryById(id);

  if (!entry) notFound();

  const prompt = (() => {
    if (!entry.prompts) return null;
    try {
      const parsed = JSON.parse(entry.prompts) as { prompt: string }[];
      return parsed[0]?.prompt ?? null;
    } catch {
      return null;
    }
  })();

  return (
    <div className="animate-fade-in">
      {/* Back link */}
      <Link
        href="/journal"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-400 transition hover:text-terracotta-600"
      >
        ← Back to journal
      </Link>

      {/* Entry card */}
      <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-warm">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-terracotta-500">
          {formatEntryDate(entry.date)}
        </p>

        {prompt && (
          <p className="mb-4 border-b border-cream-100 pb-4 text-base font-medium text-stone-700">
            {prompt}
          </p>
        )}

        <p className="whitespace-pre-wrap leading-relaxed text-stone-800">
          {entry.content}
        </p>
      </div>

      {/* Meta + actions */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-stone-400">
          Written{" "}
          {new Date(entry.createdAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {entry.updatedAt > entry.createdAt && (
            <>
              {" · Edited "}
              {new Date(entry.updatedAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </>
          )}
        </p>

        <DeleteButton
          action={deleteEntry}
          id={entry.id}
          label="Delete entry"
          confirmMessage="Delete this entry? This cannot be undone."
        />
      </div>
    </div>
  );
}
