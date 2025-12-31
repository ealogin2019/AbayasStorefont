-- CreateTable
CREATE TABLE "HomepageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "section" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "image" TEXT,
    "link" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "HomepageContent_section_idx" ON "HomepageContent"("section");

-- CreateIndex
CREATE INDEX "HomepageContent_isActive_idx" ON "HomepageContent"("isActive");
