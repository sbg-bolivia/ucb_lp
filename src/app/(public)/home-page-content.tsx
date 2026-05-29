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
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <ClubHomeServices />
      </div>
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <ClubHomeEvents />
      </div>
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <ClubHomeProjects />
      </div>
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '800px' }}>
        <ClubHomeCommunity />
      </div>
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}>
        <ClubCtaBand />
      </div>
    </>
  );
}
