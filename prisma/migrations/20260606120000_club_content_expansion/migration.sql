-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('MANUAL', 'MEETUP', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'UPCOMING', 'PAST', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('MEETUP', 'YOUTUBE', 'GOOGLE_MEET', 'ZOOM', 'TEAMS', 'EXTERNAL', 'NONE');

-- CreateEnum
CREATE TYPE "AwsCommunityType" AS ENUM ('STUDENT_BUILDER_GROUP', 'USER_GROUP', 'CLOUD_CLUB', 'COMMUNITY_DAY', 'OTHER');

-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOME_HERO', 'HOME_SECONDARY', 'EVENTS_PAGE', 'SERVICES_PAGE');

-- CreateEnum
CREATE TYPE "AwsServiceCategory" AS ENUM ('COMPUTE', 'STORAGE', 'DATABASE', 'NETWORKING', 'SECURITY', 'ANALYTICS', 'MACHINE_LEARNING', 'INTEGRATION', 'MANAGEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AwsServiceCardType" AS ENUM ('USE_CASE', 'TIP', 'WARNING', 'LAB', 'PRICING', 'ARCHITECTURE', 'RELATED_LINK', 'CUSTOM');

-- CreateEnum
CREATE TYPE "AwsDifficultyLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "mission" TEXT,
ADD COLUMN     "vision" TEXT,
ADD COLUMN     "heroVideoUrl" TEXT;

-- AlterTable
ALTER TABLE "club_events" ADD COLUMN     "registrationUrl" TEXT,
ADD COLUMN     "registrationType" "RegistrationType" NOT NULL DEFAULT 'EXTERNAL',
ADD COLUMN     "source" "EventSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING',
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "attendeeCount" INTEGER,
ADD COLUMN     "promoVideoUrl" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "meetupEventId" TEXT,
ADD COLUMN     "lastSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "club_events_meetupEventId_key" ON "club_events"("meetupEventId");

-- CreateIndex
CREATE INDEX "club_events_tenantId_status_startsAt_idx" ON "club_events"("tenantId", "status", "startsAt");

-- CreateTable
CREATE TABLE "aws_communities" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "communityType" "AwsCommunityType" NOT NULL DEFAULT 'USER_GROUP',
    "university" TEXT,
    "department" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'BO',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "description" TEXT,
    "meetupUrl" TEXT,
    "websiteUrl" TEXT,
    "logoUrl" TEXT,
    "isOwnGroup" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aws_communities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_collaborations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_banners" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'HOME_HERO',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_team_members" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "bio" TEXT,
    "photoUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "githubUrl" TEXT,
    "email" TEXT,
    "badgeLabel" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "core_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aws_services" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "AwsServiceCategory" NOT NULL DEFAULT 'COMPUTE',
    "shortDescription" TEXT NOT NULL,
    "technicalExplanation" TEXT,
    "whenToUse" TEXT,
    "whenNotToUse" TEXT,
    "officialDocsUrl" TEXT,
    "iconUrl" TEXT,
    "coverImageUrl" TEXT,
    "promoVideoUrl" TEXT,
    "resources" JSONB,
    "popularityScore" INTEGER,
    "difficultyLevel" "AwsDifficultyLevel",
    "pricingNote" TEXT,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aws_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aws_service_cards" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "cardType" "AwsServiceCardType" NOT NULL DEFAULT 'USE_CASE',
    "title" TEXT,
    "content" TEXT NOT NULL,
    "iconKey" TEXT,
    "linkUrl" TEXT,
    "linkLabel" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aws_service_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "club_projects" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "imageUrl" TEXT,
    "projectUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "club_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "aws_communities_tenantId_isPublished_sortOrder_idx" ON "aws_communities"("tenantId", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "aws_communities_tenantId_city_idx" ON "aws_communities"("tenantId", "city");

-- CreateIndex
CREATE UNIQUE INDEX "event_collaborations_eventId_communityId_key" ON "event_collaborations"("eventId", "communityId");

-- CreateIndex
CREATE INDEX "event_collaborations_communityId_idx" ON "event_collaborations"("communityId");

-- CreateIndex
CREATE INDEX "site_banners_tenantId_isActive_placement_idx" ON "site_banners"("tenantId", "isActive", "placement");

-- CreateIndex
CREATE INDEX "core_team_members_tenantId_isPublished_sortOrder_idx" ON "core_team_members"("tenantId", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "aws_services_tenantId_isPublished_category_idx" ON "aws_services"("tenantId", "isPublished", "category");

-- CreateIndex
CREATE UNIQUE INDEX "aws_services_tenantId_slug_key" ON "aws_services"("tenantId", "slug");

-- CreateIndex
CREATE INDEX "aws_service_cards_serviceId_isPublished_sortOrder_idx" ON "aws_service_cards"("serviceId", "isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "club_projects_tenantId_idx" ON "club_projects"("tenantId");

-- CreateIndex
CREATE INDEX "club_projects_tenantId_isPublished_sortOrder_idx" ON "club_projects"("tenantId", "isPublished", "sortOrder");

-- AddForeignKey
ALTER TABLE "aws_communities" ADD CONSTRAINT "aws_communities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_collaborations" ADD CONSTRAINT "event_collaborations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "club_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_collaborations" ADD CONSTRAINT "event_collaborations_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "aws_communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_banners" ADD CONSTRAINT "site_banners_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_team_members" ADD CONSTRAINT "core_team_members_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aws_services" ADD CONSTRAINT "aws_services_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aws_service_cards" ADD CONSTRAINT "aws_service_cards_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "aws_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "club_projects" ADD CONSTRAINT "club_projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
