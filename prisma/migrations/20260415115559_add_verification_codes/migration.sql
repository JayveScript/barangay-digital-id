/*
  Warnings:

  - You are about to drop the column `address` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `BlockchainRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Record` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Resident` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `age` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `civilStatus` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completeAddress` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sex` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VerificationMethod" AS ENUM ('EMAIL', 'PHONE');

-- DropForeignKey
ALTER TABLE "BlockchainRecord" DROP CONSTRAINT "BlockchainRecord_recordId_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_residentId_fkey";

-- DropForeignKey
ALTER TABLE "Resident" DROP CONSTRAINT "Resident_createdById_fkey";

-- AlterTable
ALTER TABLE "Barangay" ALTER COLUMN "municipality" DROP NOT NULL,
ALTER COLUMN "province" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "address",
DROP COLUMN "createdById",
DROP COLUMN "fullName",
ADD COLUMN     "age" INTEGER NOT NULL,
ADD COLUMN     "bloodType" TEXT,
ADD COLUMN     "civilStatus" TEXT NOT NULL,
ADD COLUMN     "completeAddress" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "religion" TEXT,
ADD COLUMN     "sex" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'RESIDENT';

-- DropTable
DROP TABLE "BlockchainRecord";

-- DropTable
DROP TABLE "Record";

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "method" "VerificationMethod" NOT NULL,
    "contact" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resident_email_key" ON "Resident"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_phoneNumber_key" ON "Resident"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_userId_key" ON "Resident"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "Resident" ADD CONSTRAINT "Resident_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
