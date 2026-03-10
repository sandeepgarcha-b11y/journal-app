import Link from "next/link";
import { notFound } from "next/navigation";
import { getReviewById } from "@/lib/queries/reviews";
import { deleteReview } from "@/lib/actions/reviews";
import { formatPeriodLabel, type ReviewType } from "@/lib/utils/reviews";
import { DeleteButton } from "@/components/common/DeleteButton";

interface Props {
  params: Promise<{ id: string }>;
}

const TYPE_BADGE: Record<string, string> = {
  WEEKLY:  "bg-terracotta-50 text-terracotta-600",
  MONTHLY: "bg-sage-50 text-sage-600",
  YEARLY:  "bg-amber-50 text-amber-700",
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) return {};
  const label = formatPeriodLabel(review.type as ReviewType, review.periodKey);
  return { title: `Journal — ${label} Review` };
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;
  const review = await getReviewById(id);
  if (!review) notFound();

  const label     = formatPeriodLabel(review.type as ReviewType, review.periodKey);
  const typeLabel = review.type.charAt(0) + review.type.slice(1).toLowerCase();
  const typeSlug  = review.type.toLowerCase();
  const badgeClass = TYPE_BADGE[review.type] ?? "bg-cream-100 text-stone-600";

  const sections: Array<{ prompt: string; answer: string }> = (() => {
    try {
      return JSON.parse(review.sections);
    } catch {
      return [];
    }
  })();

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/review"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-stone-400 transition hover:text-terracotta-600"
        >
          ← Back to reviews
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-stone-900">{label}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {typeLabel}
          </span>
        </div>
        <p className="mt-1 text-xs text-stone-400">
          Saved{" "}
          {new Date(review.createdAt).toLocaleString("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {review.updatedAt > review.createdAt && (
            <>
              {" · Edited "}
              {new Date(review.updatedAt).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </>
          )}
        </p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-6 rounded-2xl border border-cream-200 bg-white p-6 shadow-warm">
        {sections.map((section, i) => (
          <div
            key={i}
            className={i > 0 ? "border-t border-cream-100 pt-5" : undefined}
          >
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">
              {i + 1}. {section.prompt}
            </p>
            {section.answer.trim() ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
                {section.answer}
              </p>
            ) : (
              <p className="text-sm italic text-stone-300">No answer provided.</p>
            )}
          </div>
        ))}
      </div>

      {/* Edit link + delete */}
      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/review/new/${typeSlug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 transition hover:text-terracotta-600"
        >
          Edit this review →
        </Link>

        <DeleteButton
          action={deleteReview}
          id={review.id}
          label="Delete review"
          confirmMessage="Delete this review? This cannot be undone."
        />
      </div>
    </div>
  );
}
