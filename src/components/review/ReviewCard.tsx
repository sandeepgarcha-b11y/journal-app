import Link from "next/link";
import type { Review } from "@/lib/queries/reviews";
import { formatPeriodLabel, type ReviewType } from "@/lib/utils/reviews";

interface ReviewCardProps {
  review: Review;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  WEEKLY:  { label: "Weekly",  className: "bg-terracotta-50 text-terracotta-600" },
  MONTHLY: { label: "Monthly", className: "bg-sage-50 text-sage-600"             },
  YEARLY:  { label: "Yearly",  className: "bg-amber-50 text-amber-700"           },
};

export function ReviewCard({ review }: ReviewCardProps) {
  const badge = TYPE_BADGE[review.type] ?? {
    label:     review.type,
    className: "bg-cream-100 text-stone-600",
  };

  const periodLabel = formatPeriodLabel(
    review.type as ReviewType,
    review.periodKey,
  );

  const sections: Array<{ prompt: string; answer: string }> = (() => {
    try {
      return JSON.parse(review.sections);
    } catch {
      return [];
    }
  })();

  const firstAnswer = sections.find((s) => s.answer.trim())?.answer ?? "";
  const excerpt =
    firstAnswer.length > 110 ? firstAnswer.substring(0, 110) + "…" : firstAnswer;

  return (
    <Link
      href={`/review/${review.id}`}
      className="flex items-start gap-4 rounded-2xl border border-cream-200 bg-white p-4 shadow-warm-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm"
    >
      <span
        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-stone-800">{periodLabel}</p>
        {excerpt && (
          <p className="mt-0.5 text-sm leading-snug text-stone-500 line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
