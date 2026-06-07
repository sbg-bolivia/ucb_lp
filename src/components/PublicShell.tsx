"use client";

import { ClubMarketingShell } from "@/components/club-landing/club-marketing-shell";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <ClubMarketingShell>{children}</ClubMarketingShell>;
}
