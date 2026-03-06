import Link from "next/link";
import { getGoalsByStatus } from "@/lib/queries/goals";
import { GoalCard } from "@/components/goals/GoalCard";

export const metadata = { title: "Journal — Goals" };

export default async function GoalsPage() {
  const [activeGoals, pausedGoals, completedGoals] = await Promise.all([
    getGoalsByStatus("ACTIVE"),
    getGoalsByStatus("PAUSED"),
    getGoalsByStatus("COMPLETED"),
  ]);

  const inProgressGoals = [...activeGoals, ...pausedGoals];

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Goals</h1>
          <p className="mt-0.5 text-sm text-stone-400">
            {activeGoals.length} active
            {pausedGoals.length > 0 && ` · ${pausedGoals.length} paused`}
            {completedGoals.length > 0 && ` · ${completedGoals.length} completed`}
          </p>
        </div>
        <Link
          href="/goals/new"
          className="shrink-0 rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          New goal
        </Link>
      </div>

      {/* Active + Paused */}
      {inProgressGoals.length > 0 ? (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-400">
            In Progress
          </h2>
          <div className="flex flex-col gap-3">
            {inProgressGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-200 bg-white p-10 text-center shadow-sm">
          <p className="text-stone-500">No active goals yet.</p>
          <Link
            href="/goals/new"
            className="mt-4 inline-flex rounded-lg bg-stone-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            Create your first goal
          </Link>
        </div>
      )}

      {/* Completed */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-400">
            Completed
          </h2>
          <div className="flex flex-col gap-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
