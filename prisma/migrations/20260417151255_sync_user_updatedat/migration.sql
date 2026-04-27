/*
  Warnings:

  - You are about to drop the column `bloodType` on the `PendingRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `bloodType` on the `Resident` table. All the data in the column will be lost.
  - You are about to drop the `VerificationCode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `PendingRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `PendingRegistration` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sex` on the `PendingRegistration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `civilStatus` on the `PendingRegistration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `barangayName` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Resident` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `civilStatus` on the `Resident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sex` on the `Resident` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'ANNULLED', 'SEPARATED', 'COHABITANT');

-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- AlterTable
ALTER TABLE "PendingRegistration" DROP COLUMN "bloodType",
ADD COLUMN     "accompanyingPerson" TEXT,
ADD COLUMN     "adequatePhysicalActivity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "alcoholBottlesPerDay" TEXT,
ADD COLUMN     "allergiesDetails" TEXT,
ADD COLUMN     "cancerDetails" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "drinksAlcohol" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "eatsHealthyDiet" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "educationalAttainment" TEXT,
ADD COLUMN     "familyAsthmaAllergies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyBirthDefects" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyCancer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyDementia" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyDiabetes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyHypertension" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyKidneyDisease" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "familyMentalIllness" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasAllergies" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCancer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDiabetes" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHeartDisease" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasHypertension" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasKidneyFailure" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOtherConditions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasStiHiv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTuberculosis" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "illicitDrugsDetails" TEXT,
ADD COLUMN     "maintenanceMedications" TEXT,
ADD COLUMN     "multipleSexPartners" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "normalGrowthDevelopment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "otherConditionsDetails" TEXT,
ADD COLUMN     "previousIllnessesSurgeries" TEXT,
ADD COLUMN     "relationship" TEXT,
ADD COLUMN     "smokesTobacco" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "spouseContactNumber" TEXT,
ADD COLUMN     "spouseMaidenName" TEXT,
ADD COLUMN     "spouseOccupation" TEXT,
ADD COLUMN     "sufficientRestSleep" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "takesIllicitDrugs" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tobaccoPacksPerYear" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL,
DROP COLUMN "civilStatus",
ADD COLUMN     "civilStatus" "CivilStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Resident" DROP COLUMN "bloodType",
ADD COLUMN     "accompanyingPerson" TEXT,
ADD COLUMN     "barangayName" TEXT NOT NULL,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "educationalAttainment" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "relationship" TEXT,
ADD COLUMN     "spouseContactNumber" TEXT,
ADD COLUMN     "spouseMaidenName" TEXT,
ADD COLUMN     "spouseOccupation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "civilStatus",
ADD COLUMN     "civilStatus" "CivilStatus" NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "VerificationCode";

-- DropEnum
DROP TYPE "VerificationMethod";

-- CreateTable
CREATE TABLE "ResidentMedicalHistory" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "hasHypertension" BOOLEAN NOT NULL DEFAULT false,
    "hasDiabetes" BOOLEAN NOT NULL DEFAULT false,
    "hasStiHiv" BOOLEAN NOT NULL DEFAULT false,
    "hasHeartDisease" BOOLEAN NOT NULL DEFAULT false,
    "hasKidneyFailure" BOOLEAN NOT NULL DEFAULT false,
    "hasTuberculosis" BOOLEAN NOT NULL DEFAULT false,
    "hasAllergies" BOOLEAN NOT NULL DEFAULT false,
    "allergiesDetails" TEXT,
    "hasCancer" BOOLEAN NOT NULL DEFAULT false,
    "cancerDetails" TEXT,
    "hasOtherConditions" BOOLEAN NOT NULL DEFAULT false,
    "otherConditionsDetails" TEXT,
    "maintenanceMedications" TEXT,
    "previousIllnessesSurgeries" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentMedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentFamilyHistory" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "asthmaAllergies" BOOLEAN NOT NULL DEFAULT false,
    "birthDefects" BOOLEAN NOT NULL DEFAULT false,
    "cancer" BOOLEAN NOT NULL DEFAULT false,
    "dementia" BOOLEAN NOT NULL DEFAULT false,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "hypertension" BOOLEAN NOT NULL DEFAULT false,
    "kidneyDisease" BOOLEAN NOT NULL DEFAULT false,
    "mentalIllness" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentFamilyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResidentPersonalSocialHistory" (
    "id" TEXT NOT NULL,
    "residentId" TEXT NOT NULL,
    "eatsHealthyDiet" BOOLEAN NOT NULL DEFAULT false,
    "adequatePhysicalActivity" BOOLEAN NOT NULL DEFAULT false,
    "sufficientRestSleep" BOOLEAN NOT NULL DEFAULT false,
    "normalGrowthDevelopment" BOOLEAN NOT NULL DEFAULT false,
    "multipleSexPartners" BOOLEAN NOT NULL DEFAULT false,
    "smokesTobacco" BOOLEAN NOT NULL DEFAULT false,
    "tobaccoPacksPerYear" TEXT,
    "drinksAlcohol" BOOLEAN NOT NULL DEFAULT false,
    "alcoholBottlesPerDay" TEXT,
    "takesIllicitDrugs" BOOLEAN NOT NULL DEFAULT false,
    "illicitDrugsDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResidentPersonalSocialHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResidentMedicalHistory_residentId_key" ON "ResidentMedicalHistory"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentFamilyHistory_residentId_key" ON "ResidentFamilyHistory"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "ResidentPersonalSocialHistory_residentId_key" ON "ResidentPersonalSocialHistory"("residentId");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_email_key" ON "PendingRegistration"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingRegistration_username_key" ON "PendingRegistration"("username");

-- AddForeignKey
ALTER TABLE "ResidentMedicalHistory" ADD CONSTRAINT "ResidentMedicalHistory_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentFamilyHistory" ADD CONSTRAINT "ResidentFamilyHistory_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResidentPersonalSocialHistory" ADD CONSTRAINT "ResidentPersonalSocialHistory_residentId_fkey" FOREIGN KEY ("residentId") REFERENCES "Resident"("id") ON DELETE CASCADE ON UPDATE CASCADE;
