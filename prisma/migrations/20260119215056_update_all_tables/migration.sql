/*
  Warnings:

  - You are about to drop the column `userIdentifier` on the `subtasks` table. All the data in the column will be lost.
  - You are about to drop the column `userIdentifier` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `createdByIdentifier` to the `subtasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdByIdentifier` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `groupIdentifier` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subtasks" DROP CONSTRAINT "subtasks_userIdentifier_fkey";

-- DropForeignKey
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_userIdentifier_fkey";

-- AlterTable
ALTER TABLE "subtasks" DROP COLUMN "userIdentifier",
ADD COLUMN     "createdByIdentifier" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "userIdentifier",
ADD COLUMN     "createdByIdentifier" TEXT NOT NULL,
ADD COLUMN     "groupIdentifier" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "groups" (
    "identifier" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPersonal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdByIdentifier" TEXT NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("identifier")
);

-- CreateTable
CREATE TABLE "group_members" (
    "identifier" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userIdentifier" TEXT NOT NULL,
    "groupIdentifier" TEXT NOT NULL,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("identifier")
);

-- CreateIndex
CREATE UNIQUE INDEX "group_members_userIdentifier_groupIdentifier_key" ON "group_members"("userIdentifier", "groupIdentifier");

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_createdByIdentifier_fkey" FOREIGN KEY ("createdByIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_userIdentifier_fkey" FOREIGN KEY ("userIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_groupIdentifier_fkey" FOREIGN KEY ("groupIdentifier") REFERENCES "groups"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_groupIdentifier_fkey" FOREIGN KEY ("groupIdentifier") REFERENCES "groups"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdByIdentifier_fkey" FOREIGN KEY ("createdByIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subtasks" ADD CONSTRAINT "subtasks_createdByIdentifier_fkey" FOREIGN KEY ("createdByIdentifier") REFERENCES "users"("identifier") ON DELETE RESTRICT ON UPDATE CASCADE;
