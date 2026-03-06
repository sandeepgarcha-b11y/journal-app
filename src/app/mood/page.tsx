import { getTodayMoodLog, getRecentMoodLogs } from "@/lib/queries/mood";
import { MoodForm } from "@/components/mood/MoodForm";
import { MoodHistoryList } from "@/components/mood/MoodHistoryList";

export const metadata = {
  title: "Journal — Mood",
};

export default async function MoodPage() {
  const [todayLog, logs] = await Promise.all([
    getTodayMoodLog(),
    getRecentMoodLogs(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Mood</h1>
        <p className="mt-0.5 text-sm text-stone-400">
          {todayLog
            ? `Today's mood: ${todayLog.score}/10`
            : "You haven't logged today's mood yet."}
        </p>
      </div>

      {/* Log / edit form */}
      {/* key changes whenever the saved record changes, forcing a clean remount so
          useState and defaultValue always reflect the persisted data. */}
      <MoodForm
        key={todayLog?.updatedAt?.toISOString() ?? "new"}
        existing={todayLog}
      />

      {/* History */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-stone-500 uppercase tracking-wide">
          Recent logs
        </h2>
        <MoodHistoryList logs={logs} />
      </div>
    </div>
  );
}
