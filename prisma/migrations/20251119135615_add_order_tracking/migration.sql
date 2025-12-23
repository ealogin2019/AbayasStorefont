-- AlterTable
ALTER TABLE "Order" ADD COLUMN "estimatedDelivery" DATETIME;
ALTER TABLE "Order" ADD COLUMN "trackingNumber" TEXT;
ALTER TABLE "Order" ADD COLUMN "trackingUrl" TEXT;
