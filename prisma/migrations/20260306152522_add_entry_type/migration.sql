-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'DAILY',
    "content" TEXT NOT NULL,
    "prompts" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Entry" ("content", "createdAt", "date", "id", "prompts", "updatedAt") SELECT "content", "createdAt", "date", "id", "prompts", "updatedAt" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
CREATE INDEX "Entry_date_idx" ON "Entry"("date");
CREATE INDEX "Entry_type_idx" ON "Entry"("type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
