"use client";

import { ClubCursorField } from "@/components/club-landing/club-cursor-field";
import { ClubLandingFooter } from "@/components/club-landing/club-landing-footer";
import { ClubLandingNavbar } from "@/components/club-landing/club-landing-navbar";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { clubTheme } from "./club-theme";

export function ClubMarketingShell({
  children,
}: { children: React.ReactNode }) {
  const { setTheme } = useTheme();

  // El landing es "dark-first" (como la referencia). Si el usuario aún no eligió
  // tema, arrancamos en oscuro; el toggle queda totalmente funcional después.
  useEffect(() => {
    try {
      if (!window.localStorage.getItem("theme")) setTheme("dark");
    } catch {
      /* no-op */
    }
  }, [setTheme]);

  return (
    <div className={`min-h-screen max-w-[100vw] overflow-x-clip antialiased ${clubTheme.pageBg}`}>
      <div className="club-grain" />
      <ClubCursorField className="club-cursor-field" />
      <ClubLandingNavbar />
      <main className="pt-16">{children}</main>
      <ClubLandingFooter />
    </div>
  );
}
