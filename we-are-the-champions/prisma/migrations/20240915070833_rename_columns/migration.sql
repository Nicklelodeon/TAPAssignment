/*
  Warnings:

  - You are about to drop the column `message` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Logs` table. All the data in the column will be lost.
  - You are about to drop the column `awayGoals` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `awayTeamId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeGoals` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `homeTeamId` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `goalsScored` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `normalPoints` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `tieBreakerPoints` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[TeamName]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Message` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UserId` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AwayGoals` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `AwayTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Date` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `HomeGoals` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `HomeTeamId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GoalsScored` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GroupNumber` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NormalPoints` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `RegistrationDate` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TeamName` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TieBreakerPoints` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_awayTeamId_fkey";

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_homeTeamId_fkey";

-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "message",
DROP COLUMN "userId",
ADD COLUMN     "Message" TEXT NOT NULL,
ADD COLUMN     "UserId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "awayGoals",
DROP COLUMN "awayTeamId",
DROP COLUMN "date",
DROP COLUMN "homeGoals",
DROP COLUMN "homeTeamId",
ADD COLUMN     "AwayGoals" SMALLINT NOT NULL,
ADD COLUMN     "AwayTeamId" INTEGER NOT NULL,
ADD COLUMN     "Date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "HomeGoals" SMALLINT NOT NULL,
ADD COLUMN     "HomeTeamId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "goalsScored",
DROP COLUMN "group",
DROP COLUMN "name",
DROP COLUMN "normalPoints",
DROP COLUMN "registrationDate",
DROP COLUMN "tieBreakerPoints",
ADD COLUMN     "GoalsScored" INTEGER NOT NULL,
ADD COLUMN     "GroupNumber" SMALLINT NOT NULL,
ADD COLUMN     "NormalPoints" INTEGER NOT NULL,
ADD COLUMN     "RegistrationDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "TeamName" TEXT NOT NULL,
ADD COLUMN     "TieBreakerPoints" INTEGER NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verificationtokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verificationtokens_identifier_token_key" ON "verificationtokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Team_TeamName_key" ON "Team"("TeamName");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_HomeTeamId_fkey" FOREIGN KEY ("HomeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_AwayTeamId_fkey" FOREIGN KEY ("AwayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
