"use client";

import { ClubCtaBand } from "@/components/club-landing/club-cta-band";
import { ClubHero } from "@/components/club-landing/club-hero";
import { ClubHomeCommunity } from "@/components/club-landing/club-home-community";
import { ClubHomeEvents } from "@/components/club-landing/club-home-events";
import { ClubHomeProjects } from "@/components/club-landing/club-home-projects";
import { ClubHomeServices } from "@/components/club-landing/club-home-services";
import { ClubHomeStats } from "@/components/club-landing/club-home-stats";
import { ClubLoader } from "@/components/club-landing/club-loader";

export function HomePageContent() {
  return (
    <>
      <ClubLoader />
      <ClubHero />
      <ClubHomeStats />
      <ClubHomeServices />
      <ClubHomeEvents />
      <ClubHomeProjects />
      <ClubHomeCommunity />
      <ClubCtaBand />
    </>
  );
}
