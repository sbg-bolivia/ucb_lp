import { clubPageMeta } from "@/lib/club-page-meta";
import { CLUB } from "@/lib/club-brand";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = clubPageMeta(
  "Únete",
  `Únete al ${CLUB.shortName} por Meetup, WhatsApp y redes. Eventos y comunidad en ${CLUB.city}.`
);

export default function UnetePage() {
  redirect("/#unete");
}
