-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "periodKey" TEXT NOT NULL,
    "sections" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Review_type_periodKey_idx" ON "Review"("type", "periodKey");

-- CreateIndex
CREATE UNIQUE INDEX "Review_type_periodKey_key" ON "Review"("type", "periodKey");
