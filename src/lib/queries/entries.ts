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
