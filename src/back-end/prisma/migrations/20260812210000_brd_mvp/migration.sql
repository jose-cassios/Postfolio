-- Profile availability and professional contact
ALTER TABLE "tb_user"
  ADD COLUMN "contactEmail" TEXT,
  ADD COLUMN "availableForHire" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Rich project publishing metadata
ALTER TABLE "tb_project"
  ADD COLUMN "externalLink" TEXT,
  ADD COLUMN "coverImageUrl" TEXT,
  ADD COLUMN "galleryUrls" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "tools" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Simple likes are distinct from Appreciate and saved projects
CREATE TABLE "tb_like" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_like_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tb_like_userId_projectId_key"
  ON "tb_like"("userId", "projectId");

ALTER TABLE "tb_like"
  ADD CONSTRAINT "tb_like_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "tb_like"
  ADD CONSTRAINT "tb_like_projectId_fkey"
  FOREIGN KEY ("projectId") REFERENCES "tb_project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Monthly competition phases and category
ALTER TABLE "tb_competition"
  ADD COLUMN "category" "ProjectCategory" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN "registrationStartsAt" TIMESTAMP(3),
  ADD COLUMN "registrationEndsAt" TIMESTAMP(3),
  ADD COLUMN "votingStartsAt" TIMESTAMP(3),
  ADD COLUMN "votingEndsAt" TIMESTAMP(3),
  ADD COLUMN "resultsAt" TIMESTAMP(3);

-- The MVP permits one vote per authenticated user in each event.
-- Keep the earliest vote if legacy data contains more than one vote per event.
DELETE FROM "tb_rating" newer
USING "tb_rating" older
WHERE newer."userId" = older."userId"
  AND newer."competitionId" = older."competitionId"
  AND newer."id" > older."id";

UPDATE "tb_project_comp_details"
SET "totalReviewers" = 0,
    "totalScore" = 0;

UPDATE "tb_project_comp_details" details
SET "totalReviewers" = totals."voteCount",
    "totalScore" = totals."voteCount"
FROM (
  SELECT "projectCompDetailsID", COUNT(*)::INTEGER AS "voteCount"
  FROM "tb_rating"
  GROUP BY "projectCompDetailsID"
) totals
WHERE details."id" = totals."projectCompDetailsID";

CREATE UNIQUE INDEX "tb_rating_userId_competitionId_key"
  ON "tb_rating"("userId", "competitionId");
