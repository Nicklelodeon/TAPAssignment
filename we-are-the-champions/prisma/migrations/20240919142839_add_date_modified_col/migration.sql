/*
  Warnings:

  - Added the required column `DateModified` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "DateModified" TIMESTAMP(3) NOT NULL;
