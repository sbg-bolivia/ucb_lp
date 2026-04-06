"use client";

import { ClubLandingFooter } from "@/components/club-landing/club-landing-footer";
import { ClubLandingNavbar } from "@/components/club-landing/club-landing-navbar";
import { clubTheme } from "@/components/club-landing/club-theme";

export function ClubMarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`min-h-screen antialiased selection:bg-violet-400/35 dark:selection:bg-violet-500/25 ${clubTheme.pageBg}`}
    >
      <ClubLandingNavbar />
      <main className="pt-16">{children}</main>
      <ClubLandingFooter />
    </div>
  );
}
