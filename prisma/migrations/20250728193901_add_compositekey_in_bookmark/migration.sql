/*
  Warnings:

  - A unique constraint covering the columns `[user_id,story_id]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_story_id_key" ON "Bookmark"("user_id", "story_id");
