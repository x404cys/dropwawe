/*
  Warnings:

  - A unique constraint covering the columns `[imageSlug]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_imageSlug_key" ON "User"("imageSlug");
