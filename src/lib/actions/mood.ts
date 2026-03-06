"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { toLocalMidnightUTC } from "@/lib/utils/dates";

export async function logMood(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const score = Number(formData.get("score"));
  const note = (formData.get("note") as string)?.trim() || null;

  if (!score || score < 1 || score > 10) {
    throw new Error("Score must be between 1 and 10.");
  }

  const date = toLocalMidnightUTC(dateStr);

  await prisma.moodLog.upsert({
    where: { date },
    create: { date, score, note },
    update: { score, note },
  });

  revalidatePath("/mood");
}
