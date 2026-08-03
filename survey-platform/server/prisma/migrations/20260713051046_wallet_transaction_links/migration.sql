-- AlterTable
ALTER TABLE "public"."WalletTransaction" ADD COLUMN     "surveyResponseId" TEXT,
ADD COLUMN     "withdrawalId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."WalletTransaction" ADD CONSTRAINT "WalletTransaction_surveyResponseId_fkey" FOREIGN KEY ("surveyResponseId") REFERENCES "public"."SurveyResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WalletTransaction" ADD CONSTRAINT "WalletTransaction_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "public"."Withdrawal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
