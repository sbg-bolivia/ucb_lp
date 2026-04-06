"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { clubEase, fadeUpProps } from "@/lib/club-motion";
import { CLUB } from "@/lib/club-brand";
import { Instagram, Linkedin, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import { TiktokGlyph } from "./club-social-icons";
import { clubTheme } from "./club-theme";

function MeetupMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded bg-white text-[11px] font-bold text-[#F05663] ${className}`}
      aria-hidden
    >
      m
    </span>
  );
}

export function ClubCtaBand() {
  const L = useClubLinks();

  return (
    <section
      id="cta"
      className={`relative px-4 py-16 sm:px-6 sm:py-24 ${clubTheme.sectionSoft}`}
      aria-labelledby="cta-heading"
    >
      <motion.div
        className={`mx-auto max-w-5xl rounded-[2rem] p-10 text-center shadow-2xl shadow-[#3b41ff]/25 sm:p-14 md:p-16 ${clubTheme.gradientCta}`}
        {...fadeUpProps}
        transition={{ duration: 0.6, ease: clubEase }}
      >
        <h2
          id="cta-heading"
          className="text-2xl font-bold text-white sm:text-3xl md:text-4xl"
        >
          Únete a nuestras redes — empieza por Meetup
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-white/95 sm:text-base">
          En el {CLUB.shortName}, el canal principal de eventos e inscripciones
          es <strong className="text-white">Meetup</strong>. Ahí publicamos
          fechas, lugares y materiales. También estamos en WhatsApp, TikTok y
          más.
        </p>

        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
          {L.meetupUrl ? (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={L.meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-bold text-white shadow-xl sm:w-auto ${clubTheme.meetupHighlight}`}
              >
                <MeetupMark />
                Unirse en Meetup
              </Link>
            </motion.div>
          ) : null}

          {L.whatsappUrl ? (
            <Link
              href={L.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </Link>
          ) : null}

          {L.tiktokUrl ? (
            <Link
              href={L.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <TiktokGlyph className="h-5 w-5" />
              TikTok
            </Link>
          ) : null}

          {L.linkedinUrl ? (
            <Link
              href={L.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5" />
              LinkedIn
            </Link>
          ) : null}

          {L.instagramUrl ? (
            <Link
              href={L.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-transparent px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <Instagram className="h-5 w-5" />
              Instagram
            </Link>
          ) : null}
        </div>

        {!L.meetupUrl && !L.whatsappUrl ? (
          <p className="mt-6 text-xs text-white/90">
            ¿Dudas? Escríbenos en{" "}
            <Link
              href="/contacto"
              className="font-semibold underline underline-offset-2"
            >
              contacto
            </Link>{" "}
            o visita el QR de redes.
          </p>
        ) : null}
      </motion.div>
    </section>
  );
}
