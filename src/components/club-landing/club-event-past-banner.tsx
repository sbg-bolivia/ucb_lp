"use client";

import { cn } from "@/lib/utils";
import { History } from "lucide-react";
import Image from "next/image";

type Props = {
  pastFlyerUrl?: string | null;
  className?: string;
};

export function ClubEventPastBanner({ pastFlyerUrl, className }: Props) {
  const flyer = pastFlyerUrl?.trim();

  if (flyer) {
    return (
      <div
        className={cn(
          "relative mx-auto max-w-sm overflow-hidden rounded-2xl border border-[var(--border-soft)] shadow-[var(--shadow-soft)]",
          className
        )}
      >
        <div className="relative aspect-[3/4] w-full bg-[var(--bg-soft-blue)] dark:bg-[var(--surface)]">
          <Image
            src={flyer}
            alt="Flyer del evento pasado"
            fill
            className="object-cover object-center"
            sizes="320px"
          />
        </div>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          <History className="h-3 w-3" />
          Evento pasado
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[rgba(255,248,240,0.9)] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--ucb-blue)] dark:bg-[var(--surface-soft)] dark:text-[var(--aws-orange)]",
        className
      )}
    >
      <History className="h-3.5 w-3.5" />
      Evento pasado
    </div>
  );
}
