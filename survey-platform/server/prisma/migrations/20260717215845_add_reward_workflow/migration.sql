-- AlterTable
ALTER TABLE "public"."SurveyAssignment" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "rewardApproved" BOOLEAN NOT NULL DEFAULT false;
