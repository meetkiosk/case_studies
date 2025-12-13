-- AlterTable
ALTER TABLE "forms" ADD COLUMN     "completedRootQuestionsIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
