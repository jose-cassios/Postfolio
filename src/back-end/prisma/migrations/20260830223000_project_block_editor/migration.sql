-- Additive project content model. Existing projects remain published.
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED');

ALTER TABLE "tb_project"
ADD COLUMN "contentBlocks" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "contentMarkdown" TEXT NOT NULL DEFAULT '',
ADD COLUMN "status" "ProjectStatus" NOT NULL DEFAULT 'PUBLISHED',
ADD COLUMN "publishedAt" TIMESTAMP(3);

UPDATE "tb_project"
SET
  "contentMarkdown" = "description",
  "publishedAt" = "createdAt";

ALTER TABLE "tb_project"
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
