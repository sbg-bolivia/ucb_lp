"use client";

import { ClubActivities } from "@/components/club-landing/club-activities";
import { ClubCtaBand } from "@/components/club-landing/club-cta-band";
import { ClubHero } from "@/components/club-landing/club-hero";
import { ClubHomeHighlights } from "@/components/club-landing/club-home-highlights";
import { ClubHomeLandingExtras } from "@/components/club-landing/club-home-landing-extras";

export function HomePageContent() {
  return (
    <>
      <ClubHero />
      <ClubHomeLandingExtras />
      <ClubHomeHighlights />
      <ClubActivities />
      <ClubCtaBand />
    </>
  );
}
