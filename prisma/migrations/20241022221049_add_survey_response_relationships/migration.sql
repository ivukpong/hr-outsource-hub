/*
  Warnings:

  - You are about to drop the column `respondentEmail` on the `SurveyResponse` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `SurveyResponse` table. All the data in the column will be lost.
  - Added the required column `employeeEmail` to the `SurveyResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SurveyResponse" DROP CONSTRAINT "SurveyResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "SurveyResponse" DROP CONSTRAINT "SurveyResponse_surveyId_fkey";

-- AlterTable
ALTER TABLE "SurveyResponse" DROP COLUMN "respondentEmail",
DROP COLUMN "submittedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "employeeEmail" TEXT NOT NULL,
ALTER COLUMN "questionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_employeeEmail_fkey" FOREIGN KEY ("employeeEmail") REFERENCES "Employee"("emailAddress") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SurveyQuestion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
