"use client";

import { usePathname } from "next/navigation";

import { ClubSiteModel } from "./club-site-model";

/** Marca 3D fija en páginas internas (el home usa el hero completo). */
export function ClubAmbientModel() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <div
      className="club-ambient-model pointer-events-none fixed z-[15]"
      aria-label="Logo 3D del AWS Student Builder Group"
    >
      <div className="club-ambient-model-inner pointer-events-auto">
        <ClubSiteModel variant="ambient" autoRotate />
      </div>
    </div>
  );
}
