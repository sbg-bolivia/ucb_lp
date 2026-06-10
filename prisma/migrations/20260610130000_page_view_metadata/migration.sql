-- AlterTable
ALTER TABLE "page_view_hits" ADD COLUMN "referrer" VARCHAR(500),
ADD COLUMN "deviceType" VARCHAR(20);
