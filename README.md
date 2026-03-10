# Journal App

> 🔗 **[Live demo →](https://journal-app-henna-iota.vercel.app)**

A clean, minimal, **personal journaling app** built with Next.js, TypeScript, Tailwind CSS, Prisma, and libsql/Turso. Protected by username + password authentication — only you can log in.

---

## Features

| Section | What you can do |
|---|---|
| **Journal** | Write daily entries with guided prompts, search and filter by type (Daily / Weekly / Monthly / Yearly), edit and delete entries |
| **Mood** | Log a daily mood score (1–10) with an optional note, view a trend chart and 30-day history |
| **Reviews** | Structured weekly, monthly, and yearly reflection templates with pre-filled prompts |
| **Goals** | Create and track goals with status transitions (Active → Paused → Completed) and timestamped check-ins |
| **Affirmations** | Daily affirmation card on the home dashboard, full library with favourites filter |
| **Today dashboard** | Greeting, daily affirmation, today's journal/mood/goals status at a glance |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (custom warm palette via CSS variables) |
| Auth | [NextAuth.js v5](https://authjs.dev) (Credentials provider) |
| ORM | [Prisma 7](https://prisma.io) |
| Database | [libsql](https://github.com/tursodatabase/libsql) — local SQLite file in dev, [Turso](https://turso.tech) cloud in production |
| Runtime | Node.js (no global installs required) |

---

## Local Development

### Prerequisites

- Node.js ≥ 20 (via [nvm](https://github.com/nvm-sh/nvm) is fine)
- No admin access, Docker, or external database needed

### 1. Install dependencies

```bash
git clone <this-repo-url>
cd journal-app
npm install
```

### 2. Create `.env.local`

```bash
# .env.local  (never commit this file)

# ── Auth ──────────────────────────────────────────────────────────────────────
# Generate a secret:  openssl rand -hex 32
AUTH_SECRET=replace_with_random_hex_secret
AUTH_USERNAME=yourname
AUTH_PASSWORD=a_strong_password

# ── Database (local SQLite file — no token needed) ────────────────────────────
TURSO_DATABASE_URL=file:./journal.db
```

### 3. Create the database and seed data

```bash
# Push the schema to your local SQLite file
npm run db:push

# Seed with sample entries, moods, goals, and affirmations
npm run db:seed
```

### 4. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with the credentials you set above.

---

## Deploying to Vercel

### 1. Set up a Turso database

1. Sign up at [turso.tech](https://turso.tech) (free tier is generous).
2. Create a new database (e.g. `journal-db`).
3. Note your **Database URL** (`libsql://journal-db-<org>.turso.io`) and **Auth Token** from the Turso dashboard.

### 2. Push the schema to Turso

Run this once from your local machine with the Turso credentials:

```bash
TURSO_DATABASE_URL=libsql://journal-db-<org>.turso.io \
TURSO_AUTH_TOKEN=<your-turso-token> \
npm run db:push
```

### 3. Add environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://journal-db-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | your Turso auth token |
| `AUTH_SECRET` | a random 32-byte hex string (`openssl rand -hex 32`) |
| `AUTH_USERNAME` | your login username |
| `AUTH_PASSWORD` | a strong password |

> ⚠️ **Do not set `TURSO_AUTH_TOKEN` on local development** — it's only needed for remote Turso connections.

### 4. Deploy

Push to your connected git branch and Vercel will build and deploy automatically.

> **Note:** Seed data is not run automatically on Vercel. If you want the demo data in production, run the seed script locally pointing at your Turso database:
>
> ```bash
> TURSO_DATABASE_URL=libsql://journal-db-<org>.turso.io \
> TURSO_AUTH_TOKEN=<your-turso-token> \
> npm run db:seed
> ```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to database (local or remote) |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:seed` | Seed sample data (idempotent — safe to re-run) |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Today dashboard (/)
│   ├── journal/            # Daily entries (list, new, detail, edit)
│   ├── mood/               # Mood tracker
│   ├── review/             # Weekly / monthly / yearly reviews
│   ├── goals/              # Goal management
│   ├── affirmations/       # Affirmation library
│   └── login/              # Login page
├── components/
│   ├── affirmations/       # DailyAffirmationCard, AffirmationCard
│   ├── common/             # DeleteButton, SubmitButton
│   ├── goals/              # GoalCard, GoalForm, CheckinForm, CheckinList
│   ├── journal/            # EntryCard, EntryForm, EntryEditForm, JournalSearch
│   ├── layout/             # Nav
│   ├── mood/               # MoodForm, MoodHistoryList, MoodChart
│   └── review/             # ReviewCard, ReviewForm
└── lib/
    ├── actions/            # Server actions (entries, mood, reviews, goals, auth)
    ├── queries/            # Data-fetching functions
    └── utils/              # Date helpers, prompts, review utils
prisma/
├── schema.prisma           # Database models
└── seed.mjs                # Seed script
prisma.config.ts            # Prisma 7 CLI configuration (datasource URL)
```

---

## Security

- **All routes are protected** — the Next.js proxy (middleware) blocks unauthenticated access to every page except `/login`.
- **No public signup** — credentials are set via environment variables; only you can log in.
- **SQL injection protection** — Prisma uses parameterised queries throughout.
- **XSS protection** — React auto-escapes all output.
- **CSRF protection** — built into Next.js Server Actions.

---

## Design Notes

- **Warm palette** — cream backgrounds, terracotta primary, sage secondary, driven by CSS custom properties in `globals.css`.
- **Animations** — `animate-fade-in` keyframes for smooth page transitions; subtle `hover:-translate-y-px` lifts on interactive cards.
- **Optimistic UI** — Favourite toggles update instantly in the client while the server action resolves.
- **Client-side search** — Journal search and filter use `useMemo` for zero-latency filtering without server round-trips.
- **Deterministic daily affirmation** — Selected by `daysSinceEpoch % totalAffirmations` so it's consistent for the full UTC day.
- **Idempotent seeding** — `upsert` / `skipDuplicates` ensures the seed script is safe to re-run.

---

## Database Schema (summary)

| Model | Key fields |
|---|---|
| `Entry` | `date`, `content`, `prompts` (JSON), `type` (DAILY/WEEKLY/MONTHLY/YEARLY) |
| `MoodLog` | `date` (unique, UTC midnight), `score` (1–10), `note` |
| `Review` | `type`, `periodKey` (e.g. `2026-W10`), `sections` (JSON) — unique per period |
| `Goal` | `title`, `why`, `targetDate`, `status` (ACTIVE/PAUSED/COMPLETED) |
| `GoalCheckin` | `goalId`, `note`, `confidence` (1–5) |
| `Affirmation` | `text` (unique), `isFavourite` |

---

## Milestones

- [x] **M1** — Daily journal entries with prompt picker
- [x] **M2** — Mood tracker with history list
- [x] **M3** — Weekly / monthly / yearly reviews
- [x] **M4** — Goals with check-ins; active goals surface in weekly review
- [x] **M5** — Affirmation library with daily card and favourites
- [x] **M6A** — Journal search and type filter
- [x] **M6B** — Mood trend chart (smooth line, area fill, hover tooltips)
- [x] **Auth** — Username + password login; all routes protected
- [x] **UI/UX Refactor** — Warm palette, rounded cards, subtle animations throughout
- [x] **Edit entries** — Edit journal entries in-place
- [x] **Today dashboard** — Rich home page with greeting, status cards, quick links
- [x] **Streak counter** — Consecutive journaling day streak badge
- [x] **Turso / Vercel** — Migrated from local SQLite to libsql (Turso-compatible) for cloud hosting