"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { toLocalMidnightUTC } from "@/lib/utils/dates";
import type { GoalStatus } from "@/lib/queries/goals";

// ── Goal CRUD ─────────────────────────────────────────────────────────────────

export async function createGoal(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const why = (formData.get("why") as string)?.trim() || null;
  const targetDateStr = (formData.get("targetDate") as string)?.trim();

  if (!title) throw new Error("Title is required.");

  const targetDate = targetDateStr ? toLocalMidnightUTC(targetDateStr) : null;

  const goal = await prisma.goal.create({
    data: { title, why, targetDate },
  });

  revalidatePath("/goals");
  redirect(`/goals/${goal.id}`);
}

export async function updateGoal(formData: FormData) {
  const id = (formData.get("id") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const why = (formData.get("why") as string)?.trim() || null;
  const targetDateStr = (formData.get("targetDate") as string)?.trim();

  if (!id || !title) throw new Error("ID and title are required.");

  const targetDate = targetDateStr ? toLocalMidnightUTC(targetDateStr) : null;

  await prisma.goal.update({
    where: { id },
    data: { title, why, targetDate },
  });

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
  redirect(`/goals/${id}`);
}

/**
 * Updates goal status in-place (no redirect).
 * Called from status-change buttons on the detail page.
 */
export async function updateGoalStatus(formData: FormData) {
  const id = (formData.get("id") as string)?.trim();
  const status = (formData.get("status") as string)?.trim() as GoalStatus;

  if (!id || !status) throw new Error("ID and status are required.");

  await prisma.goal.update({ where: { id }, data: { status } });

  revalidatePath("/goals");
  revalidatePath(`/goals/${id}`);
}

// ── Check-ins ─────────────────────────────────────────────────────────────────

/**
 * Adds a check-in to a goal (no redirect — stays on the detail page).
 */
export async function addCheckin(formData: FormData) {
  const goalId = (formData.get("goalId") as string)?.trim();
  const note = (formData.get("note") as string)?.trim();
  const confidenceStr = (formData.get("confidence") as string)?.trim();

  if (!goalId || !note) throw new Error("Goal ID and note are required.");

  const confidence = confidenceStr ? parseInt(confidenceStr, 10) : null;
  const validConfidence =
    confidence !== null && confidence >= 1 && confidence <= 5 ? confidence : null;

  await prisma.goalCheckin.create({
    data: { goalId, note, confidence: validConfidence },
  });

  revalidatePath(`/goals/${goalId}`);
}
