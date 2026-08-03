/*
  Warnings:

  - The values [PROFILE_COMPLETED] on the enum `AccountStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nationalId]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `RewardCredential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mpesaNumber` to the `Verification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountStatus_new" AS ENUM ('REGISTERED', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');
ALTER TABLE "public"."User" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "status" TYPE "AccountStatus_new" USING ("status"::text::"AccountStatus_new");
ALTER TYPE "AccountStatus" RENAME TO "AccountStatus_old";
ALTER TYPE "AccountStatus_new" RENAME TO "AccountStatus";
DROP TYPE "public"."AccountStatus_old";
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
COMMIT;

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- AlterTable
ALTER TABLE "RewardCredential" ADD COLUMN     "adminApproved" BOOLEAN,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "mpesaNumber" TEXT NOT NULL,
ADD COLUMN     "nationalId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MPESA';

-- DropTable
DROP TABLE "Profile";

-- CreateIndex
CREATE UNIQUE INDEX "Verification_nationalId_key" ON "Verification"("nationalId");
