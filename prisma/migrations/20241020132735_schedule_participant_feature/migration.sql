/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Announcement` table. All the data in the column will be lost.
  - The primary key for the `ScheduleParticipants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `participantId` on the `ScheduleParticipants` table. All the data in the column will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `employeeId` to the `ScheduleParticipants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScheduleParticipants" DROP CONSTRAINT "ScheduleParticipants_participantId_fkey";

-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "ScheduleParticipants" DROP CONSTRAINT "ScheduleParticipants_pkey",
DROP COLUMN "participantId",
ADD COLUMN     "employeeId" INTEGER NOT NULL,
ADD CONSTRAINT "ScheduleParticipants_pkey" PRIMARY KEY ("scheduleId", "employeeId");

-- DropTable
DROP TABLE "Participant";

-- RenameForeignKey
ALTER TABLE "Attendance" RENAME CONSTRAINT "Attendance_employeeId_fkey" TO "AttendanceEmployee_FK";

-- RenameForeignKey
ALTER TABLE "Attendance" RENAME CONSTRAINT "Attendance_teamId_fkey" TO "AttendanceTeam_FK";

-- RenameForeignKey
ALTER TABLE "Department" RENAME CONSTRAINT "Department_departmentHeadId_fkey" TO "DepartmentHead_FK";

-- RenameForeignKey
ALTER TABLE "Employee" RENAME CONSTRAINT "Employee_departmentId_fkey" TO "EmployeeDepartment_FK";

-- RenameForeignKey
ALTER TABLE "Employee" RENAME CONSTRAINT "Employee_teamId_fkey" TO "EmployeeTeam_FK";

-- RenameForeignKey
ALTER TABLE "Reward" RENAME CONSTRAINT "Reward_categoryId_fkey" TO "RewardCategory_FK";

-- RenameForeignKey
ALTER TABLE "Reward" RENAME CONSTRAINT "Reward_departmentId_fkey" TO "RewardDepartment_FK";

-- RenameForeignKey
ALTER TABLE "Reward" RENAME CONSTRAINT "Reward_employeeId_fkey" TO "RewardEmployee_FK";

-- RenameForeignKey
ALTER TABLE "ScheduleParticipants" RENAME CONSTRAINT "ScheduleParticipants_scheduleId_fkey" TO "ScheduleParticipant_Schedule_FK";

-- RenameForeignKey
ALTER TABLE "Team" RENAME CONSTRAINT "TeamDepartmentConstraint" TO "TeamDepartment_FK";

-- RenameForeignKey
ALTER TABLE "Team" RENAME CONSTRAINT "Team_teamLeadId_fkey" TO "TeamLead_FK";

-- AddForeignKey
ALTER TABLE "ScheduleParticipants" ADD CONSTRAINT "ScheduleParticipant_Employee_FK" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
