-- Evolve Appreciate into structured improvement feedback.
CREATE TYPE "AppreciateStatus" AS ENUM ('PENDING', 'USEFUL', 'APPLIED', 'DISMISSED');
CREATE TYPE "ReputationAxis" AS ENUM ('CREATOR', 'CONTRIBUTOR');
CREATE TYPE "ReputationEventType" AS ENUM (
  'APPRECIATION_USEFUL',
  'APPRECIATION_APPLIED',
  'PROJECT_IMPROVED',
  'PROJECT_VERSION_WITH_COMMUNITY_CREDIT'
);

ALTER TABLE "tb_project"
  ADD COLUMN "feedbackAspects" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "feedbackQuestion" TEXT,
  ADD COLUMN "seekingFeedback" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "currentVersion" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "tb_appreciate"
  ADD COLUMN "aspect" TEXT NOT NULL DEFAULT 'GENERAL',
  ADD COLUMN "strength" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "improvement" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "additionalComment" TEXT,
  ADD COLUMN "status" "AppreciateStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "resolvedAt" TIMESTAMP(3);

ALTER TABLE "tb_competition"
  ADD COLUMN "minimumEvaluations" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "tb_rating" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "tb_rating" DROP CONSTRAINT "tb_rating_userId_fkey";
ALTER TABLE "tb_rating"
  ADD CONSTRAINT "tb_rating_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "tb_project_version" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "changelog" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" "ProjectCategory" NOT NULL,
  "githubLink" TEXT,
  "externalLink" TEXT,
  "coverImageUrl" TEXT,
  "galleryUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "tools" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "contentBlocks" JSONB NOT NULL DEFAULT '[]',
  "contentMarkdown" TEXT NOT NULL DEFAULT '',
  "authorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_project_version_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tb_project_version_credit" (
  "id" TEXT NOT NULL,
  "projectVersionId" TEXT NOT NULL,
  "appreciationId" TEXT NOT NULL,
  "contributorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_project_version_credit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tb_reputation_event" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "ReputationEventType" NOT NULL,
  "axis" "ReputationAxis" NOT NULL,
  "points" INTEGER NOT NULL,
  "projectId" TEXT,
  "appreciationId" TEXT,
  "projectVersionId" TEXT,
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_reputation_event_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tb_event_criterion" (
  "id" TEXT NOT NULL,
  "competitionId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "weight" DOUBLE PRECISION NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_event_criterion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tb_event_evaluation" (
  "id" TEXT NOT NULL,
  "competitionId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "evaluatorId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_event_evaluation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tb_event_evaluation_score" (
  "id" TEXT NOT NULL,
  "evaluationId" TEXT NOT NULL,
  "criterionId" TEXT NOT NULL,
  "score" INTEGER NOT NULL,
  CONSTRAINT "tb_event_evaluation_score_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "tb_event_evaluation_score_range" CHECK ("score" BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX "tb_project_version_projectId_versionNumber_key"
  ON "tb_project_version"("projectId", "versionNumber");
CREATE INDEX "tb_project_version_projectId_createdAt_idx"
  ON "tb_project_version"("projectId", "createdAt");
CREATE UNIQUE INDEX "tb_project_version_credit_projectVersionId_appreciationId_key"
  ON "tb_project_version_credit"("projectVersionId", "appreciationId");
CREATE UNIQUE INDEX "tb_project_version_credit_appreciationId_key"
  ON "tb_project_version_credit"("appreciationId");
CREATE INDEX "tb_project_version_credit_contributorId_idx"
  ON "tb_project_version_credit"("contributorId");
CREATE UNIQUE INDEX "tb_reputation_event_idempotencyKey_key"
  ON "tb_reputation_event"("idempotencyKey");
CREATE INDEX "tb_reputation_event_userId_axis_createdAt_idx"
  ON "tb_reputation_event"("userId", "axis", "createdAt");
CREATE UNIQUE INDEX "tb_event_criterion_competitionId_name_key"
  ON "tb_event_criterion"("competitionId", "name");
CREATE INDEX "tb_event_criterion_competitionId_position_idx"
  ON "tb_event_criterion"("competitionId", "position");
CREATE UNIQUE INDEX "tb_event_evaluation_competitionId_projectId_evaluatorId_key"
  ON "tb_event_evaluation"("competitionId", "projectId", "evaluatorId");
CREATE INDEX "tb_event_evaluation_competitionId_evaluatorId_idx"
  ON "tb_event_evaluation"("competitionId", "evaluatorId");
CREATE UNIQUE INDEX "tb_event_evaluation_score_evaluationId_criterionId_key"
  ON "tb_event_evaluation_score"("evaluationId", "criterionId");

ALTER TABLE "tb_project_version"
  ADD CONSTRAINT "tb_project_version_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_project_version_authorId_fkey"
  FOREIGN KEY ("authorId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_project_version_credit"
  ADD CONSTRAINT "tb_project_version_credit_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "tb_project_version"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_project_version_credit_appreciationId_fkey"
  FOREIGN KEY ("appreciationId") REFERENCES "tb_appreciate"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_project_version_credit_contributorId_fkey"
  FOREIGN KEY ("contributorId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_reputation_event"
  ADD CONSTRAINT "tb_reputation_event_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_reputation_event_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_reputation_event_appreciationId_fkey"
  FOREIGN KEY ("appreciationId") REFERENCES "tb_appreciate"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_reputation_event_projectVersionId_fkey"
  FOREIGN KEY ("projectVersionId") REFERENCES "tb_project_version"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tb_event_criterion"
  ADD CONSTRAINT "tb_event_criterion_competitionId_fkey"
  FOREIGN KEY ("competitionId") REFERENCES "tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_event_evaluation"
  ADD CONSTRAINT "tb_event_evaluation_competitionId_fkey"
  FOREIGN KEY ("competitionId") REFERENCES "tb_competition"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_event_evaluation_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_event_evaluation_evaluatorId_fkey"
  FOREIGN KEY ("evaluatorId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_event_evaluation_score"
  ADD CONSTRAINT "tb_event_evaluation_score_evaluationId_fkey"
  FOREIGN KEY ("evaluationId") REFERENCES "tb_event_evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "tb_event_evaluation_score_criterionId_fkey"
  FOREIGN KEY ("criterionId") REFERENCES "tb_event_criterion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_appreciate" DROP CONSTRAINT "tb_appreciate_postMetricsId_fkey";
ALTER TABLE "tb_appreciate"
  ADD CONSTRAINT "tb_appreciate_postMetricsId_fkey"
  FOREIGN KEY ("postMetricsId") REFERENCES "tb_post_metrics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Legacy events receive one neutral criterion so they remain evaluable.
INSERT INTO "tb_event_criterion" (
  "id", "competitionId", "name", "weight", "position"
)
SELECT competition."id" || ':general', competition."id", 'Avaliação geral', 100, 0
FROM "tb_competition" competition;

-- Existing published projects become v1 without inventing a historical diff.
INSERT INTO "tb_project_version" (
  "id", "projectId", "versionNumber", "changelog", "name", "description",
  "category", "githubLink", "externalLink", "coverImageUrl", "galleryUrls",
  "tools", "tags", "contentBlocks", "contentMarkdown", "authorId", "createdAt"
)
SELECT
  project."id" || ':v1', project."id", 1, 'Versão inicial', project."name",
  project."description", project."category", project."githublink",
  project."externalLink", project."coverImageUrl", project."galleryUrls",
  project."tools", project."tags", project."contentBlocks",
  project."contentMarkdown", portfolio."authorId",
  COALESCE(project."publishedAt", project."createdAt")
FROM "tb_project" project
JOIN "tb_portfolio" portfolio ON portfolio."id" = project."portfolioId"
WHERE project."status" = 'PUBLISHED';

UPDATE "tb_project" SET "currentVersion" = 1 WHERE "status" = 'PUBLISHED';
