import Link from "next/link";
import { notFound } from "next/navigation";
import { getGoalById } from "@/lib/queries/goals";
import { updateGoalStatus, deleteGoal } from "@/lib/actions/goals";
import { CheckinForm } from "@/components/goals/CheckinForm";
import { CheckinList } from "@/components/goals/CheckinList";
import { formatShortDate } from "@/lib/utils/dates";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE:    "bg-sage-50 text-sage-600",
  PAUSED:    "bg-cream-100 text-stone-500",
  COMPLETED: "bg-stone-100 text-stone-400",
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const goal = await getGoalById(id);
  if (!goal) return {};
  return { title: `Journal — ${goal.title}` };
}

export default async function GoalDetailPage({ params }: Props) {
  const { id }  = await params;
  const goal    = await getGoalById(id);
  if (!goal) notFound();

  const badgeClass  = STATUS_BADGE[goal.status] ?? "bg-cream-100 text-stone-500";
  const statusLabel = goal.status.charAt(0) + goal.status.slice(1).toLowerCase();
  const isOverdue =
    goal.targetDate !== null &&
    goal.status !== "COMPLETED" &&
    new Date(goal.targetDate) < new Date();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/goals"
          className="mb-3 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
        >
          ← Back to goals
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">{goal.title}</h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
                {statusLabel}
              </span>
            </div>
            {goal.why && (
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{goal.why}</p>
            )}
            {goal.targetDate && (
              <p
                className={`mt-1 text-xs ${
                  isOverdue ? "font-medium text-terracotta-500" : "text-stone-400"
                }`}
              >
                {isOverdue ? "Overdue · " : "Target: "}
                {formatShortDate(new Date(goal.targetDate))}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/goals/${id}/edit`}
              className="shrink-0 rounded-xl border border-cream-200 px-4 py-1.5 text-xs font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-cream-50"
            >
              Edit
            </Link>
            <form
              action={deleteGoal}
              onSubmit={(e) => {
                if (!confirm("Delete this goal and all its check-ins? This cannot be undone.")) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="id" value={goal.id} />
              <button
                type="submit"
                className="shrink-0 rounded-xl border border-transparent px-4 py-1.5 text-xs font-medium text-stone-400 transition-all duration-150 hover:bg-terracotta-50 hover:text-terracotta-600"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Status transitions */}
      <div className="flex flex-wrap gap-2">
        {goal.status !== "ACTIVE" && (
          <form action={updateGoalStatus}>
            <input type="hidden" name="id" value={goal.id} />
            <input type="hidden" name="status" value="ACTIVE" />
            <button
              type="submit"
              className="rounded-lg bg-sage-50 px-4 py-1.5 text-xs font-medium text-sage-600 transition-all duration-150 hover:-translate-y-px hover:bg-sage-100"
            >
              Mark active
            </button>
          </form>
        )}
        {goal.status === "ACTIVE" && (
          <form action={updateGoalStatus}>
            <input type="hidden" name="id" value={goal.id} />
            <input type="hidden" name="status" value="PAUSED" />
            <button
              type="submit"
              className="rounded-lg bg-cream-100 px-4 py-1.5 text-xs font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-cream-200"
            >
              Pause
            </button>
          </form>
        )}
        {goal.status !== "COMPLETED" && (
          <form action={updateGoalStatus}>
            <input type="hidden" name="id" value={goal.id} />
            <input type="hidden" name="status" value="COMPLETED" />
            <button
              type="submit"
              className="rounded-lg bg-stone-100 px-4 py-1.5 text-xs font-medium text-stone-600 transition-all duration-150 hover:-translate-y-px hover:bg-stone-200"
            >
              Mark complete
            </button>
          </form>
        )}
      </div>

      {/* Add check-in — hidden for completed goals */}
      {goal.status !== "COMPLETED" && (
        <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-warm-sm">
          <h2 className="mb-4 text-base font-semibold text-stone-800">Add check-in</h2>
          <CheckinForm goalId={goal.id} />
        </div>
      )}

      {/* Check-in history */}
      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Check-ins ({goal.checkins.length})
        </h2>
        <CheckinList checkins={goal.checkins} />
      </div>
    </div>
  );
}
