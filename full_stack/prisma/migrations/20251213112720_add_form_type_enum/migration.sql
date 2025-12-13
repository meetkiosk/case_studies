/*
  Warnings:

  - Changed the type of `formType` on the `forms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FormType" AS ENUM ('csrd');

-- AlterTable
ALTER TABLE "forms" DROP COLUMN "formType",
ADD COLUMN     "formType" "FormType" NOT NULL;
