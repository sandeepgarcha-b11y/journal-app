# Journal App

> 🔗 **[Live demo →](https://your-hosted-url.com)** *(update this link once deployed to Vercel)*

A clean, minimal, **personal journaling app** built with Next.js, TypeScript, Tailwind CSS, Prisma, and libsql/Turso. Protected by username + password authentication — only you can log in.

---

## Features

| Section | What you can do |
|---|---|
| **Journal** | Write daily entries with guided prompts, search and filter, edit and delete entries |
| **Mood** | Log a daily mood score (1–10) with an optional note, view a trend chart and 30-day history |
| **Reviews** | Structured weekly, monthly, and yearly reflection templates with pre-filled prompts |
| **Goals** | Create and track goals with status transitions and timestamped check-ins |
| **Affirmations** | Daily affirmation card on the home dashboard, full library with favourites filter |
| **Today dashboard** | Greeting, daily affirmation, today's journal/mood/goals status at a glance |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (custom warm palette) |
| Auth | NextAuth.js v5 (Credentials provider) |
| ORM | Prisma 7 |
| Database | libsql — local SQLite file in dev, Turso cloud in production |
| Runtime | Node.js (no global installs required) |

---

## Local Development

### Prerequisites

- Node.js >= 20
- No admin access, Docker, or external database needed

### 1. Install dependencies

```
git clone <this-repo-url>
cd journal-app
npm install
```

### 2. Create .env.local

```
# .env.local  (never commit this file)

# Auth
AUTH_SECRET=replace_with_random_hex_secret   # openssl rand -hex 32
AUTH_USERNAME=yourname
AUTH_PASSWORD=a_strong_password

# Database (local SQLite file — no token needed)
TURSO_DATABASE_URL=file:./journal.db
```

### 3. Set up the database

```
# Push the Prisma schema to your local SQLite file
npm run db:push

# Seed with sample entries, moods, goals, and affirmations
npm run db:seed
```

### 4. Start the dev server

```
npm run dev
```

Open http://localhost:3000 and sign in with the credentials you set above.

---

## Deploying to Vercel

### Step 1 — Create a Turso database

1. Sign up at https://turso.tech (free tier is generous).
2. Create a new database (e.g. "journal-db").
3. Note your Database URL (libsql://journal-db-org.turso.io) and Auth Token from the dashboard.

### Step 2 — Push the schema to Turso

Run once from your local machine:

```
TURSO_DATABASE_URL=libsql://journal-db-<org>.turso.io \
TURSO_AUTH_TOKEN=<your-turso-token> \
npm run db:push
```

### Step 3 — Add environment variables in Vercel

In your Vercel project, go to Settings > Environment Variables and add:

| Variable | Value |
|---|---|
| TURSO_DATABASE_URL | libsql://journal-db-<org>.turso.io |
| TURSO_AUTH_TOKEN | your Turso auth token |
| AUTH_SECRET | random 32-byte hex string |
| AUTH_USERNAME | your login username |
| AUTH_PASSWORD | a strong password |

### Step 4 — Deploy

Push to your connected git branch and Vercel builds automatically.

To seed production data, run locally with your Turso credentials:

```
TURSO_DATABASE_URL=libsql://journal-db-<org>.turso.io \
TURSO_AUTH_TOKEN=<your-turso-token> \
npm run db:seed
```

---

## Scripts

| Command | Description |
|---|---|
| npm run dev | Start Next.js dev server |
| npm run build | Production build |
| npm run db:push | Push Prisma schema to database (local or remote) |
| npm run db:generate | Regenerate Prisma client after schema changes |
| npm run db:seed | Seed sample data (idempotent) |
| npm run db:studio | Open Prisma Studio GUI |

---

## Security

- All routes are protected by Next.js middleware — unauthenticated users are redirected to /login.
- No public signup — credentials live only in environment variables.
- SQL injection protection — Prisma uses parameterised queries throughout.
- XSS protection — React auto-escapes all output.
- CSRF protection — built into Next.js Server Actions.
