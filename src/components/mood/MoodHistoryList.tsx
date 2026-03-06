import { formatShortDate } from "@/lib/utils/dates";
import type { MoodLog } from "@/lib/queries/mood";

interface MoodHistoryListProps {
  logs: MoodLog[];
}

function ScoreBadge({ score }: { score: number }) {
  let bg = "bg-emerald-100 text-emerald-700";
  if (score <= 3) bg = "bg-red-100 text-red-700";
  else if (score <= 5) bg = "bg-amber-100 text-amber-700";
  else if (score <= 7) bg = "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${bg}`}
    >
      {score}
    </span>
  );
}

export function MoodHistoryList({ logs }: MoodHistoryListProps) {
  if (logs.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-stone-400">
        No mood logs yet. Log your first mood above.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-stone-100 rounded-xl border border-stone-200 bg-white shadow-sm">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4 px-5 py-4">
          <ScoreBadge score={log.score} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-stone-400">
              {formatShortDate(log.date)}
            </p>
            {log.note && (
              <p className="mt-0.5 text-sm text-stone-700 leading-snug line-clamp-2">
                {log.note}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
