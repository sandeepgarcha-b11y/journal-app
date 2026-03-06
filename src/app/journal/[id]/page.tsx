import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntryById } from "@/lib/queries/entries";
import { formatEntryDate } from "@/lib/utils/dates";

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
    <div>
      {/* Back link */}
      <Link
        href="/journal"
        className="mb-4 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
      >
        ← Back to journal
      </Link>

      {/* Entry card */}
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="mb-1 text-xs font-medium tracking-wide text-stone-400 uppercase">
          {formatEntryDate(entry.date)}
        </p>

        {prompt && (
          <p className="mb-4 text-base font-medium text-stone-700 border-b border-stone-100 pb-4">
            {prompt}
          </p>
        )}

        <p className="whitespace-pre-wrap text-stone-800 leading-relaxed">
          {entry.content}
        </p>
      </div>

      {/* Meta */}
      <p className="mt-4 text-xs text-stone-400">
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
    </div>
  );
}
