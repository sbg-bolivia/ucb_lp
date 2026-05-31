"use client";

import { ClubLandingFooter } from "@/components/club-landing/club-landing-footer";
import { ClubLandingNavbar } from "@/components/club-landing/club-landing-navbar";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { clubTheme } from "./club-theme";

export function ClubMarketingShell({
  children,
}: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  // El landing respeta la preferencia del usuario; si no hay tema guardado,
  // arrancamos en oscuro como default de marketing.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("theme")) setTheme("dark");
    } catch {
      /* no-op */
    }
  }, [setTheme]);

  return (
    <div className={`min-h-screen antialiased ${clubTheme.pageBg}`}>
      <div className="club-grain" />
      <ClubLandingNavbar />
      <main className="overflow-x-clip pt-16">{children}</main>
      <ClubLandingFooter />
    </div>
  );
}
