-- CreateEnum extension
ALTER TYPE "PermissionResource" ADD VALUE IF NOT EXISTS 'CONTENT';

-- CreateTable
CREATE TABLE "club_event_versions" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changedById" TEXT,
    "changeNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "club_event_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "club_event_versions_eventId_versionNumber_idx" ON "club_event_versions"("eventId", "versionNumber" DESC);

-- AddForeignKey
ALTER TABLE "club_event_versions" ADD CONSTRAINT "club_event_versions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "club_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
