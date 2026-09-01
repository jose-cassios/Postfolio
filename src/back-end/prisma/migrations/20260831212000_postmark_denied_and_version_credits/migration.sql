-- PostgreSQL updates existing stored enum values during this rename. The guard
-- also makes the script safe for development databases updated before their
-- migration history was baselined.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_enum enum
    JOIN pg_type type ON type.oid = enum.enumtypid
    WHERE type.typname = 'AppreciateStatus' AND enum.enumlabel = 'DISMISSED'
  ) THEN
    EXECUTE 'ALTER TYPE "AppreciateStatus" RENAME VALUE ''DISMISSED'' TO ''DENIED''';
  END IF;
END $$;

-- A Postmark can be credited in later versions, but only once per version.
DROP INDEX IF EXISTS "tb_project_version_credit_appreciationId_key";
