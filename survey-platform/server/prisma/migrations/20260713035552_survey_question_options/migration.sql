-- AlterTable
ALTER TABLE "public"."SurveyQuestion" ADD COLUMN     "options" JSONB,
ADD COLUMN     "placeholder" TEXT;
