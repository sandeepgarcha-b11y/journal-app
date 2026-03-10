import { prisma } from "@/lib/db";
import { toLocalMidnightUTC, todayDateString } from "@/lib/utils/dates";
import type { Entry } from "@/generated/prisma/client";

export type { Entry };

/**
 * Fetch all daily entries, newest first.
 */
export async function getEntries(): Promise<Entry[]> {
  return prisma.entry.findMany({
    orderBy: { date: "desc" },
  });
}

/**
 * Find a single entry by its UTC midnight date.
 * Used to check whether today already has an entry.
 */
export async function getEntryByDate(date: Date): Promise<Entry | null> {
  return prisma.entry.findFirst({
    where: { date },
  });
}

/**
 * Convenience: find today's entry using the local date string.
 */
export async function getTodayEntry(): Promise<Entry | null> {
  const date = toLocalMidnightUTC(todayDateString());
  return getEntryByDate(date);
}

/**
 * Fetch a single entry by its ID.
 */
export async function getEntryById(id: string): Promise<Entry | null> {
  return prisma.entry.findUnique({ where: { id } });
}

/**
 * Count consecutive calendar days (UTC) that have at least one entry,
 * walking back from today. If today has no entry yet the streak is still
 * considered "alive" — i.e. yesterday's entry keeps the counter going.
 */
export async function getJournalingStreak(): Promise<number> {
  const rows = await prisma.entry.findMany({
    select: { date: true },
    orderBy: { date: "desc" },
  });

  if (rows.length === 0) return 0;

  const DAY = 86_400_000;
  // Floor to UTC midnight of today
  const now     = Date.now();
  const todayMs = now - (now % DAY);

  const dateSet = new Set(rows.map((r) => new Date(r.date).getTime()));

  // Start counting from today if journaled, otherwise from yesterday
  // (streak is still alive until midnight if you haven't written yet today)
  let cursor = dateSet.has(todayMs) ? todayMs : todayMs - DAY;
  if (!dateSet.has(cursor)) return 0;

  let streak = 0;
  while (dateSet.has(cursor)) {
    streak++;
    cursor -= DAY;
  }
  return streak;
}
