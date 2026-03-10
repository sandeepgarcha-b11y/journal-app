import { formatShortDate } from "@/lib/utils/dates";
import { deleteMoodLog } from "@/lib/actions/mood";
import type { MoodLog } from "@/lib/queries/mood";

interface MoodHistoryListProps {
  logs: MoodLog[];
}

function ScoreBadge({ score }: { score: number }) {
  let cls = "bg-sage-50 text-sage-600";
  if (score <= 3)      cls = "bg-red-50 text-red-500";
  else if (score <= 5) cls = "bg-amber-50 text-amber-600";
  else if (score <= 7) cls = "bg-amber-50 text-amber-700";

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${cls}`}
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
    <div className="flex flex-col divide-y divide-cream-200 rounded-2xl border border-cream-200 bg-white shadow-warm-sm">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4 px-5 py-4">
          <ScoreBadge score={log.score} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-stone-400">
              {formatShortDate(log.date)}
            </p>
            {log.note && (
              <p className="mt-0.5 text-sm leading-snug text-stone-600 line-clamp-2">
                {log.note}
              </p>
            )}
          </div>
          <form
            action={deleteMoodLog}
            onSubmit={(e) => {
              if (!confirm("Delete this mood log?")) e.preventDefault();
            }}
          >
            <input type="hidden" name="id" value={log.id} />
            <button
              type="submit"
              title="Delete log"
              className="shrink-0 rounded-lg p-1.5 text-stone-300 transition-all duration-150 hover:bg-terracotta-50 hover:text-terracotta-500"
              aria-label="Delete mood log"
            >
              ×
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
