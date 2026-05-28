"use client";

import { ClubCtaBand } from "@/components/club-landing/club-cta-band";
import { ClubHero } from "@/components/club-landing/club-hero";
import { ClubHomeBenefits } from "@/components/club-landing/club-home-benefits";
import { ClubHomeCommunity } from "@/components/club-landing/club-home-community";
import { ClubHomeEvents } from "@/components/club-landing/club-home-events";
import { ClubHomeProjects } from "@/components/club-landing/club-home-projects";
import { ClubHomeStats } from "@/components/club-landing/club-home-stats";

export function HomePageContent() {
  return (
    <>
      <ClubHero />
      <ClubHomeStats />
      <ClubHomeEvents />
      <ClubHomeProjects />
      <ClubHomeCommunity />
      <ClubHomeBenefits />
      <ClubCtaBand />
    </>
  );
}
