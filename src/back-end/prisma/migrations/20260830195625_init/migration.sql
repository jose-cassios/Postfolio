-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ProjectCategory" AS ENUM ('FULLSTACK', 'FRONTEND', 'BACKEND', 'DESIGN', 'MOBILE', 'DATA_ANALYSIS', 'OTHER');

-- CreateEnum
CREATE TYPE "SocialProviderType" AS ENUM ('GOOGLE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('READ', 'UNREAD', 'RECEIVED', 'UNRECEIVED');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "bio" TEXT NOT NULL,
    "linkedin" TEXT,
    "github" TEXT,
    "website" TEXT,
    "contactEmail" TEXT,
    "availableForHire" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userType" "UserType",

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_provider_oauth" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "SocialProviderType" NOT NULL,
    "providerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "tb_provider_oauth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL DEFAULT 'anonymous_user_id',
    "receiverId" TEXT NOT NULL DEFAULT 'anonymous_user_id',

    CONSTRAINT "tb_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_portfolio" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pagelink" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "tb_portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_competition" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "category" "ProjectCategory" NOT NULL DEFAULT 'OTHER',
    "registrationStartsAt" TIMESTAMP(3),
    "registrationEndsAt" TIMESTAMP(3),
    "votingStartsAt" TIMESTAMP(3),
    "votingEndsAt" TIMESTAMP(3),
    "resultsAt" TIMESTAMP(3),

    CONSTRAINT "tb_competition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProjectCategory" NOT NULL,
    "githublink" TEXT,
    "externalLink" TEXT,
    "coverImageUrl" TEXT,
    "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tools" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "portfolioId" TEXT NOT NULL,

    CONSTRAINT "tb_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_appreciate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "postMetricsId" TEXT NOT NULL,

    CONSTRAINT "tb_appreciate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_post_metrics" (
    "id" TEXT NOT NULL,
    "appreciateCount" INTEGER NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "tb_post_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_favorate_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "tb_favorate_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tb_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_feedback" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "appreciateId" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,

    CONSTRAINT "tb_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_rating" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'anonymous_user_id',
    "projectId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "projectCompDetailsID" TEXT NOT NULL,

    CONSTRAINT "tb_rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_project_comp_details" (
    "id" TEXT NOT NULL,
    "totalReviewers" INTEGER NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "projectId" TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,

    CONSTRAINT "tb_project_comp_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_provider_oauth_provider_providerId_key" ON "tb_provider_oauth"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_portfolio_authorId_key" ON "tb_portfolio"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_appreciate_userId_projectId_key" ON "tb_appreciate"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_post_metrics_projectId_key" ON "tb_post_metrics"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_favorate_projects_userId_projectId_key" ON "tb_favorate_projects"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_comments_projectId_created_at_key" ON "tb_comments"("projectId", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tb_like_userId_projectId_key" ON "tb_like"("userId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_rating_userId_competitionId_key" ON "tb_rating"("userId", "competitionId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_rating_userId_competitionId_projectId_key" ON "tb_rating"("userId", "competitionId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_project_comp_details_competitionId_projectId_key" ON "tb_project_comp_details"("competitionId", "projectId");

-- AddForeignKey
ALTER TABLE "tb_provider_oauth" ADD CONSTRAINT "tb_provider_oauth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message" ADD CONSTRAINT "tb_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_message" ADD CONSTRAINT "tb_message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_portfolio" ADD CONSTRAINT "tb_portfolio_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_project" ADD CONSTRAINT "tb_project_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "tb_portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_appreciate" ADD CONSTRAINT "tb_appreciate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_appreciate" ADD CONSTRAINT "tb_appreciate_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_appreciate" ADD CONSTRAINT "tb_appreciate_postMetricsId_fkey" FOREIGN KEY ("postMetricsId") REFERENCES "tb_post_metrics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_post_metrics" ADD CONSTRAINT "tb_post_metrics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_favorate_projects" ADD CONSTRAINT "tb_favorate_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_favorate_projects" ADD CONSTRAINT "tb_favorate_projects_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_comments" ADD CONSTRAINT "tb_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_comments" ADD CONSTRAINT "tb_comments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_like" ADD CONSTRAINT "tb_like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_like" ADD CONSTRAINT "tb_like_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_feedback" ADD CONSTRAINT "tb_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_feedback" ADD CONSTRAINT "tb_feedback_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_feedback" ADD CONSTRAINT "tb_feedback_appreciateId_fkey" FOREIGN KEY ("appreciateId") REFERENCES "tb_appreciate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_rating" ADD CONSTRAINT "tb_rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_rating" ADD CONSTRAINT "tb_rating_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_rating" ADD CONSTRAINT "tb_rating_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_rating" ADD CONSTRAINT "tb_rating_projectCompDetailsID_fkey" FOREIGN KEY ("projectCompDetailsID") REFERENCES "tb_project_comp_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_project_comp_details" ADD CONSTRAINT "tb_project_comp_details_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_project_comp_details" ADD CONSTRAINT "tb_project_comp_details_competitionId_fkey" FOREIGN KEY ("competitionId") REFERENCES "tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
