"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { ReviewType } from "@/lib/utils/reviews";

export async function saveReview(formData: FormData) {
  const type = formData.get("type") as ReviewType;
  const periodKey = formData.get("periodKey") as string;

  if (!type || !periodKey) {
    throw new Error("Missing type or periodKey.");
  }

  // Collect prompt/answer pairs — fields are named prompt_0/answer_0, etc.
  const sections: Array<{ prompt: string; answer: string }> = [];
  let i = 0;
  while (formData.has(`prompt_${i}`)) {
    sections.push({
      prompt: formData.get(`prompt_${i}`) as string,
      answer: ((formData.get(`answer_${i}`) as string) ?? "").trim(),
    });
    i++;
  }

  const result = await prisma.review.upsert({
    where: { type_periodKey: { type, periodKey } },
    update: { sections: JSON.stringify(sections) },
    create: { type, periodKey, sections: JSON.stringify(sections) },
  });

  revalidatePath("/review");
  redirect(`/review/${result.id}`);
}
