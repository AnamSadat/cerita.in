/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Stories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "avatar_url" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stories_slug_key" ON "Stories"("slug");
