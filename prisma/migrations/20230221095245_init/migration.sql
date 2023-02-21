-- CreateTable
CREATE TABLE "NFT" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "creatorAddress" TEXT NOT NULL,
    "blockAddress" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "guessAttempts" INTEGER NOT NULL DEFAULT 0,
    "solvedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);
