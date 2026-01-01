-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'AED',
    "image" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "gallery" JSONB,
    "colors" JSONB NOT NULL,
    "sizes" JSONB NOT NULL,
    "tags" JSONB,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "bestSeller" BOOLEAN NOT NULL DEFAULT false,
    "newArrival" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("colors", "createdAt", "currency", "description", "gallery", "id", "image", "inStock", "name", "price", "quantity", "sizes", "tags", "thumbnail", "updatedAt") SELECT "colors", "createdAt", "currency", "description", "gallery", "id", "image", "inStock", "name", "price", "quantity", "sizes", "tags", "thumbnail", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");
CREATE INDEX "Product_name_idx" ON "Product"("name");
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
CREATE INDEX "Product_bestSeller_idx" ON "Product"("bestSeller");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
