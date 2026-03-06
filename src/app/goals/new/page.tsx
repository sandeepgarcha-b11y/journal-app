import Link from "next/link";
import { GoalForm } from "@/components/goals/GoalForm";

export const metadata = { title: "Journal — New Goal" };

export default function NewGoalPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/goals"
          className="mb-3 inline-flex items-center gap-1 text-sm text-stone-400 transition hover:text-stone-600"
        >
          ← Back to goals
        </Link>
        <h1 className="text-2xl font-semibold text-stone-900">New Goal</h1>
        <p className="mt-0.5 text-sm text-stone-400">
          Define what you want to achieve and why.
        </p>
      </div>

      <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-warm">
        <GoalForm />
      </div>
    </div>
  );
}
