/*
  Warnings:

  - Added the required column `transactionAddress` to the `NFT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NFT" ADD COLUMN     "transactionAddress" TEXT NOT NULL;
