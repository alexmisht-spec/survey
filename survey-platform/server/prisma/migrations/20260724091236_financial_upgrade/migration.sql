/*
  Warnings:

  - You are about to alter the column `amount` on the `WalletTransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(18,2)`.
  - You are about to drop the column `mpesaNumber` on the `Withdrawal` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Withdrawal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(18,2)`.
  - Added the required column `phoneNumber` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED');

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'WITHDRAWAL_REFUND';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "WithdrawalStatus" ADD VALUE 'PROCESSING';
ALTER TYPE "WithdrawalStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "WalletTransaction" ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "balanceAfter" DECIMAL(18,2),
ADD COLUMN     "balanceBefore" DECIMAL(18,2),
ADD COLUMN     "callbackPayload" JSONB,
ADD COLUMN     "requestIp" TEXT,
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "mpesaNumber",
ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "callbackPayload" JSONB,
ADD COLUMN     "conversationId" TEXT,
ADD COLUMN     "failureReason" TEXT,
ADD COLUMN     "originatorConversationId" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "requestIp" TEXT,
ADD COLUMN     "transactionId" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,2);

-- CreateIndex
CREATE INDEX "WalletTransaction_walletId_idx" ON "WalletTransaction"("walletId");

-- CreateIndex
CREATE INDEX "WalletTransaction_withdrawalId_idx" ON "WalletTransaction"("withdrawalId");

-- CreateIndex
CREATE INDEX "WalletTransaction_type_idx" ON "WalletTransaction"("type");

-- CreateIndex
CREATE INDEX "WalletTransaction_status_idx" ON "WalletTransaction"("status");

-- CreateIndex
CREATE INDEX "WalletTransaction_createdAt_idx" ON "WalletTransaction"("createdAt");
