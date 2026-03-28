-- CreateEnum
CREATE TYPE "public"."TranslationStatus" AS ENUM ('DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "public"."locales" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "locale" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "currencySymbol" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "flagUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."translations" (
    "id" TEXT NOT NULL,
    "translatableType" TEXT NOT NULL,
    "translatableId" TEXT NOT NULL,
    "localeId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "translatedValue" TEXT NOT NULL,
    "translationStatus" "public"."TranslationStatus" NOT NULL DEFAULT 'DRAFT',
    "translatorNotes" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locales_languageCode_key" ON "public"."locales"("languageCode");

-- CreateIndex
CREATE INDEX "locales_languageCode_idx" ON "public"."locales"("languageCode");

-- CreateIndex
CREATE INDEX "locales_isActive_idx" ON "public"."locales"("isActive");

-- CreateIndex
CREATE INDEX "translations_translatableType_translatableId_localeId_idx" ON "public"."translations"("translatableType", "translatableId", "localeId");

-- CreateIndex
CREATE INDEX "translations_localeId_idx" ON "public"."translations"("localeId");

-- CreateIndex
CREATE INDEX "translations_translationStatus_idx" ON "public"."translations"("translationStatus");

-- CreateIndex
CREATE INDEX "translations_tenantId_idx" ON "public"."translations"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "translations_translatableType_translatableId_localeId_field_key" ON "public"."translations"("translatableType", "translatableId", "localeId", "fieldName", "tenantId");

-- AddForeignKey
ALTER TABLE "public"."translations" ADD CONSTRAINT "translations_localeId_fkey" FOREIGN KEY ("localeId") REFERENCES "public"."locales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."translations" ADD CONSTRAINT "translations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
