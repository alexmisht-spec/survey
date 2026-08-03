-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationalId" TEXT,
    "password" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL DEFAULT 'MPESA',
    "paymentNumber" TEXT,
    "wallet" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "verificationStatus" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "public"."User"("nationalId");
