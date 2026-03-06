/**
 * Converts a YYYY-MM-DD string (local calendar date) to a UTC midnight Date.
 * This is the canonical representation for "a day" throughout the app —
 * all entry dates and mood log dates are stored as UTC midnight so that
 * comparisons are timezone-safe.
 */
export function toLocalMidnightUTC(dateStr: string): Date {
  // dateStr is "YYYY-MM-DD" — parse directly to avoid timezone shifts
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}

/**
 * Returns today's date as a YYYY-MM-DD string in the local timezone.
 * Used to pre-fill the hidden date field in forms.
 */
export function todayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a UTC midnight Date for display. Returns e.g. "Thursday, 5 March 2026".
 */
export function formatEntryDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Formats a UTC midnight Date as a short date. Returns e.g. "5 Mar 2026".
 */
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
