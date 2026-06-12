"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/** Nubes pastel orgánicas para el hero — visibles en modo claro */
export function ClubHeroClouds({ className }: Props) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden dark:opacity-25",
        className
      )}
      aria-hidden
    >
      <div
        className="club-hero-cloud absolute -left-[12%] top-[8%] h-[min(380px,52vw)] w-[min(520px,72vw)] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 50%, var(--pastel-blue) 0%, transparent 72%)",
        }}
      />
      <div
        className="club-hero-cloud absolute -right-[10%] top-[4%] h-[min(340px,48vw)] w-[min(480px,68vw)] opacity-75 [animation-delay:-6s]"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, var(--aws-orange-pastel) 0%, transparent 70%)",
        }}
      />
      <div
        className="club-hero-cloud absolute bottom-[2%] left-[6%] h-[min(300px,42vw)] w-[min(420px,58vw)] opacity-55 [animation-delay:-12s]"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, var(--pastel-violet) 0%, transparent 68%)",
        }}
      />
      <div
        className="club-hero-cloud absolute bottom-[6%] right-[4%] h-[min(280px,38vw)] w-[min(380px,52vw)] opacity-50 [animation-delay:-4s]"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 50% 50%, var(--pastel-pink-soft) 0%, transparent 70%)",
        }}
      />
      <div
        className="club-hero-cloud absolute left-[28%] top-[42%] h-[min(220px,32vw)] w-[min(320px,44vw)] opacity-40 [animation-delay:-9s]"
        style={{
          background:
            "radial-gradient(ellipse 50% 55% at 50% 50%, var(--ucb-yellow-soft) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
