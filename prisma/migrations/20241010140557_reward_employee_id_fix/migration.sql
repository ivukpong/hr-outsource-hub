-- DropForeignKey
ALTER TABLE "Reward" DROP CONSTRAINT "Reward_departmentId_fkey";

-- AlterTable
ALTER TABLE "Reward" ALTER COLUMN "earnedDate" DROP NOT NULL,
ALTER COLUMN "departmentId" DROP NOT NULL,
ALTER COLUMN "pointsEarned" DROP NOT NULL,
ALTER COLUMN "progress" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
