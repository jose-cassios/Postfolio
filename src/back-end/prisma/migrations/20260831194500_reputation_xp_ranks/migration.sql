-- Canonical product language for the reputation ledger.
ALTER TYPE "ReputationEventType" RENAME VALUE 'APPRECIATION_USEFUL' TO 'POSTMARK_USEFUL';
ALTER TYPE "ReputationEventType" RENAME VALUE 'APPRECIATION_APPLIED' TO 'POSTMARK_APPLIED';

-- Keep existing idempotency records attached to the canonical action name.
UPDATE "tb_reputation_event"
SET "idempotencyKey" = regexp_replace("idempotencyKey", '^appreciation-', 'postmark-')
WHERE "idempotencyKey" LIKE 'appreciation-%';

ALTER TABLE "tb_reputation_event"
  RENAME COLUMN "appreciationId" TO "postmarkId";
ALTER TABLE "tb_reputation_event"
  RENAME CONSTRAINT "tb_reputation_event_appreciationId_fkey"
  TO "tb_reputation_event_postmarkId_fkey";
ALTER TABLE "tb_reputation_event"
  ADD COLUMN "eventId" TEXT,
  ADD COLUMN "metadata" JSONB;
ALTER TABLE "tb_reputation_event"
  ADD CONSTRAINT "tb_reputation_event_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "tb_competition"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "tb_reputation_event_eventId_idx"
  ON "tb_reputation_event"("eventId");

-- A single threshold table applies identically to Creator XP and Contributor XP.
CREATE TYPE "ReputationRank" AS ENUM (
  'F', 'F+', 'E', 'E+', 'D', 'D+', 'C', 'C+', 'B', 'B+', 'A', 'A+', 'S', 'SS'
);

CREATE TABLE "tb_reputation_rank_config" (
  "rank" "ReputationRank" NOT NULL,
  "requiredXp" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tb_reputation_rank_config_pkey" PRIMARY KEY ("rank"),
  CONSTRAINT "tb_reputation_rank_config_requiredXp_nonnegative"
    CHECK ("requiredXp" >= 0)
);

INSERT INTO "tb_reputation_rank_config" ("rank", "requiredXp") VALUES
  ('F', 0),
  ('F+', 20),
  ('E', 50),
  ('E+', 100),
  ('D', 180),
  ('D+', 300),
  ('C', 500),
  ('C+', 750),
  ('B', 1100),
  ('B+', 1550),
  ('A', 2100),
  ('A+', 2800),
  ('S', 3800),
  ('SS', 5000);
