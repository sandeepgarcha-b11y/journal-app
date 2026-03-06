/**
 * Seed script for Affirmations.
 * Uses better-sqlite3 directly so no TS compilation or path aliases needed.
 * Run after migration: node prisma/seed.mjs
 */

import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "..", "journal.db");

const db = new Database(dbPath);

const AFFIRMATIONS = [
  "I am capable of achieving anything I set my mind to.",
  "I choose to be happy today.",
  "I am worthy of love and respect.",
  "I trust in my ability to navigate any challenge.",
  "Every day I grow stronger and wiser.",
  "I am grateful for the abundance in my life.",
  "I am at peace with who I am.",
  "I have the power to create positive change.",
  "I believe in myself and my potential.",
  "I am enough, exactly as I am.",
  "I radiate confidence, clarity, and purpose.",
  "My mind is calm and my heart is open.",
  "I deserve good things and I welcome them into my life.",
  "I am resilient — I can handle whatever comes my way.",
  "I am surrounded by people who support and uplift me.",
  "I am making progress every single day.",
  "I attract positivity and let go of what no longer serves me.",
  "I am in charge of how I feel, and today I choose joy.",
  "My challenges are opportunities for growth.",
  "I trust the process of life.",
  "I am proud of the person I am becoming.",
  "I have everything I need to succeed.",
  "I am allowed to take up space and be seen.",
  "I release all doubt and embrace possibility.",
  "My potential is limitless.",
  "I choose thoughts that make me feel good.",
  "I am doing the best I can, and that is enough.",
  "I am healthy, energised, and fully alive.",
  "I give myself permission to slow down and recharge.",
  "I am deeply loved just as I am.",
  "I face challenges with courage and grace.",
  "I create my own path and it is the right one for me.",
  "I am open to new beginnings and fresh opportunities.",
  "Each morning I wake up is a gift I choose to honour.",
  "I am worthy of the success I am working toward.",
  "I learn and grow from every experience.",
  "I am becoming the best version of myself.",
  "My thoughts shape my reality — I think with intention.",
  "I am kind to myself and to others.",
  "I let go of what I cannot control and focus on what I can.",
  "I am brave enough to try, and wise enough to learn.",
  "I celebrate small wins — every step forward counts.",
  "I am a source of light and inspiration.",
  "I trust my intuition to guide me.",
  "I am at the right place at the right time.",
  "I choose progress over perfection.",
  "I am worthy of rest, joy, and peace.",
  "My past does not define my future.",
  "I show up fully for myself and for those I care about.",
  "I am grateful for both my strength and my softness.",
  "I take things one step at a time, and that is enough.",
  "I am worthy of investing in myself.",
  "I attract opportunities that align with my values.",
  "I am free to be exactly who I am.",
  "I nurture my mind, body, and spirit with love.",
  "I have the courage to dream big and work hard.",
  "I am a work in progress and I am proud of my journey.",
  "I replace worry with wonder.",
  "I am exactly where I need to be.",
  "Every day is a chance to begin again.",
];

const now = new Date().toISOString();

const stmt = db.prepare(
  `INSERT OR IGNORE INTO "Affirmation" (id, text, isFavourite, createdAt, updatedAt)
   VALUES (?, ?, 0, ?, ?)`
);

const insertAll = db.transaction(() => {
  let count = 0;
  for (const text of AFFIRMATIONS) {
    const result = stmt.run(randomUUID(), text, now, now);
    if (result.changes > 0) count++;
  }
  return count;
});

const inserted = insertAll();
console.log(
  `✅ Seeded ${inserted} new affirmations (${AFFIRMATIONS.length - inserted} already existed).`
);
db.close();
