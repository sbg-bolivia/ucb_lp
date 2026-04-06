import { ClubContactStrip } from "@/components/club-landing/club-contact-strip";
import { clubPageMeta } from "@/lib/club-page-meta";
import type { Metadata } from "next";

export const metadata: Metadata = clubPageMeta(
  "Contacto",
  "Contacto del AWS Cloud Club UCB La Paz: correo, WhatsApp y QR con enlaces a redes."
);

export default function ContactoPage() {
  return (
    <>
      <h1 className="sr-only">Contacto</h1>
      <ClubContactStrip />
    </>
  );
}
