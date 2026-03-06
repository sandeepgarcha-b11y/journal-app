import type { GoalCheckin } from "@/lib/queries/goals";

interface CheckinListProps {
  checkins: GoalCheckin[];
}

const CONFIDENCE_LABEL: Record<number, string> = {
  1: "Low",
  2: "Below avg",
  3: "Okay",
  4: "Good",
  5: "High",
};

export function CheckinList({ checkins }: CheckinListProps) {
  if (checkins.length === 0) {
    return (
      <p className="py-4 text-sm text-stone-400">
        No check-ins yet. Add one above.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-sm">
      {checkins.map((checkin) => (
        <div key={checkin.id} className="px-5 py-4">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <p className="text-xs text-stone-400">
              {new Date(checkin.createdAt).toLocaleDateString("en-GB", {
                dateStyle: "medium",
              })}
            </p>
            {checkin.confidence !== null && (
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                {checkin.confidence}/5 · {CONFIDENCE_LABEL[checkin.confidence]}
              </span>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-stone-700">
            {checkin.note}
          </p>
        </div>
      ))}
    </div>
  );
}
