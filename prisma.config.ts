// Prisma 7 configuration — used by CLI commands (db push, generate, studio, etc.)
// Runtime connection is configured separately in src/lib/db.ts via the adapter.
import "dotenv/config";
import { defineConfig } from "prisma/config";

// For Turso remote URLs, embed the auth token as a query param so the
// Prisma schema engine can connect (e.g. libsql://db.turso.io?authToken=xxx).
// For local files (file:./journal.db) no token is needed.
const url = (() => {
  const base = process.env.TURSO_DATABASE_URL ?? "file:./journal.db";
  const token = process.env.TURSO_AUTH_TOKEN;
  if (token && base.startsWith("libsql://")) {
    return `${base}?authToken=${token}`;
  }
  return base;
})();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: { url },
});
