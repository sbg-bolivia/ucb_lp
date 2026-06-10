"use client";

import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { ClubMarketingShell } from "@/components/club-landing/club-marketing-shell";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <ClubMarketingShell>
      <PageViewTracker />
      {children}
    </ClubMarketingShell>
  );
}
