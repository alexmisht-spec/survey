/*
  Warnings:

  - You are about to drop the column `balance` on the `Wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Wallet" DROP COLUMN "balance",
ADD COLUMN     "availableBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "pendingBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "totalEarned" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."WalletTransaction" ADD COLUMN     "reference" TEXT;
