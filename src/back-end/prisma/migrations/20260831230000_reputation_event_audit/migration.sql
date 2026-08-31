ALTER TABLE "tb_reputation_event"
  ADD COLUMN IF NOT EXISTS "reason" TEXT,
  ADD COLUMN IF NOT EXISTS "adminId" TEXT,
  ADD COLUMN IF NOT EXISTS "reversalOfId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "tb_reputation_event_reversalOfId_key"
  ON "tb_reputation_event"("reversalOfId");

DO $$
BEGIN
  ALTER TABLE "tb_reputation_event"
    ADD CONSTRAINT "tb_reputation_event_reversalOfId_fkey"
    FOREIGN KEY ("reversalOfId") REFERENCES "tb_reputation_event"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
