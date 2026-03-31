DROP INDEX IF EXISTS "Visitor_visitorId_key";

ALTER TABLE "Visitor"
ADD COLUMN IF NOT EXISTS "path" TEXT,
ADD COLUMN IF NOT EXISTS "pageType" TEXT,
ADD COLUMN IF NOT EXISTS "entityType" TEXT,
ADD COLUMN IF NOT EXISTS "entityId" TEXT,
ADD COLUMN IF NOT EXISTS "entityName" TEXT;

UPDATE "Visitor"
SET
  "path" = COALESCE("path", '/'),
  "pageType" = COALESCE("pageType", 'STORE_HOME'),
  "entityType" = COALESCE("entityType", 'STORE'),
  "entityId" = COALESCE("entityId", "storeName"),
  "entityName" = COALESCE("entityName", "storeName")
WHERE "storeName" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "Visitor_storeName_createdAt_idx"
  ON "Visitor"("storeName", "createdAt");

CREATE INDEX IF NOT EXISTS "Visitor_storeName_pageType_createdAt_idx"
  ON "Visitor"("storeName", "pageType", "createdAt");

CREATE INDEX IF NOT EXISTS "Visitor_storeName_entityType_entityId_idx"
  ON "Visitor"("storeName", "entityType", "entityId");

CREATE INDEX IF NOT EXISTS "Visitor_visitorId_createdAt_idx"
  ON "Visitor"("visitorId", "createdAt");
