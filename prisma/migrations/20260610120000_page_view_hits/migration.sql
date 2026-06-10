-- CreateTable
CREATE TABLE "page_view_hits" (
    "id" TEXT NOT NULL,
    "path" VARCHAR(500) NOT NULL,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_view_hits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_view_hits_createdAt_idx" ON "page_view_hits"("createdAt");

-- CreateIndex
CREATE INDEX "page_view_hits_path_idx" ON "page_view_hits"("path");
