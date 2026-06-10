"use client";

import { CLUB_LOGO } from "@/lib/club-brand-assets";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Preloader del modelo 3D del hero. Lee el progreso del LoadingManager de
 * three.js (vía drei `useProgress`) y muestra una pantalla de carga con el
 * logo del club hasta que el GLB termina de descargarse.
 */
export function ClubLoader() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (active) startedRef.current = true;
  }, [active]);

  // Oculta cuando la carga termina (o por seguridad tras un máximo).
  useEffect(() => {
    if (!visible) return;
    const done = startedRef.current && !active && progress >= 100;
    if (done) {
      const t = window.setTimeout(() => setVisible(false), 280);
      return () => window.clearTimeout(t);
    }
  }, [active, progress, visible]);

  // Si nada empieza a cargar (no hay 3D) o tarda demasiado, ocultar pronto.
  useEffect(() => {
    const idle = window.setTimeout(() => {
      if (!startedRef.current) setVisible(false);
    }, 500);
    const safety = window.setTimeout(() => setVisible(false), 2200);
    return () => {
      window.clearTimeout(idle);
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const pct = Math.min(100, Math.round(progress));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="club-loader"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[var(--brand-dark)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="pointer-events-none absolute inset-0 club-aurora opacity-60"
            aria-hidden
          />
          <div className="absolute inset-0 club-grid opacity-40" aria-hidden />

          <div className="relative flex flex-col items-center gap-10 px-6">
            <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
              <span className="club-loader-ring absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--aws-orange)] border-r-[var(--aws-ink)]" />
              <span className="absolute inset-4 rounded-full border border-white/10" />
              <Image
                src={CLUB_LOGO.white}
                alt="AWS Student Builder Group UCB"
                width={120}
                height={120}
                className="club-loader-logo h-24 w-24 object-contain sm:h-28 sm:w-28"
                priority
              />
            </div>

            <div className="w-72 sm:w-80">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#E88B00] via-[var(--aws-orange)] to-[#FFAD33]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <span className="club-loader-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                <span>Construyendo en la nube</span>
                <span className="tabular-nums text-zinc-300">{pct}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
