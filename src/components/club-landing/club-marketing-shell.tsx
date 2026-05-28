"use client";

import { ClubLandingFooter } from "@/components/club-landing/club-landing-footer";
import { ClubLandingNavbar } from "@/components/club-landing/club-landing-navbar";
export function ClubMarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="dark min-h-screen max-w-[100vw] overflow-x-hidden bg-[#0C0D12] text-white antialiased selection:bg-violet-500/25"
    >
      <ClubLandingNavbar />
      <main className="pt-16">{children}</main>
      <ClubLandingFooter />
    </div>
  );
}
