/*
  Warnings:

  - The `response` column on the `SurveyResponse` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SurveyResponse" DROP COLUMN "response",
ADD COLUMN     "response" TEXT[];
