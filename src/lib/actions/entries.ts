"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { toLocalMidnightUTC } from "@/lib/utils/dates";

export async function createEntry(formData: FormData) {
  const dateStr = formData.get("date") as string;
  const content = formData.get("content") as string;
  const prompt = formData.get("prompt") as string;

  if (!content?.trim()) {
    throw new Error("Entry content cannot be empty.");
  }

  const date = toLocalMidnightUTC(dateStr);

  const promptsJson =
    prompt && prompt.trim()
      ? JSON.stringify([{ prompt: prompt.trim(), answer: content.trim() }])
      : null;

  await prisma.entry.create({
    data: {
      date,
      content: content.trim(),
      prompts: promptsJson,
    },
  });

  revalidatePath("/journal");
  redirect("/journal");
}

export async function updateEntry(id: string, formData: FormData) {
  const content = formData.get("content") as string;
  const prompt = formData.get("prompt") as string;

  if (!content?.trim()) {
    throw new Error("Entry content cannot be empty.");
  }

  const promptsJson =
    prompt && prompt.trim()
      ? JSON.stringify([{ prompt: prompt.trim(), answer: content.trim() }])
      : null;

  await prisma.entry.update({
    where: { id },
    data: {
      content: content.trim(),
      prompts: promptsJson,
    },
  });

  revalidatePath("/journal");
  redirect("/journal");
}
