-- CreateTable
CREATE TABLE "RewardCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "transactionPin" TEXT NOT NULL,
    "taskCompleted" BOOLEAN NOT NULL DEFAULT false,
    "rewardPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RewardCredential_userId_key" ON "RewardCredential"("userId");

-- AddForeignKey
ALTER TABLE "RewardCredential" ADD CONSTRAINT "RewardCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
