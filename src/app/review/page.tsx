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
  type:      ReviewType;
  emoji:     string;
  description: string;
  cardClass: string;
  badgeClass: string;
  btnClass:  string;
}> = [
  {
    type:        "WEEKLY",
    emoji:       "📅",
    description: "A quick look back at the past 7 days.",
    cardClass:   "border-terracotta-100 bg-terracotta-50",
    badgeClass:  "text-terracotta-600",
    btnClass:    "bg-terracotta-500 hover:bg-terracotta-600",
  },
  {
    type:        "MONTHLY",
    emoji:       "🌿",
    description: "Reflect on patterns and progress over the month.",
    cardClass:   "border-sage-100 bg-sage-50",
    badgeClass:  "text-sage-600",
    btnClass:    "bg-sage-500 hover:bg-sage-600",
  },
  {
    type:        "YEARLY",
    emoji:       "✨",
    description: "A deep dive into the year that was.",
    cardClass:   "border-amber-200 bg-amber-50",
    badgeClass:  "text-amber-700",
    btnClass:    "bg-amber-600 hover:bg-amber-500",
  },
];

export default async function ReviewPage() {
  const now = new Date();

  const weekKey  = getPeriodKey("WEEKLY",  now);
  const monthKey = getPeriodKey("MONTHLY", now);
  const yearKey  = getPeriodKey("YEARLY",  now);

  const [weekReview, monthReview, yearReview, allReviews] = await Promise.all([
    getReviewByPeriod("WEEKLY",  weekKey),
    getReviewByPeriod("MONTHLY", monthKey),
    getReviewByPeriod("YEARLY",  yearKey),
    getRecentReviews(),
  ]);

  const currentStatus: Record<
    ReviewType,
    { review: typeof weekReview; periodKey: string }
  > = {
    WEEKLY:  { review: weekReview,  periodKey: weekKey  },
    MONTHLY: { review: monthReview, periodKey: monthKey },
    YEARLY:  { review: yearReview,  periodKey: yearKey  },
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Reviews</h1>
        <p className="mt-0.5 text-sm text-stone-400">
          Structured reflections — weekly, monthly, and yearly.
        </p>
      </div>

      {/* Current-period action cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {REVIEW_TYPES.map(({ type, emoji, description, cardClass, badgeClass, btnClass }) => {
          const { review, periodKey } = currentStatus[type];
          const periodLabel = formatPeriodLabel(type, periodKey);
          const isDone      = review !== null;
          const typeLabel   = type.charAt(0) + type.slice(1).toLowerCase();
          const href = isDone
            ? `/review/${review!.id}`
            : `/review/new/${type.toLowerCase()}`;

          return (
            <div
              key={type}
              className={`flex flex-col gap-3 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm ${cardClass}`}
            >
              <div>
                <p className={`flex items-center gap-1.5 text-sm font-semibold ${badgeClass}`}>
                  <span>{emoji}</span>
                  {typeLabel} Review
                </p>
                <p className="mt-0.5 text-xs text-stone-500">{description}</p>
              </div>
              <p className="text-xs font-medium text-stone-500">{periodLabel}</p>
              <div className="flex items-center gap-2">
                <Link
                  href={href}
                  className={`rounded-lg px-4 py-1.5 text-xs font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px ${btnClass}`}
                >
                  {isDone ? "View" : "Start"}
                </Link>
                {isDone && (
                  <Link
                    href={`/review/new/${type.toLowerCase()}`}
                    className="rounded-lg border border-cream-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-cream-50"
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
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
            Past Reviews
          </h2>
          <div className="flex flex-col gap-2.5">
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
