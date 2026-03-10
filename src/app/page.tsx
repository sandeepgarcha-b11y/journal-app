import Link from "next/link";
import { getTodayEntry } from "@/lib/queries/entries";
import { getTodayMoodLog } from "@/lib/queries/mood";
import { getDailyAffirmation } from "@/lib/queries/affirmations";
import { getGoalsByStatus } from "@/lib/queries/goals";
import { DailyAffirmationCard } from "@/components/affirmations/DailyAffirmationCard";

export const metadata = { title: "Journal — Today" };

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getTodayLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function TodayPage() {
  const [affirmation, todayEntry, todayMood, activeGoals] = await Promise.all([
    getDailyAffirmation(),
    getTodayEntry(),
    getTodayMoodLog(),
    getGoalsByStatus("ACTIVE"),
  ]);

  const moodScore = todayMood?.score ?? null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
          {getTodayLabel()}
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900">
          {getGreeting()}
        </h1>
      </div>

      {/* Daily affirmation */}
      {affirmation && <DailyAffirmationCard affirmation={affirmation} />}

      {/* Status cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* ── Journal ── */}
        <div className="flex flex-col justify-between rounded-2xl border border-cream-200 bg-white p-5 shadow-warm-sm transition-all duration-200 hover:shadow-warm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Journal
            </p>
            {todayEntry ? (
              <p className="mt-2 text-sm font-medium text-sage-600">
                Written today
              </p>
            ) : (
              <p className="mt-2 text-sm text-stone-400">No entry yet today</p>
            )}
          </div>

          {todayEntry ? (
            <Link
              href={`/journal/${todayEntry.id}`}
              className="mt-5 text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
            >
              Read entry →
            </Link>
          ) : (
            <Link
              href="/journal/new"
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-terracotta-500 px-4 py-2 text-xs font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm active:translate-y-0"
            >
              Start today&apos;s entry
            </Link>
          )}
        </div>

        {/* ── Mood ── */}
        <div className="flex flex-col justify-between rounded-2xl border border-cream-200 bg-white p-5 shadow-warm-sm transition-all duration-200 hover:shadow-warm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Mood
            </p>
            {moodScore !== null ? (
              <p className="mt-2 text-sm font-medium text-sage-600">
                {moodScore}/10 logged
              </p>
            ) : (
              <p className="mt-2 text-sm text-stone-400">Not logged yet</p>
            )}
          </div>

          <Link
            href="/mood"
            className="mt-5 text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
          >
            {moodScore !== null ? "View mood →" : "Log today's mood →"}
          </Link>
        </div>

        {/* ── Goals ── */}
        <div className="flex flex-col justify-between rounded-2xl border border-cream-200 bg-white p-5 shadow-warm-sm transition-all duration-200 hover:shadow-warm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Goals
            </p>
            <p className="mt-2 text-sm font-medium text-stone-700">
              {activeGoals.length === 0
                ? "No active goals"
                : `${activeGoals.length} active goal${activeGoals.length === 1 ? "" : "s"}`}
            </p>
          </div>

          <Link
            href="/goals"
            className="mt-5 text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
          >
            {activeGoals.length === 0 ? "Set a goal →" : "View goals →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
