/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[user]` on the table `User`. If there are existing duplicate values, the migration will fail.
  - Added the required column `user` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN     `user` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User.user_unique` ON `User`(`user`);
