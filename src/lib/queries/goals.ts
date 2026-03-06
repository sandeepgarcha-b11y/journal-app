import { prisma } from "@/lib/db";
import type { Goal, GoalCheckin } from "@/generated/prisma/client";

export type { Goal, GoalCheckin };
export type GoalStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

/** Goal with its check-ins included (used on the detail page). */
export type GoalWithCheckins = Goal & { checkins: GoalCheckin[] };

/** Goals filtered by a single status, newest first. */
export async function getGoalsByStatus(status: GoalStatus): Promise<Goal[]> {
  return prisma.goal.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Active AND paused goals — used to populate the weekly review
 * and the goals list "In Progress" section.
 */
export async function getActiveGoals(): Promise<Goal[]> {
  return prisma.goal.findMany({
    where: { status: { in: ["ACTIVE", "PAUSED"] } },
    orderBy: { createdAt: "desc" },
  });
}

/** Single goal with all check-ins, newest check-in first. */
export async function getGoalById(id: string): Promise<GoalWithCheckins | null> {
  return prisma.goal.findUnique({
    where: { id },
    include: { checkins: { orderBy: { createdAt: "desc" } } },
  });
}
