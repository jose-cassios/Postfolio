/*
  Warnings:

  - You are about to drop the column `pageLink` on the `tb_portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `workDetailsId` on the `tb_rating` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `tb_user` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `tb_user` table. All the data in the column will be lost.
  - You are about to drop the `tb_work` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_work_comp_details` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,competitionId,projectId]` on the table `tb_rating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `tb_competition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competitionId` to the `tb_rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectCompDetailsID` to the `tb_rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `tb_rating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userType` to the `tb_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `tb_user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('DEVELOPER', 'EMPLOYER');

-- CreateEnum
CREATE TYPE "public"."FeedbackType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "public"."ProjectCategory" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DATA_ANALYSIS', 'OTHER');

-- DropForeignKey
ALTER TABLE "public"."tb_message" DROP CONSTRAINT "tb_message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_message" DROP CONSTRAINT "tb_message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_portfolio" DROP CONSTRAINT "tb_portfolio_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_provider_oauth" DROP CONSTRAINT "tb_provider_oauth_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_rating" DROP CONSTRAINT "tb_rating_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_rating" DROP CONSTRAINT "tb_rating_workDetailsId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_work" DROP CONSTRAINT "tb_work_portfolioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_work_comp_details" DROP CONSTRAINT "tb_work_comp_details_competitionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."tb_work_comp_details" DROP CONSTRAINT "tb_work_comp_details_workId_fkey";

-- AlterTable
ALTER TABLE "public"."tb_competition" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."tb_message" ALTER COLUMN "senderId" SET DEFAULT 'anonymous_user_id',
ALTER COLUMN "receiverId" SET DEFAULT 'anonymous_user_id';

-- AlterTable
ALTER TABLE "public"."tb_portfolio" DROP COLUMN "pageLink",
ADD COLUMN     "pagelink" TEXT;

-- AlterTable
ALTER TABLE "public"."tb_rating" DROP COLUMN "workDetailsId",
ADD COLUMN     "competitionId" TEXT NOT NULL,
ADD COLUMN     "projectCompDetailsID" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ALTER COLUMN "userId" SET DEFAULT 'anonymous_user_id';

-- AlterTable
ALTER TABLE "public"."tb_user" DROP COLUMN "name",
DROP COLUMN "status",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "userType" "public"."UserType" NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "public"."tb_work";

-- DropTable
DROP TABLE "public"."tb_work_comp_details";

-- CreateTable
CREATE TABLE "public"."tb_project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "public"."ProjectCategory" NOT NULL,
    "githublink" TEXT,
    "portfolioId" TEXT NOT NULL,

    CONSTRAINT "tb_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_appreciate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "postMetricsId" TEXT NOT NULL,

    CONSTRAINT "tb_appreciate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_post_metrics" (
    "id" TEXT NOT NULL,
    "appreciateCount" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "tb_post_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_favorate_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "tb_favorate_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_feedback" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "appreciateId" TEXT NOT NULL,
    "type" "public"."FeedbackType" NOT NULL,

    CONSTRAINT "tb_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tb_project_comp_details" (
    "id" TEXT NOT NULL,
    "totalReviewers" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "projectId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "tb_project_comp_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_appreciate_userId_projectId_key" ON "public"."tb_appreciate"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_post_metrics_projectId_key" ON "public"."tb_post_metrics"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_favorate_projects_userId_projectId_key" ON "public"."tb_favorate_projects"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_comments_projectId_created_at_key" ON "public"."tb_comments"("projectId", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tb_project_comp_details_competitionId_projectId_key" ON "public"."tb_project_comp_details"("competitionId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_rating_userId_competitionId_projectId_key" ON "public"."tb_rating"("userId", "competitionId", "projectId");

-- AddForeignKey
ALTER TABLE "public"."tb_provider_oauth" ADD CONSTRAINT "tb_provider_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_message" ADD CONSTRAINT "tb_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_message" ADD CONSTRAINT "tb_message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_portfolio" ADD CONSTRAINT "tb_portfolio_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_project" ADD CONSTRAINT "tb_project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."tb_portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_appreciate" ADD CONSTRAINT "tb_appreciate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_appreciate" ADD CONSTRAINT "tb_appreciate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_appreciate" ADD CONSTRAINT "tb_appreciate_postMetricsId_fkey" FOREIGN KEY ("postMetricsId") REFERENCES "public"."tb_post_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_post_metrics" ADD CONSTRAINT "tb_post_metrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_favorate_projects" ADD CONSTRAINT "tb_favorate_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_favorate_projects" ADD CONSTRAINT "tb_favorate_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_comments" ADD CONSTRAINT "tb_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_comments" ADD CONSTRAINT "tb_comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_feedback" ADD CONSTRAINT "tb_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_feedback" ADD CONSTRAINT "tb_feedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_feedback" ADD CONSTRAINT "tb_feedback_appreciateId_fkey" FOREIGN KEY ("appreciateId") REFERENCES "public"."tb_appreciate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_rating" ADD CONSTRAINT "tb_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_rating" ADD CONSTRAINT "tb_rating_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_rating" ADD CONSTRAINT "tb_rating_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_rating" ADD CONSTRAINT "tb_rating_projectCompDetailsID_fkey" FOREIGN KEY ("projectCompDetailsID") REFERENCES "public"."tb_project_comp_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_project_comp_details" ADD CONSTRAINT "tb_project_comp_details_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tb_project_comp_details" ADD CONSTRAINT "tb_project_comp_details_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "public"."tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
