"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
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

export async function deleteMoodLog(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorised");

  const id = formData.get("id") as string;
  if (!id) throw new Error("Mood log ID is required.");

  await prisma.moodLog.delete({ where: { id } });

  revalidatePath("/mood");
}
