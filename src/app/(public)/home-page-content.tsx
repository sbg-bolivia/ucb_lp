"use client";

import dynamic from "next/dynamic";
import { ClubHero } from "@/components/club-landing/club-hero";
import { ClubSiteBanners } from "@/components/club-landing/club-site-banners";
import { ClubHomeStats } from "@/components/club-landing/club-home-stats";
import { isClubFeatureEnabled } from "@/lib/club-features";

const ClubLoader = dynamic(
  () =>
    import("@/components/club-landing/club-loader").then((m) => m.ClubLoader),
  { ssr: false }
);

const ClubHomeServices = dynamic(
  () =>
    import("@/components/club-landing/club-home-services").then(
      (m) => m.ClubHomeServices
    ),
  { loading: () => <SectionPlaceholder /> }
);

const ClubHomeEvents = dynamic(
  () =>
    import("@/components/club-landing/club-home-events").then(
      (m) => m.ClubHomeEvents
    ),
  { loading: () => <SectionPlaceholder /> }
);

const ClubHomeProjects = dynamic(
  () =>
    import("@/components/club-landing/club-home-projects").then(
      (m) => m.ClubHomeProjects
    ),
  { loading: () => <SectionPlaceholder /> }
);

const ClubHomeCommunity = dynamic(
  () =>
    import("@/components/club-landing/club-home-community").then(
      (m) => m.ClubHomeCommunity
    ),
  { loading: () => <SectionPlaceholder /> }
);

const ClubHomeCampusGallery = dynamic(
  () =>
    import("@/components/club-landing/club-home-campus-gallery").then(
      (m) => m.ClubHomeCampusGallery
    ),
  { loading: () => <SectionPlaceholder /> }
);

function SectionPlaceholder({ short }: { short?: boolean }) {
  return (
    <div
      className={`mx-auto max-w-7xl animate-pulse px-4 sm:px-6 ${short ? "py-12" : "py-16 sm:py-20"}`}
      aria-hidden
    >
      <div className="mx-auto h-8 max-w-md rounded-full bg-black/5 dark:bg-white/10" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-40 rounded-3xl bg-black/5 dark:bg-white/[0.04]" />
        <div className="h-40 rounded-3xl bg-black/5 dark:bg-white/[0.04]" />
        <div className="hidden h-40 rounded-3xl bg-black/5 dark:bg-white/[0.04] lg:block" />
      </div>
    </div>
  );
}

export function HomePageContent() {
  return (
    <>
      <ClubLoader />
      <ClubHero />
      <ClubSiteBanners placement="HOME_HERO" variant="hero" />
      <ClubHomeStats />
      <ClubSiteBanners placement="HOME_SECONDARY" variant="secondary" />
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}>
        <ClubHomeServices />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}>
        <ClubHomeEvents />
      </div>
      {isClubFeatureEnabled("projects") ? (
        <div
          style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}
        >
          <ClubHomeProjects />
        </div>
      ) : null}
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "800px" }}>
        <ClubHomeCommunity />
      </div>
      <div style={{ contentVisibility: "auto", containIntrinsicSize: "600px" }}>
        <ClubHomeCampusGallery />
      </div>
    </>
  );
}
