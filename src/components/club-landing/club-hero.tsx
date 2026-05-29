"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { ArrowRight, Rotate3d, Loader2 } from "lucide-react";
import { clubTheme } from "./club-theme";

// El modelo se carga en cliente
const ClubHeroModel = dynamic(
  () => import("./club-hero-model").then((m) => m.ClubHeroModel),
  { 
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center text-[#A855F7]">
        <Loader2 className="h-8 w-8 animate-spin opacity-50" />
      </div>
    )
  }
);

export function ClubHero() {
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const links = useClubLinks();

  const primaryJoin = () => {
    if (isAuthenticated) router.push("/dashboard");
    else if (links.meetupUrl)
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    else router.push("/unete");
  };

  return (
    <section className="relative min-h-screen bg-[#050608] flex flex-col items-center justify-between py-24 px-4 overflow-hidden">
      
      {/* Fondos dinámicos */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="club-aurora opacity-70" />
        <div className="absolute inset-0 club-grid opacity-30" />
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-[#050608]/50 to-[#0C0D12] ${clubTheme.gradientHeroOverlay}`} />
      </div>

      {/* 1. TEXTO ARRIBA */}
      <div className="relative z-10 flex flex-col items-center text-center mt-8 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs sm:text-sm font-bold uppercase tracking-[0.4em] text-[#00C8FF]">
            {CLUB.heroLine1}
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[0.9] tracking-tighter text-white">
            Construye.<br />
            <span className="bg-gradient-to-br from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] bg-clip-text text-transparent">
              Aprende.
            </span>
          </h1>
        </motion.div>
      </div>

      {/* 2. MODELO 3D EN EL CENTRO (Estable y centrado desde el primer milisegundo) */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div className="w-full h-full max-w-[1200px] flex items-center justify-center pointer-events-auto">
          <div className="relative w-full h-[70vh] min-h-[500px]">
             <ClubHeroModel autoRotate={true} />
             <p className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 pointer-events-none flex items-center gap-2 opacity-50">
               <Rotate3d className="w-3 h-3 text-[#A855F7]" />
               Arrastra para rotar
             </p>
          </div>
        </div>
      </div>

      {/* 3. BOTÓN Y DESCRIPCIÓN ABAJO */}
      <div className="relative z-30 flex flex-col items-center text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          <p className="mb-8 max-w-xl mx-auto text-base sm:text-lg text-zinc-200 font-medium tracking-tight bg-black/60 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
            Diseñado para mentes audaces. Crea soluciones en la nube de nivel mundial con la comunidad AWS más activa.
          </p>

          <Button
            size="lg"
            onClick={primaryJoin}
            className="group h-14 sm:h-16 rounded-full bg-gradient-to-r from-[#FF512F] to-[#DD2476] px-10 sm:px-12 text-base sm:text-lg font-bold text-white shadow-[0_0_40px_rgba(221,36,118,0.5)] hover:shadow-[0_0_60px_rgba(221,36,118,0.8)] hover:-translate-y-1 hover:scale-105 transition-all duration-300 border-none pointer-events-auto"
          >
            {isAuthenticated ? "Ir al panel" : "Únete a la élite"}
            <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

    </section>
  );
}
