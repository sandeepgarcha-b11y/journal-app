export type ReviewType = "WEEKLY" | "MONTHLY" | "YEARLY";

// ── ISO week helpers ───────────────────────────────────────────────────────────

/**
 * Returns the ISO week number and ISO week-year for a UTC date.
 * ISO rule: week 1 is the week that contains Thursday (i.e. Jan 4).
 * The "year" in the result may differ from the calendar year at boundaries
 * (e.g. Dec 31 can be W01 of the following year).
 */
function isoWeekAndYear(utcDate: Date): { week: number; year: number } {
  const d = new Date(
    Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate()),
  );
  const day = d.getUTCDay() || 7; // Mon=1 … Sun=7
  // Shift to the nearest Thursday — the ISO anchor day
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { week, year: d.getUTCFullYear() };
}

/** "2026-W09" (zero-padded) */
export function getWeekKey(utcDate: Date): string {
  const { week, year } = isoWeekAndYear(utcDate);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

/** "2026-03" */
export function getMonthKey(utcDate: Date): string {
  const y = utcDate.getUTCFullYear();
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/** "2026" */
export function getYearKey(utcDate: Date): string {
  return String(utcDate.getUTCFullYear());
}

/** Returns the period key for the given type using the current UTC time. */
export function getPeriodKey(type: ReviewType, utcDate: Date = new Date()): string {
  if (type === "WEEKLY") return getWeekKey(utcDate);
  if (type === "MONTHLY") return getMonthKey(utcDate);
  return getYearKey(utcDate);
}

// ── Display helpers ────────────────────────────────────────────────────────────

/** Monday of ISO week 1 for a given year. */
function weekOneMondayUTC(year: number): Date {
  // Jan 4 is always in ISO week 1
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const day = jan4.getUTCDay() || 7; // Mon=1…Sun=7
  return new Date(jan4.getTime() - (day - 1) * 86_400_000);
}

/** Returns the Monday–Sunday date range for a "YYYY-WNN" period key. */
export function weekKeyToRange(key: string): { start: Date; end: Date } {
  const [yearStr, weekStr] = key.split("-W");
  const year = Number(yearStr);
  const week = Number(weekStr);
  const monday = new Date(
    weekOneMondayUTC(year).getTime() + (week - 1) * 7 * 86_400_000,
  );
  const sunday = new Date(monday.getTime() + 6 * 86_400_000);
  return { start: monday, end: sunday };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Human-readable period label.
 * WEEKLY  → "Week 9 · 2–8 Mar 2026"
 * MONTHLY → "March 2026"
 * YEARLY  → "2026"
 */
export function formatPeriodLabel(type: ReviewType, key: string): string {
  if (type === "WEEKLY") {
    const weekNum = Number(key.split("-W")[1]);
    const { start, end } = weekKeyToRange(key);
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
    const endYear = end.getUTCFullYear();
    return `Week ${weekNum} · ${fmt(start)} – ${fmt(end)} ${endYear}`;
  }
  if (type === "MONTHLY") {
    const [year, month] = key.split("-");
    return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
  }
  return key; // "2026"
}

// ── Prompts ────────────────────────────────────────────────────────────────────

export const REVIEW_PROMPTS: Record<ReviewType, string[]> = {
  WEEKLY: [
    "What were my top wins this week?",
    "What didn't go as planned, and what did I learn from it?",
    "How did I feel overall this week?",
    "What is one thing I want to carry into next week?",
    "What do I want to focus on next week?",
    "What am I grateful for this week?",
  ],
  MONTHLY: [
    "What were my biggest achievements this month?",
    "What fell short of my expectations, and why?",
    "What patterns or habits did I notice in myself?",
    "How did my energy and mood trend this month?",
    "What relationships or moments stood out?",
    "What do I want to do differently next month?",
    "What is my focus theme for the coming month?",
  ],
  YEARLY: [
    "What am I most proud of this year?",
    "What was my biggest challenge, and how did I handle it?",
    "What did I learn about myself this year?",
    "What relationships deepened or changed significantly?",
    "What did I let go of that no longer serves me?",
    "Where did I fall short of my own standards — and what will I do differently?",
    "What are my top 3 intentions for next year?",
    "What one word captures my theme for next year?",
  ],
};

/** Display metadata per review type. */
export const REVIEW_META: Record<ReviewType, { label: string; description: string }> = {
  WEEKLY: {
    label: "Weekly",
    description: "A quick look back at the past 7 days.",
  },
  MONTHLY: {
    label: "Monthly",
    description: "Reflect on patterns and progress over the month.",
  },
  YEARLY: {
    label: "Yearly",
    description: "A deep dive into the year that was.",
  },
};
