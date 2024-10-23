-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "sentToEmails" TEXT[] DEFAULT ARRAY[]::TEXT[];
