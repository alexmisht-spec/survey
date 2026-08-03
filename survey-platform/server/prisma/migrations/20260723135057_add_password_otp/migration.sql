-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordOtp" TEXT,
ADD COLUMN     "passwordOtpExpiry" TIMESTAMP(3);
