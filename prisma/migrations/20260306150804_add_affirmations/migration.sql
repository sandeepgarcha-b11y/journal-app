-- CreateTable
CREATE TABLE "Affirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Affirmation_text_key" ON "Affirmation"("text");

-- CreateIndex
CREATE INDEX "Affirmation_isFavourite_idx" ON "Affirmation"("isFavourite");
