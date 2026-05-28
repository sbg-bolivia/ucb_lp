"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { Heart, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";

import { TiktokGlyph } from "./club-social-icons";
import { clubTheme } from "./club-theme";

function MeetupGlyphSmall({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="Meetup"
    >
      <title>Meetup</title>
      <path d="M20.5 6.5c-.7 0-1.3.6-1.3 1.3s.6 1.3 1.3 1.3 1.3-.6 1.3-1.3-.6-1.3-1.3-1.3zm-1.9 3.4c0-.2-.2-.4-.4-.4h-1.7c-.2 0-.4.2-.4.4v7.6c0 .2.2.4.4.4h1.7c.2 0 .4-.2.4-.4v-7.6zm-4.5-.1h-1.7c-.2 0-.4.2-.4.4v4.9l-2.4-5.1c-.1-.2-.3-.3-.5-.3h-1.5c-.2 0-.4.2-.4.4v7.6c0 .2.2.4.4.4h1.7c.2 0 .4-.2.4-.4v-4.9l2.4 5.1c.1.2.3.3.5.3h1.5c.2 0 .4-.2.4-.4V10c0-.2-.2-.4-.4-.4zm-8.3 0H4.1c-.2 0-.4.2-.4.4v7.6c0 .2.2.4.4.4h1.7c.2 0 .4-.2.4-.4V14h1.8c1.8 0 3.2-1.4 3.2-3.2 0-1.7-1.4-3.1-3.2-3.1zm0 4.4H6.2v-2.6h1.8c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3z" />
    </svg>
  );
}

const FOOTER_NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/beneficios", label: "Beneficios" },
  { href: "/eventos", label: "Eventos" },
  { href: "/equipo", label: "Equipo" },
  { href: "/unete", label: "Únete" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function ClubLandingFooter() {
  const year = new Date().getFullYear();
  const L = useClubLinks();

  return (
    <footer
      className="border-t border-violet-200/70 bg-white/70 px-4 pb-10 pt-12 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/85 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3 text-sm text-slate-600 dark:text-zinc-400">
          <p className="bg-gradient-to-r from-[#3b41ff] to-[#6a11cb] bg-clip-text text-lg font-bold text-transparent">
            AWS Student Builder Groups
          </p>
          <p>
            © {year} {CLUB.shortName}. Todos los derechos reservados.
          </p>
          <p className="flex flex-wrap items-center gap-1">
            Hecho con
            <Heart
              className="inline h-3.5 w-3.5 text-[#6a11cb]"
              fill="currentColor"
              aria-hidden
            />
            por el equipo ·{" "}
            <span className="font-medium text-[#5c27c4]">
              {CLUB.fullUniversity}
            </span>
          </p>
        </div>

        <nav className="flex flex-col gap-2 text-sm" aria-label="Secciones">
          <p className={`mb-1 font-bold ${clubTheme.textHeading}`}>Sitio</p>
          {FOOTER_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-slate-600 transition hover:text-[#3b41ff] dark:text-zinc-400 dark:hover:text-violet-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-wrap items-center gap-2" aria-label="Redes">
          <p className="mb-0 w-full font-bold text-slate-900 sm:mb-2">Redes</p>
          {L.meetupUrl ? (
            <Link
              href={L.meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-[#F05663] transition hover:bg-rose-50 hover:scale-110"
              aria-label="Meetup del club"
            >
              <MeetupGlyphSmall className="h-5 w-5" />
            </Link>
          ) : null}
          {L.whatsappUrl ? (
            <Link
              href={L.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-emerald-600 transition hover:bg-emerald-50 hover:scale-110"
              aria-label="WhatsApp del club"
            >
              <MessageCircle className="h-5 w-5" />
            </Link>
          ) : null}
          {L.tiktokUrl ? (
            <Link
              href={L.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-slate-800 transition hover:bg-violet-50 hover:scale-110"
              aria-label="TikTok del club"
            >
              <TiktokGlyph className="h-5 w-5" />
            </Link>
          ) : null}
          {L.linkedinUrl ? (
            <Link
              href={L.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-[#0A66C2] transition hover:bg-blue-50 hover:scale-110"
              aria-label="LinkedIn del club"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          ) : null}
          {L.instagramUrl ? (
            <Link
              href={L.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-pink-600 transition hover:bg-pink-50 hover:scale-110"
              aria-label="Instagram del club"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          ) : null}
        </nav>
      </div>

      <div className="mx-auto mt-10 max-w-6xl flex flex-wrap gap-4 border-t border-violet-200/60 pt-8 text-xs text-slate-500 dark:border-white/10 dark:text-zinc-500">
        <Link href="/legal/terms" className="hover:text-[#3b41ff] dark:hover:text-violet-300">
          Términos
        </Link>
        <Link href="/legal/privacy" className="hover:text-[#3b41ff] dark:hover:text-violet-300">
          Privacidad
        </Link>
        <Link href="/legal/cookies" className="hover:text-[#3b41ff] dark:hover:text-violet-300">
          Cookies
        </Link>
      </div>
    </footer>
  );
}
