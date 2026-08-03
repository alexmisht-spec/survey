-- CreateTable
CREATE TABLE "public"."SurveyAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "rewardPaid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SurveyAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurveyAssignment_userId_surveyId_key" ON "public"."SurveyAssignment"("userId", "surveyId");

-- AddForeignKey
ALTER TABLE "public"."SurveyAssignment" ADD CONSTRAINT "SurveyAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyAssignment" ADD CONSTRAINT "SurveyAssignment_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
