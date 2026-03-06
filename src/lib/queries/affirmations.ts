import { prisma } from "@/lib/db";
import type { Affirmation } from "@/generated/prisma/client";

export type { Affirmation };

/**
 * Deterministic "affirmation of the day".
 * Uses UTC day number (days since Unix epoch) modulo count so the result
 * is stable for the entire calendar day and automatically rotates at midnight.
 */
function utcDayNumber(): number {
  return Math.floor(Date.now() / 86_400_000);
}

export async function getDailyAffirmation(): Promise<Affirmation | null> {
  const all = await prisma.affirmation.findMany({ orderBy: { id: "asc" } });
  if (all.length === 0) return null;
  return all[utcDayNumber() % all.length];
}

export async function getAffirmations(
  favouritesOnly = false
): Promise<Affirmation[]> {
  return prisma.affirmation.findMany({
    where: favouritesOnly ? { isFavourite: true } : undefined,
    orderBy: { text: "asc" },
  });
}

export async function getAffirmationById(
  id: string
): Promise<Affirmation | null> {
  return prisma.affirmation.findUnique({ where: { id } });
}
