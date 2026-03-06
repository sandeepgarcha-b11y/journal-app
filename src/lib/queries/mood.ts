import { prisma } from "@/lib/db";
import { toLocalMidnightUTC, todayDateString } from "@/lib/utils/dates";
import type { MoodLog } from "@/generated/prisma/client";

export type { MoodLog };

/** Today's mood log, or null if not yet logged. */
export async function getTodayMoodLog(): Promise<MoodLog | null> {
  const date = toLocalMidnightUTC(todayDateString());
  return prisma.moodLog.findUnique({ where: { date } });
}

/** Last 30 mood logs, newest first. */
export async function getRecentMoodLogs(): Promise<MoodLog[]> {
  return prisma.moodLog.findMany({
    orderBy: { date: "desc" },
    take: 30,
  });
}
