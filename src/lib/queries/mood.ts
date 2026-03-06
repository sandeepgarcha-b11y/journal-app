import { prisma } from "@/lib/db";
import { toLocalMidnightUTC, todayDateString } from "@/lib/utils/dates";
import type { MoodLog } from "@/generated/prisma/client";

export type { MoodLog };

/** Today's mood log, or null if not yet logged. */
export async function getTodayMoodLog(): Promise<MoodLog | null> {
  const date = toLocalMidnightUTC(todayDateString());
  return prisma.moodLog.findUnique({ where: { date } });
}

/** Last 30 mood logs, newest first — for the history list. */
export async function getRecentMoodLogs(): Promise<MoodLog[]> {
  return prisma.moodLog.findMany({
    orderBy: { date: "desc" },
    take: 30,
  });
}

/** Up to 365 days of logs, oldest first — for the trend chart. */
export async function getMoodLogsForChart(): Promise<MoodLog[]> {
  const cutoff = new Date(Date.now() - 365 * 86_400_000);
  return prisma.moodLog.findMany({
    where: { date: { gte: cutoff } },
    orderBy: { date: "asc" },
  });
}
