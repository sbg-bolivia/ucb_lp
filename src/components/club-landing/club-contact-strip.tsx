"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { fadeUpProps } from "@/lib/club-motion";
import { Mail, MessageCircle, QrCode } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { clubTheme } from "./club-theme";

export function ClubContactStrip() {
  const L = useClubLinks();

  return (
    <section
      id="contacto"
      className={`border-t border-violet-200/60 px-4 py-16 sm:px-6 sm:py-24 dark:border-white/10 ${clubTheme.sectionTint}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            className="text-center lg:text-left"
            {...fadeUpProps}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#3b41ff] to-[#6a11cb]">
              Contacto
            </p>
            <h2
              className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${clubTheme.textHeading}`}
            >
              ¿Preguntas o alianzas?
            </h2>
            <p className={`mt-4 max-w-xl text-base sm:text-lg lg:mx-0 lg:max-w-none ${clubTheme.textMuted}`}>
              Escríbenos por correo o entra al grupo de WhatsApp. El QR agrupa
              nuestros enlaces (Linktree).
            </p>
            <a
              href={`mailto:${CLUB.email}`}
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-6 py-3 text-sm font-semibold text-[#5c27c4] shadow-sm transition hover:border-[#3b41ff] hover:shadow-md dark:border-violet-600 dark:bg-zinc-900 dark:text-violet-200 dark:hover:border-violet-400"
            >
              <Mail className="h-4 w-4 text-[#3b41ff]" />
              {CLUB.email}
            </a>
            {L.whatsappUrl ? (
              <div className="mt-4">
                <a
                  href={L.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >
                  <MessageCircle className="h-4 w-4" />
                  Grupo de WhatsApp
                </a>
              </div>
            ) : null}
            <div className="mt-6 text-sm text-slate-500 dark:text-zinc-500">
              Eventos e inscripciones:{" "}
              <Link
                href="/unete"
                className="font-semibold text-[#3b41ff] hover:underline dark:text-violet-300"
              >
                página Únete (Meetup)
              </Link>
              .
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center lg:items-end"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`relative w-full max-w-sm ${clubTheme.card} p-8`}>
              <div className="mb-4 flex items-center justify-center gap-2 text-slate-600 dark:text-zinc-400">
                <QrCode className="h-5 w-5 text-[#6a11cb] dark:text-violet-400" aria-hidden />
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">
                  Redes (Linktree)
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white p-4 shadow-inner dark:border-violet-800 dark:bg-zinc-950">
                <Image
                  src="/qr_redes.png"
                  alt="Código QR con enlaces a redes sociales del club"
                  width={320}
                  height={320}
                  className="h-auto w-full object-contain"
                />
              </div>
              <p className="mt-4 text-center text-xs text-slate-500 dark:text-zinc-500">
                Escanea con la cámara del teléfono para abrir el árbol de
                enlaces.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
