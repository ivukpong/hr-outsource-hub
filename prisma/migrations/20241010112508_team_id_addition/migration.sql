/*
  Warnings:

  - You are about to drop the column `employeeId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employmentType` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `msId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `skypeId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Employee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Employee_employeeId_key";

-- DropIndex
DROP INDEX "Employee_userId_key";

-- DropIndex
DROP INDEX "Employee_username_key";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "employeeId",
DROP COLUMN "employmentType",
DROP COLUMN "msId",
DROP COLUMN "skypeId",
DROP COLUMN "userId",
DROP COLUMN "username",
ADD COLUMN     "teamId" INTEGER;
