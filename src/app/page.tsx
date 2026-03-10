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

function moodColour(score: number): string {
  if (score <= 3) return "text-red-400";
  if (score <= 5) return "text-amber-500";
  if (score <= 7) return "text-stone-600";
  return "text-sage-500";
}

export default async function TodayPage() {
  const [affirmation, todayEntry, todayMood, activeGoals] = await Promise.all([
    getDailyAffirmation(),
    getTodayEntry(),
    getTodayMoodLog(),
    getGoalsByStatus("ACTIVE"),
  ]);

  const moodScore   = todayMood?.score ?? null;
  const entryExcerpt = todayEntry
    ? todayEntry.content.slice(0, 90) + (todayEntry.content.length > 90 ? "…" : "")
    : null;

  return (
    <div className="flex flex-col gap-8">

      {/* ── Greeting hero ─────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-cream-200 bg-gradient-to-br from-terracotta-50 via-cream-50 to-cream-100 px-8 py-9 shadow-warm-sm animate-slide-up"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-terracotta-100 opacity-25" />
        <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-sage-100 opacity-20" />

        <p className="relative text-xs font-semibold uppercase tracking-widest text-terracotta-400">
          {getTodayLabel()}
        </p>
        <h1 className="relative mt-2 text-4xl font-semibold tracking-tight text-stone-900">
          {getGreeting()}
        </h1>
        <p className="relative mt-1.5 text-sm text-stone-400">
          Your space to reflect, track, and grow.
        </p>
      </div>

      {/* ── Daily affirmation ──────────────────────────────────────────── */}
      {affirmation && (
        <div className="animate-slide-up" style={{ animationDelay: "90ms" }}>
          <DailyAffirmationCard affirmation={affirmation} />
        </div>
      )}

      {/* ── Status cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Journal */}
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-warm-sm transition-all duration-200 hover:shadow-warm animate-slide-up"
          style={{ animationDelay: "180ms" }}
        >
          {/* Accent band */}
          <div className="h-1 w-full bg-terracotta-400" />

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Journal
              </p>

              {todayEntry ? (
                <>
                  <p className="mt-3 text-4xl font-bold text-terracotta-500">✓</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-500">
                    {entryExcerpt}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-4xl text-cream-300">✎</p>
                  <p className="mt-2 text-sm text-stone-400">
                    Nothing written yet today.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5">
              {todayEntry ? (
                <Link
                  href={`/journal/${todayEntry.id}`}
                  className="text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
                >
                  Read entry →
                </Link>
              ) : (
                <Link
                  href="/journal/new"
                  className="inline-flex items-center justify-center rounded-xl bg-terracotta-500 px-4 py-2 text-xs font-medium text-white shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-terracotta-600 hover:shadow-warm active:translate-y-0"
                >
                  Start today&apos;s entry
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mood */}
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-warm-sm transition-all duration-200 hover:shadow-warm animate-slide-up"
          style={{ animationDelay: "260ms" }}
        >
          <div className="h-1 w-full bg-sage-400" />

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Mood
              </p>

              {moodScore !== null ? (
                <>
                  <p className={`mt-3 text-5xl font-bold tabular-nums leading-none ${moodColour(moodScore)}`}>
                    {moodScore}
                    <span className="ml-1 text-lg font-normal text-stone-300">/10</span>
                  </p>
                  {todayMood?.note && (
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-400">
                      {todayMood.note}
                    </p>
                  )}
                  {!todayMood?.note && (
                    <p className="mt-2 text-sm text-stone-400">Logged today.</p>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-3 text-5xl font-bold leading-none text-cream-300">—</p>
                  <p className="mt-2 text-sm text-stone-400">Not logged yet today.</p>
                </>
              )}
            </div>

            <div className="mt-5">
              <Link
                href="/mood"
                className="text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
              >
                {moodScore !== null ? "View mood →" : "Log today's mood →"}
              </Link>
            </div>
          </div>
        </div>

        {/* Goals */}
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-warm-sm transition-all duration-200 hover:shadow-warm animate-slide-up"
          style={{ animationDelay: "340ms" }}
        >
          <div className="h-1 w-full bg-cream-300" />

          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">
                Goals
              </p>

              <p className={`mt-3 text-5xl font-bold tabular-nums leading-none ${
                activeGoals.length > 0 ? "text-stone-800" : "text-cream-300"
              }`}>
                {activeGoals.length}
              </p>

              {activeGoals.length > 0 ? (
                <ul className="mt-2 flex flex-col gap-1">
                  {activeGoals.slice(0, 2).map((g) => (
                    <li key={g.id} className="truncate text-sm text-stone-500">
                      · {g.title}
                    </li>
                  ))}
                  {activeGoals.length > 2 && (
                    <li className="text-xs text-stone-300">
                      +{activeGoals.length - 2} more
                    </li>
                  )}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-stone-400">No active goals yet.</p>
              )}
            </div>

            <div className="mt-5">
              <Link
                href="/goals"
                className="text-xs font-medium text-terracotta-500 transition hover:text-terracotta-700"
              >
                {activeGoals.length === 0 ? "Set a goal →" : "View goals →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick links ────────────────────────────────────────────────── */}
      <div className="animate-slide-up" style={{ animationDelay: "420ms" }}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Explore
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/journal",      label: "All entries"  },
            { href: "/review",       label: "Reviews"      },
            { href: "/affirmations", label: "Affirmations" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-cream-200 bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-warm-sm transition-all duration-150 hover:-translate-y-px hover:bg-cream-50 hover:shadow-warm"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
