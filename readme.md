# Journal App

A clean, minimal, **local-first personal journaling app** built with Next.js, TypeScript, Tailwind CSS, and Prisma + SQLite. No authentication, no cloud — everything lives on your machine.

---

## Features

| Section | What you can do |
|---|---|
| **Journal** | Write daily entries with guided prompts, search and filter by type (Daily / Weekly / Monthly / Yearly) |
| **Mood** | Log a daily mood score (1–10) with an optional note, view a trend chart and 30-day history |
| **Reviews** | Structured weekly, monthly, and yearly reflection templates with pre-filled prompts |
| **Goals** | Create and track goals with status transitions (Active → Paused → Completed) and timestamped check-ins |
| **Affirmations** | Daily affirmation card on the journal homepage, full library with favourites filter |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (custom warm palette via CSS variables) |
| ORM | [Prisma 7](https://prisma.io) |
| Database | SQLite via `better-sqlite3` |
| Runtime | Node.js (no global installs required) |

---

## Getting Started

### Prerequisites

- Node.js ≥ 20 (via [nvm](https://github.com/nvm-sh/nvm) is fine)
- No admin access, Docker, or external database needed

### Install

```bash
git clone https://github.com/sandeepgarcha-a11y/journal-app.git
cd journal-app
npm install
```

### Set up the database

```bash
# Run migrations (creates journal.db at project root)
npm run db:migrate

# Seed the affirmations library
npm run db:seed
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects straight to `/journal`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations (creates / updates `journal.db`) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:seed` | Seed affirmations table (idempotent — safe to re-run) |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── journal/            # Daily entries (list, new, detail)
│   ├── mood/               # Mood tracker
│   ├── review/             # Weekly / monthly / yearly reviews
│   ├── goals/              # Goal management
│   └── affirmations/       # Affirmation library
├── components/
│   ├── affirmations/       # DailyAffirmationCard, AffirmationCard
│   ├── goals/              # GoalCard, GoalForm, CheckinForm, CheckinList
│   ├── journal/            # EntryCard, EntryForm, JournalSearch
│   ├── layout/             # Nav
│   ├── mood/               # MoodForm, MoodHistoryList, MoodChart
│   └── review/             # ReviewCard, ReviewForm
└── lib/
    ├── actions/            # Server actions (entries, mood, reviews, goals, affirmations)
    ├── queries/            # Data-fetching functions
    └── utils/              # Date helpers, prompts, review utils
prisma/
├── schema.prisma           # Database models
└── seed.mjs                # Affirmation seed script
```

---

## Design Notes

- **Warm palette** — cream backgrounds, terracotta primary, sage secondary, amber accents, all driven by CSS custom properties in `globals.css`.
- **Animations** — `animate-fade-in` and `animate-slide-up` keyframes for smooth page transitions; subtle `hover:-translate-y-px` lifts on interactive cards.
- **Optimistic UI** — Favourite toggles on affirmations update instantly in the client while the server action runs in a `useTransition`.
- **Client-side search** — Journal search and filter use `useMemo` for zero-latency filtering without server round-trips.
- **Deterministic daily affirmation** — Selected by `daysSinceEpoch % totalAffirmations` so it's consistent for the full UTC day.
- **Idempotent seeding** — `INSERT OR IGNORE` ensures the seed script is safe to re-run.
- **No duplicate daily entries** — Mood and review upserts are keyed on `(type, periodKey)` or UTC-midnight date.

---

## Database Schema (summary)

| Model | Key fields |
|---|---|
| `Entry` | `date`, `content`, `prompts` (JSON), `type` (DAILY/WEEKLY/MONTHLY/YEARLY) |
| `MoodLog` | `date` (unique, UTC midnight), `score` (1–10), `note` |
| `Review` | `type`, `periodKey` (e.g. `2026-W10`), `sections` (JSON) — unique per period |
| `Goal` | `title`, `why`, `targetDate`, `status` (ACTIVE/PAUSED/COMPLETED) |
| `GoalCheckin` | `goalId`, `note`, `confidence` (1–5), `date` |
| `Affirmation` | `text` (unique), `isFavourite` |

---

## Milestones

- [x] **M1** — Daily journal entries with prompt picker
- [x] **M2** — Mood tracker with history list
- [x] **M3** — Weekly / monthly / yearly reviews
- [x] **M4** — Goals with check-ins; active goals surface in weekly review
- [x] **M5** — Affirmation library with daily card and favourites
- [x] **M6A** — Journal search and type filter
- [x] **M6B** — Mood trend chart (smooth Bézier curve, area fill, hover tooltips)
- [x] **UI/UX Refactor** — Warm palette, rounded cards, subtle animations throughout
