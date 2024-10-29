-- AlterEnum
ALTER TYPE "SurveyCategory" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "SurveyQuestion" ALTER COLUMN "options" SET DEFAULT ARRAY[]::TEXT[];
