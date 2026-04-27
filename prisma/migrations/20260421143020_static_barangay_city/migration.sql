/*
  Warnings:

  - Made the column `city` on table `Resident` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Resident" ALTER COLUMN "barangayName" SET DEFAULT 'Barangay 19-B',
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "city" SET DEFAULT 'Davao City';
