import path from "path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // DATABASE_URL=file:./journal.db places the file at project root
  const dbPath = path.join(process.cwd(), "journal.db");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  // Prisma 7 constructor types require adapter/accelerateUrl;
  // the generated files use @ts-nocheck so a cast is needed here.
  const Client = PrismaClient as unknown as new (opts: {
    adapter: PrismaBetterSqlite3;
  }) => PrismaClient;
  return new Client({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
