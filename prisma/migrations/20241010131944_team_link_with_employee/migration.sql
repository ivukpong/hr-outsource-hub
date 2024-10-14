/*
  Warnings:

  - You are about to drop the `_EmployeeTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EmployeeTeam" DROP CONSTRAINT "_EmployeeTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_EmployeeTeam" DROP CONSTRAINT "_EmployeeTeam_B_fkey";

-- DropTable
DROP TABLE "_EmployeeTeam";

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
