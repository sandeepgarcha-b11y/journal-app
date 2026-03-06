import Link from "next/link";
import { notFound } from "next/navigation";
import { getGoalById } from "@/lib/queries/goals";
import { GoalForm } from "@/components/goals/GoalForm";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const goal = await getGoalById(id);
  if (!goal) return {};
  return { title: `Journal — Edit: ${goal.title}` };
}

export default async function EditGoalPage({ params }: Props) {
  const { id } = await params;
  const goal = await getGoalById(id);
  if (!goal) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/goals/${id}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
        >
          ← Back to goal
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">Edit Goal</h1>
        <p className="mt-0.5 text-sm text-stone-400">{goal.title}</p>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <GoalForm existing={goal} />
      </div>
    </div>
  );
}
