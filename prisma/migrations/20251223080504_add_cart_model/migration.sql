/*
  Warnings:

  - You are about to drop the column `customerId` on the `CartItem` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT,
    "customerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CartItem" ("color", "createdAt", "id", "productId", "quantity", "size", "updatedAt") SELECT "color", "createdAt", "id", "productId", "quantity", "size", "updatedAt" FROM "CartItem";
DROP TABLE "CartItem";
ALTER TABLE "new_CartItem" RENAME TO "CartItem";
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");
CREATE INDEX "CartItem_productId_idx" ON "CartItem"("productId");
CREATE UNIQUE INDEX "CartItem_cartId_productId_size_color_key" ON "CartItem"("cartId", "productId", "size", "color");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Cart_sessionId_idx" ON "Cart"("sessionId");

-- CreateIndex
CREATE INDEX "Cart_customerId_idx" ON "Cart"("customerId");
