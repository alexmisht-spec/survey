/*
  Warnings:

  - You are about to drop the `PasswordOTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PasswordOTP" DROP CONSTRAINT "PasswordOTP_userId_fkey";

-- DropTable
DROP TABLE "public"."PasswordOTP";

-- CreateTable
CREATE TABLE "public"."PasswordResetOTP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetOTP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PasswordResetOTP_userId_idx" ON "public"."PasswordResetOTP"("userId");

-- AddForeignKey
ALTER TABLE "public"."PasswordResetOTP" ADD CONSTRAINT "PasswordResetOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
