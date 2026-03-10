import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // PrismaLibSql accepts the libsql Config object directly (not a pre-created client).
  // Local dev:  TURSO_DATABASE_URL=file:./journal.db  (authToken not required)
  // Production: TURSO_DATABASE_URL=libsql://<db>-<org>.turso.io + TURSO_AUTH_TOKEN=<token>
  const adapter = new PrismaLibSql({
    url:       process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  // Prisma 7 constructor types require an adapter; cast to satisfy the type.
  const Client = PrismaClient as unknown as new (opts: {
    adapter: PrismaLibSql;
  }) => PrismaClient;

  return new Client({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
