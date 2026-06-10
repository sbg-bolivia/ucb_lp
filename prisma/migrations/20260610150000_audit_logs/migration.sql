-- Idempotente: la migración pudo fallar a medias si AuditAction ya existía (P3018 / 42710)

DO $$ BEGIN
    CREATE TYPE "AuditAction" AS ENUM (
        'CREATE',
        'UPDATE',
        'DELETE',
        'RESTORE',
        'REORDER',
        'LOGIN',
        'LOGOUT',
        'OTHER'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "action" "AuditAction" NOT NULL,
    "resource" VARCHAR(80) NOT NULL,
    "resourceId" VARCHAR(80),
    "summary" VARCHAR(500) NOT NULL,
    "changes" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" VARCHAR(500),
    "procedure" VARCHAR(200),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "audit_logs_tenantId_createdAt_idx"
    ON "audit_logs"("tenantId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "audit_logs_userId_createdAt_idx"
    ON "audit_logs"("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "audit_logs_resource_createdAt_idx"
    ON "audit_logs"("resource", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "audit_logs_action_createdAt_idx"
    ON "audit_logs"("action", "createdAt" DESC);

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_tenantId_fkey'
    ) THEN
        ALTER TABLE "audit_logs"
            ADD CONSTRAINT "audit_logs_tenantId_fkey"
            FOREIGN KEY ("tenantId") REFERENCES "tenants"("id")
            ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_userId_fkey'
    ) THEN
        ALTER TABLE "audit_logs"
            ADD CONSTRAINT "audit_logs_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
