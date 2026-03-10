/**
 * Seed script — inserts demo data for all tables.
 * Idempotent: running twice does not duplicate rows.
 *   - Entry:       checked by (date, type) before insert
 *   - MoodLog:     INSERT OR IGNORE  (unique on date)
 *   - Review:      INSERT OR IGNORE  (unique on type + periodKey)
 *   - Goal:        checked by title before insert; checkins only added for new goals
 *   - GoalCheckin: only inserted when parent goal is newly created
 *   - Affirmation: INSERT OR IGNORE  (unique on text)
 *
 * Run: node prisma/seed.mjs
 *   Local dev:  uses TURSO_DATABASE_URL=file:./journal.db
 *   Production: set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
 */

import { createClient } from "@libsql/client";
import { randomUUID } from "crypto";
import { config } from "dotenv";

// Load .env.local for local dev
config({ path: ".env.local" });

const client = createClient({
  url:       process.env.TURSO_DATABASE_URL ?? "file:./journal.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const RUN_AT = new Date().toISOString();

/** "2026-02-20" → "2026-02-20T00:00:00.000Z" */
function utcMid(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toISOString();
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Daily journal entries
// ─────────────────────────────────────────────────────────────────────────────

const DAILY_ENTRIES = [
  { date: "2026-02-20", prompt: "What's one thing I'm proud of today?",             content: "I kept my word to myself and got a workout in even though I felt flat. The day didn't go perfectly, but I didn't spiral — I reset." },
  { date: "2026-02-21", prompt: "What felt heavy today, and what might help tomorrow?", content: "I felt pulled in too many directions. Tomorrow I'm going to timebox admin, and do one meaningful thing before checking messages." },
  { date: "2026-02-22", prompt: "What do I want more of in my life right now?",     content: "More fun and novelty. I've been productive, but a bit serious. I want to book something spontaneous and do more music this week." },
  { date: "2026-02-23", prompt: "What am I avoiding, and why?",                     content: "I'm avoiding a conversation because I don't want to disappoint someone. But clarity is kinder than delay. I'll draft what I need to say." },
  { date: "2026-02-24", prompt: "What gave me energy today?",                       content: "A focused block of work without context switching. Also a good walk. I'm remembering that my brain needs fewer tabs open." },
  { date: "2026-02-25", prompt: "What's one thing I can let go of?",               content: "I can let go of needing to do everything 'properly'. Progress counts. I'm allowed to keep it simple and still be proud." },
  { date: "2026-02-26", prompt: "What am I grateful for today?",                   content: "A calm evening, a decent meal, and the fact that I can choose how I spend my attention. Also: music exists." },
  { date: "2026-02-27", prompt: "What's one truth I need to hear today?",          content: "I don't need to earn rest. If I burn out, I lose the week. Doing less, better, is the move." },
  { date: "2026-02-28", prompt: "How do I want tomorrow to feel?",                 content: "I want tomorrow to feel light and intentional. One deep task, one social thing, and a proper wind-down." },
  { date: "2026-03-01", prompt: "What did I learn about myself today?",            content: "When I'm anxious, I try to solve everything at once. When I'm grounded, I pick one thing and finish it." },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. Reviews
// ─────────────────────────────────────────────────────────────────────────────

const REVIEWS = [
  {
    type: "WEEKLY", periodKey: "2026-W09",
    sections: [
      { prompt: "What were my top wins this week?",                          answer: "Consistent workouts all week and shipped a piece of work I'm genuinely proud of." },
      { prompt: "What didn't go as planned, and what did I learn from it?", answer: "Too much multitasking diluted my focus. Lesson: depth beats speed." },
      { prompt: "How did I feel overall this week?",                        answer: "Mostly positive. The workouts kept my mood stable and I had a couple of good social moments." },
      { prompt: "What is one thing I want to carry into next week?",        answer: "Single-tasking. When I did it, everything felt better." },
      { prompt: "What do I want to focus on next week?",                    answer: "Protect mornings, one social plan locked in, and piano twice." },
      { prompt: "What am I grateful for this week?",                        answer: "My own discipline — it showed up this week. And the small good things: music, movement, decent sleep." },
    ],
  },
  {
    type: "MONTHLY", periodKey: "2026-02",
    sections: [
      { prompt: "What were my biggest achievements this month?",             answer: "Rebuilt my core routines. Fewer late nights, better mornings." },
      { prompt: "What fell short of my expectations, and why?",             answer: "Reactive scrolling — lost too much time to it." },
      { prompt: "What patterns or habits did I notice in myself?",          answer: "I function well when I have structure. Without it I drift into reactivity." },
      { prompt: "How did my energy and mood trend this month?",             answer: "Started slow, built momentum mid-month. Sleep improvements made the biggest difference." },
      { prompt: "What relationships or moments stood out?",                 answer: "A few honest conversations I'd been delaying. They went better than expected." },
      { prompt: "What do I want to do differently next month?",            answer: "Guard my attention harder. Phone out of reach for the first and last hour of the day." },
      { prompt: "What is my focus theme for the coming month?",            answer: "Calm productivity and more play." },
    ],
  },
  {
    type: "YEARLY", periodKey: "2026",
    sections: [
      { prompt: "What am I most proud of this year?",                                          answer: "The consistency I've built over the past few months, and the work I've invested in my routines." },
      { prompt: "What was my biggest challenge, and how did I handle it?",                     answer: "Periods of self-doubt early in the year. I leaned into structure rather than waiting to feel motivated." },
      { prompt: "What did I learn about myself this year?",                                    answer: "I work best when well-rested and unhurried. The pressure I put on myself is usually what I need to manage most." },
      { prompt: "What relationships deepened or changed significantly?",                       answer: "A few friendships deepened through honest conversation. Some connections faded — and I made peace with that." },
      { prompt: "What did I let go of that no longer serves me?",                             answer: "The need to always be productive. Rest is part of the work. I'm still practising this one." },
      { prompt: "Where did I fall short of my own standards — and what will I do differently?", answer: "Being fully present. I want to close the phone more, listen better, and stop half-doing things." },
      { prompt: "What are my top 3 intentions for next year?",                                answer: "1. Calm confidence — less second-guessing.\n2. Meaningful work I can feel proud of.\n3. Richer, more present relationships." },
      { prompt: "What one word captures my theme for next year?",                             answer: "Presence." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. Mood logs
// ─────────────────────────────────────────────────────────────────────────────

const MOOD_LOGS = [
  { date: "2026-02-20", score: 6, note: "A bit tired but stable" },
  { date: "2026-02-21", score: 5, note: "Low energy, busy head" },
  { date: "2026-02-22", score: 7, note: "Better — social plan helped" },
  { date: "2026-02-23", score: 4, note: "Anxious, overthinking" },
  { date: "2026-02-24", score: 7, note: "Good focus today" },
  { date: "2026-02-25", score: 6, note: "Steady, not amazing" },
  { date: "2026-02-26", score: 8, note: "Great mood, calm day" },
  { date: "2026-02-27", score: 6, note: "Rest helped" },
  { date: "2026-02-28", score: 7, note: "Light and optimistic" },
  { date: "2026-03-01", score: 7, note: "Reflective, grounded" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. Goals + check-ins
// ─────────────────────────────────────────────────────────────────────────────

const GOALS = [
  {
    title: "Journal 4x per week", why: "Build self-awareness and consistency",
    status: "ACTIVE", targetDate: "2026-06-30",
    checkins: [
      { date: "2026-02-23", note: "2 entries so far — keep it light", confidence: 4 },
      { date: "2026-03-01", note: "Hit 4 entries this week", confidence: 4 },
    ],
  },
  {
    title: "Piano twice a week", why: "Make time for creativity",
    status: "ACTIVE", targetDate: "2026-05-31",
    checkins: [
      { date: "2026-02-26", note: "Played once — felt great", confidence: 3 },
    ],
  },
  {
    title: "Strength train 3x per week", why: "Feel strong and consistent",
    status: "ACTIVE", targetDate: "2026-06-30",
    checkins: [
      { date: "2026-02-28", note: "2/3 sessions done — solid", confidence: 4 },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. Affirmations
// ─────────────────────────────────────────────────────────────────────────────

const ALL_AFFIRMATIONS = [
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
  "I can do hard things without rushing myself.",
  "Small steps count. Consistency beats intensity.",
  "I'm allowed to rest without earning it.",
  "My attention is valuable, and I spend it with care.",
  "I trust myself to figure things out.",
  "I can be both ambitious and kind to myself.",
  "Today I will finish one thing with intention.",
  "I am building a life I actually enjoy.",
  "My feelings are information, not instructions.",
];

// ─────────────────────────────────────────────────────────────────────────────
// Run all seeds
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const counts = { entries: 0, reviews: 0, moods: 0, goals: 0, checkins: 0, affirmations: 0 };

  // 1. Daily entries (check first to stay idempotent)
  for (const e of DAILY_ENTRIES) {
    const existing = await client.execute({
      sql:  `SELECT id FROM "Entry" WHERE date = ? AND type = 'DAILY' LIMIT 1`,
      args: [utcMid(e.date)],
    });
    if (existing.rows.length === 0) {
      const prompts = JSON.stringify([{ prompt: e.prompt, answer: e.content }]);
      await client.execute({
        sql:  `INSERT INTO "Entry" (id, date, type, content, prompts, createdAt, updatedAt) VALUES (?, ?, 'DAILY', ?, ?, ?, ?)`,
        args: [randomUUID(), utcMid(e.date), e.content, prompts, utcMid(e.date), utcMid(e.date)],
      });
      counts.entries++;
    }
  }

  // 2. Reviews (INSERT OR IGNORE keyed on type + periodKey unique index)
  for (const r of REVIEWS) {
    const res = await client.execute({
      sql:  `INSERT OR IGNORE INTO "Review" (id, type, periodKey, sections, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [randomUUID(), r.type, r.periodKey, JSON.stringify(r.sections), RUN_AT, RUN_AT],
    });
    if (res.rowsAffected > 0) counts.reviews++;
  }

  // 3. Mood logs (INSERT OR IGNORE keyed on unique date index)
  for (const m of MOOD_LOGS) {
    const res = await client.execute({
      sql:  `INSERT OR IGNORE INTO "MoodLog" (id, date, score, note, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [randomUUID(), utcMid(m.date), m.score, m.note, utcMid(m.date), utcMid(m.date)],
    });
    if (res.rowsAffected > 0) counts.moods++;
  }

  // 4. Goals + check-ins
  for (const g of GOALS) {
    const existing = await client.execute({
      sql:  `SELECT id FROM "Goal" WHERE title = ? LIMIT 1`,
      args: [g.title],
    });
    if (existing.rows.length === 0) {
      const goalId = randomUUID();
      await client.execute({
        sql:  `INSERT INTO "Goal" (id, title, why, targetDate, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [goalId, g.title, g.why ?? null, g.targetDate ? utcMid(g.targetDate) : null, g.status, RUN_AT, RUN_AT],
      });
      counts.goals++;

      for (const ci of g.checkins) {
        await client.execute({
          sql:  `INSERT INTO "GoalCheckin" (id, goalId, note, confidence, createdAt) VALUES (?, ?, ?, ?, ?)`,
          args: [randomUUID(), goalId, ci.note, ci.confidence ?? null, utcMid(ci.date)],
        });
        counts.checkins++;
      }
    }
  }

  // 5. Affirmations (INSERT OR IGNORE keyed on unique text index)
  for (const text of ALL_AFFIRMATIONS) {
    const res = await client.execute({
      sql:  `INSERT OR IGNORE INTO "Affirmation" (id, text, isFavourite, createdAt, updatedAt) VALUES (?, ?, 0, ?, ?)`,
      args: [randomUUID(), text, RUN_AT, RUN_AT],
    });
    if (res.rowsAffected > 0) counts.affirmations++;
  }

  console.log("✅ Seed complete:");
  console.log(`   ${counts.entries}  new journal entries`);
  console.log(`   ${counts.reviews}  new reviews`);
  console.log(`   ${counts.moods}  new mood logs`);
  console.log(`   ${counts.goals}  new goals  (${counts.checkins} check-ins)`);
  console.log(`   ${counts.affirmations}  new affirmations`);
}

seed().catch((e) => { console.error(e); process.exit(1); });
