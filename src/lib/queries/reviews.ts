import { prisma } from "@/lib/db";
import type { Review } from "@/generated/prisma/client";

export type { Review };

/** All reviews, newest first. */
export async function getRecentReviews(limit = 30): Promise<Review[]> {
  return prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** Find the review for a specific period, if it exists. */
export async function getReviewByPeriod(
  type: string,
  periodKey: string,
): Promise<Review | null> {
  return prisma.review.findUnique({
    where: { type_periodKey: { type, periodKey } },
  });
}

/** Find a review by its ID. */
export async function getReviewById(id: string): Promise<Review | null> {
  return prisma.review.findUnique({ where: { id } });
}
