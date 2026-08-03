-- CreateTable
CREATE TABLE "public"."PasswordOTP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordOTP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PasswordOTP" ADD CONSTRAINT "PasswordOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
