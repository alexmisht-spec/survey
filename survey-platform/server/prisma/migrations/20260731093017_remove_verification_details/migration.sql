/*
  Warnings:

  - You are about to drop the column `mpesaNumber` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `nationalId` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Verification` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Verification_nationalId_key";

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "mpesaNumber",
DROP COLUMN "nationalId",
DROP COLUMN "paymentMethod";
