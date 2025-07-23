-- CreateTable
CREATE TABLE "feedback" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "feedbackId" TEXT NOT NULL,
    "name" TEXT,
    "contact" TEXT,
    "diningTime" DATETIME,
    "rating" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unprocessed',
    "response" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "feedback_feedbackId_key" ON "feedback"("feedbackId");
