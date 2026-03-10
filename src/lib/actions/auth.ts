"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function signOutAction() {
  await signOut({ redirect: false }); // clear session only — no URL construction needed
  redirect("/login");                 // Next.js relative redirect — always works
}
