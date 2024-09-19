/*
  Warnings:

  - Added the required column `Date` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LogType` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logs" ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "LogType" TEXT NOT NULL;
