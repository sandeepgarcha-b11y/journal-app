import Link from "next/link";
import { getRecentReviews, getReviewByPeriod } from "@/lib/queries/reviews";
import { ReviewCard } from "@/components/review/ReviewCard";
import {
  getPeriodKey,
  formatPeriodLabel,
  type ReviewType,
} from "@/lib/utils/reviews";

export const metadata = { title: "Journal — Reviews" };

const REVIEW_TYPES: Array<{
  type: ReviewType;
  description: string;
  /** Tailwind classes for the card accent and button */
  cardClass: string;
  btnClass: string;
  badgeClass: string;
}> = [
  {
    type: "WEEKLY",
    description: "A quick look back at the past 7 days.",
    cardClass: "border-blue-200 bg-blue-50",
    btnClass: "bg-blue-600 hover:bg-blue-500",
    badgeClass: "text-blue-700",
  },
  {
    type: "MONTHLY",
    description: "Reflect on patterns and progress over the month.",
    cardClass: "border-violet-200 bg-violet-50",
    btnClass: "bg-violet-600 hover:bg-violet-500",
    badgeClass: "text-violet-700",
  },
  {
    type: "YEARLY",
    description: "A deep dive into the year that was.",
    cardClass: "border-amber-200 bg-amber-50",
    btnClass: "bg-amber-600 hover:bg-amber-500",
    badgeClass: "text-amber-700",
  },
];

export default async function ReviewPage() {
  const now = new Date();

  const weekKey = getPeriodKey("WEEKLY", now);
  const monthKey = getPeriodKey("MONTHLY", now);
  const yearKey = getPeriodKey("YEARLY", now);

  const [weekReview, monthReview, yearReview, allReviews] = await Promise.all([
    getReviewByPeriod("WEEKLY", weekKey),
    getReviewByPeriod("MONTHLY", monthKey),
    getReviewByPeriod("YEARLY", yearKey),
    getRecentReviews(),
  ]);

  const currentStatus: Record<
    ReviewType,
    { review: typeof weekReview; periodKey: string }
  > = {
    WEEKLY: { review: weekReview, periodKey: weekKey },
    MONTHLY: { review: monthReview, periodKey: monthKey },
    YEARLY: { review: yearReview, periodKey: yearKey },
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Reviews</h1>
        <p className="mt-0.5 text-sm text-stone-400">
          Structured reflections — weekly, monthly, and yearly.
        </p>
      </div>

      {/* Current-period action cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {REVIEW_TYPES.map(({ type, description, cardClass, btnClass, badgeClass }) => {
          const { review, periodKey } = currentStatus[type];
          const periodLabel = formatPeriodLabel(type, periodKey);
          const isDone = review !== null;
          const typeLabel = type.charAt(0) + type.slice(1).toLowerCase();
          const href = isDone
            ? `/review/${review!.id}`
            : `/review/new/${type.toLowerCase()}`;

          return (
            <div
              key={type}
              className={`flex flex-col gap-3 rounded-xl border p-5 ${cardClass}`}
            >
              <div>
                <p className={`text-sm font-semibold ${badgeClass}`}>
                  {typeLabel} Review
                </p>
                <p className="mt-0.5 text-xs text-stone-500">{description}</p>
              </div>
              <p className="text-xs font-medium text-stone-600">{periodLabel}</p>
              <div className="flex items-center gap-2">
                <Link
                  href={href}
                  className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white transition ${btnClass}`}
                >
                  {isDone ? "View" : "Start"}
                </Link>
                {isDone && (
                  <Link
                    href={`/review/new/${type.toLowerCase()}`}
                    className="rounded-lg border border-stone-300 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
                  >
                    Edit
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* History */}
      {allReviews.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-400">
            Past Reviews
          </h2>
          <div className="flex flex-col gap-3">
            {allReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-stone-400">
          No reviews yet — start one above.
        </p>
      )}
    </div>
  );
}
