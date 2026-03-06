import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/review/ReviewForm";
import { getReviewByPeriod } from "@/lib/queries/reviews";
import {
  getPeriodKey,
  formatPeriodLabel,
  REVIEW_PROMPTS,
  type ReviewType,
} from "@/lib/utils/reviews";

interface Props {
  params: Promise<{ type: string }>;
}

/** Map URL slug → internal type constant */
const SLUG_TO_TYPE: Record<string, ReviewType> = {
  weekly: "WEEKLY",
  monthly: "MONTHLY",
  yearly: "YEARLY",
};

export async function generateMetadata({ params }: Props) {
  const { type: slug } = await params;
  const type = SLUG_TO_TYPE[slug];
  if (!type) return {};
  const typeLabel = type.charAt(0) + type.slice(1).toLowerCase();
  return { title: `Journal — ${typeLabel} Review` };
}

export default async function NewReviewPage({ params }: Props) {
  const { type: slug } = await params;
  const type = SLUG_TO_TYPE[slug];
  if (!type) notFound();

  const periodKey = getPeriodKey(type);
  const periodLabel = formatPeriodLabel(type, periodKey);
  const typeLabel = type.charAt(0) + type.slice(1).toLowerCase();

  // Check for an existing review for this period — if present, pre-fill the form
  const existing = await getReviewByPeriod(type, periodKey);
  const existingSections = existing
    ? (JSON.parse(existing.sections) as Array<{ prompt: string; answer: string }>)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/review"
          className="mb-3 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
        >
          ← Back to reviews
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">
          {existing ? "Edit" : "New"} {typeLabel} Review
        </h1>
        <p className="mt-0.5 text-sm text-stone-400">{periodLabel}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <ReviewForm
          type={type}
          periodKey={periodKey}
          prompts={REVIEW_PROMPTS[type]}
          existingSections={existingSections}
        />
      </div>
    </div>
  );
}
