import Link from "next/link";
import type { Review } from "@/lib/queries/reviews";
import { formatPeriodLabel, type ReviewType } from "@/lib/utils/reviews";

interface ReviewCardProps {
  review: Review;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  WEEKLY: { label: "Weekly", className: "bg-blue-100 text-blue-700" },
  MONTHLY: { label: "Monthly", className: "bg-violet-100 text-violet-700" },
  YEARLY: { label: "Yearly", className: "bg-amber-100 text-amber-700" },
};

export function ReviewCard({ review }: ReviewCardProps) {
  const badge = TYPE_BADGE[review.type] ?? {
    label: review.type,
    className: "bg-stone-100 text-stone-600",
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
      className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:bg-stone-50"
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
