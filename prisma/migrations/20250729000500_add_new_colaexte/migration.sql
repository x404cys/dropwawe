/*
  Warnings:

  - A unique constraint covering the columns `[category]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "discount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "storeName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_category_key" ON "Product"("category");

-- CreateIndex
CREATE UNIQUE INDEX "User_storeName_key" ON "User"("storeName");
