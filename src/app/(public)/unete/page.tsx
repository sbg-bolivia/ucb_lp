import { ClubCtaBand } from "@/components/club-landing/club-cta-band";
import { CLUB } from "@/lib/club-brand";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Únete",
  `Únete al ${CLUB.shortName} por Meetup, WhatsApp y redes. Eventos y comunidad en ${CLUB.city}.`
);

export default function UnetePage() {
  return (
    <div className="px-4 pb-8 pt-6 sm:px-6 sm:pb-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Forma parte del club
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-zinc-400">
          Empieza por <strong className="text-[#F05663]">Meetup</strong> para
          eventos e inscripciones; WhatsApp y el resto de redes para la
          comunidad y novedades.
        </p>
      </div>
      <ClubCtaBand />
    </div>
  );
}
