/*
  Warnings:

  - You are about to drop the column `paymentNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `User` table. All the data in the column will be lost.
  - The `paymentMethod` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `mpesaNumber` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `nationalId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."SurveyStatus" AS ENUM ('ACTIVE', 'LOCKED', 'COMING_SOON', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('MPESA');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "paymentNumber",
DROP COLUMN "verificationStatus",
DROP COLUMN "wallet",
ADD COLUMN     "mpesaNumber" TEXT NOT NULL,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "walletBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "nationalId" SET NOT NULL,
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'MPESA';

-- CreateTable
CREATE TABLE "public"."Verification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "idFront" TEXT NOT NULL,
    "idBack" TEXT NOT NULL,
    "kraCertificate" TEXT NOT NULL,
    "status" "public"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Survey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" DECIMAL(65,30) NOT NULL,
    "status" "public"."SurveyStatus" NOT NULL DEFAULT 'COMING_SOON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyQuestion" (
    "id" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "surveyId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "rewardPaid" BOOLEAN NOT NULL DEFAULT false,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Withdrawal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "mpesaNumber" TEXT NOT NULL,
    "status" "public"."WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_userId_key" ON "public"."Verification"("userId");

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyResponse" ADD CONSTRAINT "SurveyResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyResponse" ADD CONSTRAINT "SurveyResponse_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "public"."Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Withdrawal" ADD CONSTRAINT "Withdrawal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
