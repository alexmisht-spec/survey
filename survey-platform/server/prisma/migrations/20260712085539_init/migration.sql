/*
  Warnings:

  - You are about to drop the column `mpesaNumber` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `walletBalance` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('REGISTERED', 'PROFILE_COMPLETED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('SURVEY_REWARD', 'WITHDRAWAL', 'BONUS', 'ADJUSTMENT');

-- DropIndex
DROP INDEX "public"."User_nationalId_key";

-- AlterTable
ALTER TABLE "public"."SurveyResponse" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "mpesaNumber",
DROP COLUMN "nationalId",
DROP COLUMN "paymentMethod",
DROP COLUMN "walletBalance",
ADD COLUMN     "status" "public"."AccountStatus" NOT NULL DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "public"."Verification" ADD COLUMN     "reviewedBy" TEXT;

-- CreateTable
CREATE TABLE "public"."Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nationalId" TEXT NOT NULL,
    "paymentMethod" "public"."PaymentMethod" NOT NULL DEFAULT 'MPESA',
    "mpesaNumber" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SurveyAnswer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "SurveyAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "public"."Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_nationalId_key" ON "public"."Profile"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "public"."Wallet"("userId");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "public"."SurveyResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."SurveyQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
