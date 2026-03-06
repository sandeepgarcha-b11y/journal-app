import Link from "next/link";
import { notFound } from "next/navigation";
import { getGoalById } from "@/lib/queries/goals";
import { updateGoalStatus } from "@/lib/actions/goals";
import { CheckinForm } from "@/components/goals/CheckinForm";
import { CheckinList } from "@/components/goals/CheckinList";
import { formatShortDate } from "@/lib/utils/dates";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-stone-100 text-stone-500",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const goal = await getGoalById(id);
  if (!goal) return {};
  return { title: `Journal — ${goal.title}` };
}

export default async function GoalDetailPage({ params }: Props) {
  const { id } = await params;
  const goal = await getGoalById(id);
  if (!goal) notFound();

  const badgeClass = STATUS_BADGE[goal.status] ?? "bg-stone-100 text-stone-500";
  const statusLabel = goal.status.charAt(0) + goal.status.slice(1).toLowerCase();
  const isOverdue =
    goal.targetDate !== null &&
    goal.status !== "COMPLETED" &&
    new Date(goal.targetDate) < new Date();

  return (
    <div className="flex flex-col gap-6">
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
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
              >
                {statusLabel}
              </span>
            </div>
            {goal.why && (
              <p className="mt-1 text-sm leading-relaxed text-stone-500">{goal.why}</p>
            )}
            {goal.targetDate && (
              <p
                className={`mt-1 text-xs ${
                  isOverdue ? "font-medium text-red-500" : "text-stone-400"
                }`}
              >
                {isOverdue ? "Overdue · " : "Target: "}
                {formatShortDate(new Date(goal.targetDate))}
              </p>
            )}
          </div>

          <Link
            href={`/goals/${id}/edit`}
            className="shrink-0 rounded-lg border border-stone-300 px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-50"
          >
            Edit
          </Link>
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
              className="rounded-lg bg-emerald-100 px-4 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-200"
            >
              Mark active
            </button>
          </form>
        )}
        {/* Pause is only meaningful when ACTIVE */}
        {goal.status === "ACTIVE" && (
          <form action={updateGoalStatus}>
            <input type="hidden" name="id" value={goal.id} />
            <input type="hidden" name="status" value="PAUSED" />
            <button
              type="submit"
              className="rounded-lg bg-stone-100 px-4 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-200"
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
              className="rounded-lg bg-blue-100 px-4 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-200"
            >
              Mark complete
            </button>
          </form>
        )}
      </div>

      {/* Add check-in — hidden for completed goals */}
      {goal.status !== "COMPLETED" && (
        <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-stone-800">Add check-in</h2>
          <CheckinForm goalId={goal.id} />
        </div>
      )}

      {/* Check-in history */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-400">
          Check-ins ({goal.checkins.length})
        </h2>
        <CheckinList checkins={goal.checkins} />
      </div>
    </div>
  );
}
