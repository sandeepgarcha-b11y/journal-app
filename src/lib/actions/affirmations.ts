"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function toggleFavourite(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  if (!id) return;

  const current = await prisma.affirmation.findUnique({ where: { id } });
  if (!current) return;

  await prisma.affirmation.update({
    where: { id },
    data: { isFavourite: !current.isFavourite },
  });

  revalidatePath("/journal");
  revalidatePath("/affirmations");
}
