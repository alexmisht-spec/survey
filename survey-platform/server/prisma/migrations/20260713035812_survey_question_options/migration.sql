/*
  Warnings:

  - Changed the type of `questionType` on the `SurveyQuestion` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('TEXT', 'TEXTAREA', 'RADIO', 'CHECKBOX', 'SELECT', 'NUMBER', 'DATE');

-- AlterTable
ALTER TABLE "public"."SurveyQuestion" DROP COLUMN "questionType",
ADD COLUMN     "questionType" "public"."QuestionType" NOT NULL;
