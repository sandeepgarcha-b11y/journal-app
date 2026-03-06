import Link from "next/link";
import type { Goal } from "@/lib/queries/goals";
import { formatShortDate } from "@/lib/utils/dates";

interface GoalCardProps {
  goal: Goal;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  PAUSED: "bg-stone-100 text-stone-500",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function GoalCard({ goal }: GoalCardProps) {
  const badgeClass = STATUS_BADGE[goal.status] ?? "bg-stone-100 text-stone-500";
  const statusLabel = goal.status.charAt(0) + goal.status.slice(1).toLowerCase();

  const isOverdue =
    goal.targetDate !== null &&
    goal.status !== "COMPLETED" &&
    new Date(goal.targetDate) < new Date();

  return (
    <Link
      href={`/goals/${goal.id}`}
      className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:bg-stone-50"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-stone-800 leading-snug">
          {goal.title}
        </p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
        >
          {statusLabel}
        </span>
      </div>

      {goal.why && (
        <p className="text-sm leading-snug text-stone-500 line-clamp-2">
          {goal.why}
        </p>
      )}

      {goal.targetDate && (
        <p
          className={`text-xs ${
            isOverdue ? "font-medium text-red-500" : "text-stone-400"
          }`}
        >
          {isOverdue ? "Overdue · " : "Target: "}
          {formatShortDate(new Date(goal.targetDate))}
        </p>
      )}
    </Link>
  );
}
