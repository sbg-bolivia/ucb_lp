-- CreateTable
CREATE TABLE "club_events" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "location" TEXT,
    "imageUrl" TEXT,
    "externalUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "club_events_tenantId_idx" ON "club_events"("tenantId");

-- CreateIndex
CREATE INDEX "club_events_tenantId_isPublished_startsAt_idx" ON "club_events"("tenantId", "isPublished", "startsAt");

-- AddForeignKey
ALTER TABLE "club_events" ADD CONSTRAINT "club_events_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
