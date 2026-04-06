"use client";

import { ClubMarketingShell } from "@/components/club-landing/club-marketing-shell";
import { Footer } from "@/components/Footer";
import GlobalNavbar from "@/components/GlobalNavbar";
import { isClubMarketingPath } from "@/constants/club-routes";
import { usePathname } from "next/navigation";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isClubMarketingPath(pathname)) {
    return <ClubMarketingShell>{children}</ClubMarketingShell>;
  }

  return (
    <>
      <GlobalNavbar />
      {children}
      <Footer />
    </>
  );
}
