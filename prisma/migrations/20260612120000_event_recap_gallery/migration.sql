-- Galería recap y flyer para eventos pasados
ALTER TABLE "club_events" ADD COLUMN IF NOT EXISTS "pastFlyerUrl" TEXT;
ALTER TABLE "club_events" ADD COLUMN IF NOT EXISTS "recapGallery" JSONB;
