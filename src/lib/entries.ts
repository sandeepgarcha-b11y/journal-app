import { prisma } from "@/lib/db";
import { todayDateString, toLocalMidnightUTC } from "@/lib/utils/dates";

interface CreateEntryInput {
  body: string;
  date?: string;
  title?: string | null;
  type?: string;
}

export async function createEntryRecord({
  body,
  date = todayDateString(),
  title,
  type = "DAILY",
}: CreateEntryInput) {
  const trimmedBody = body.trim();
  const trimmedTitle = title?.trim() ?? "";

  if (!trimmedBody) {
    throw new Error("Entry content cannot be empty.");
  }

  const promptsJson = trimmedTitle
    ? JSON.stringify([{ prompt: trimmedTitle, answer: trimmedBody }])
    : null;

  return prisma.entry.create({
    data: {
      date: toLocalMidnightUTC(date),
      type,
      content: trimmedBody,
      prompts: promptsJson,
    },
  });
}
