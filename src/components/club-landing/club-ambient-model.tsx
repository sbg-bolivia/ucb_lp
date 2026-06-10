"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ClubSiteModel } from "./club-site-model";

/** Marca 3D fija en páginas internas (el home usa el hero completo). */
export function ClubAmbientModel() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEnabled(mq.matches && !reduced.matches);
    update();
    mq.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  if (pathname === "/" || !enabled) return null;

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
