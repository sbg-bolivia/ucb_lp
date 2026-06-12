"use client";

import { ClubAmbientModel } from "@/components/club-landing/club-ambient-model";
import { ClubLandingFooter } from "@/components/club-landing/club-landing-footer";
import { ClubLandingNavbar } from "@/components/club-landing/club-landing-navbar";
import { ClubPageEnter } from "@/components/club-landing/club-page-enter";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { clubTheme } from "./club-theme";
import { ClubPastelBlobs } from "./club-pastel-blobs";

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
    <div className={`flex min-h-screen flex-col antialiased ${clubTheme.pageBg}`}>
      <div className="club-grain" />
      <ClubPastelBlobs className="fixed inset-0 z-0" />
      <div className="relative z-[1] flex min-h-screen flex-1 flex-col">
        <ClubLandingNavbar />
        <ClubAmbientModel />
        <main className="flex-1 overflow-x-clip pt-16">
          <ClubPageEnter>{children}</ClubPageEnter>
        </main>
        <ClubLandingFooter />
      </div>
    </div>
  );
}
