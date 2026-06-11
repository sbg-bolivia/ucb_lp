"use client";

import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { getClubNavLinks } from "@/lib/club-nav-links";
import { Heart, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";

import { ClubNavLogo } from "./club-logo";
import { clubTheme } from "./club-theme";
import { TiktokGlyph } from "./club-social-icons";

const NAV = getClubNavLinks();

const COMMUNITY = [
  { href: "/unete", label: "Únete" },
  { href: "/equipo", label: "Equipo" },
] as const;

const RESOURCES = [
  {
    href: "https://aws.amazon.com/education/awseducate/",
    label: "AWS Educate",
    external: true,
  },
  {
    href: "https://docs.aws.amazon.com/",
    label: "Documentación AWS",
    external: true,
  },
  { href: "/contacto", label: "Contacto" },
] as const;

export function ClubLandingFooter() {
  const year = new Date().getFullYear();
  const L = useClubLinks();

  return (
    <footer className="border-t border-slate-100 bg-white px-4 pb-8 pt-10 dark:border-white/5 dark:bg-[#050608] sm:px-6">
      <div className={clubTheme.container}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <ClubNavLogo heightClass="h-9 sm:h-10" />
            <p className="text-sm text-slate-500 dark:text-zinc-500">
              © {year} {CLUB.shortName}. Todos los derechos reservados.
            </p>
            <p className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-zinc-500">
              Hecho con
              <Heart
                className="h-3 w-3 text-[var(--aws-orange)]"
                fill="currentColor"
                aria-hidden
              />
              por el Luan Dev
            </p>
          </div>

          <nav className="flex flex-col gap-1.5 text-sm" aria-label="Navegación">
            <p className="mb-1 font-bold text-slate-900 dark:text-white">
              Navegación
            </p>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-600 transition hover:text-[var(--aws-orange)] dark:text-zinc-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-1.5 text-sm" aria-label="Comunidad">
            <p className="mb-1 font-bold text-slate-900 dark:text-white">
              Comunidad
            </p>
            {COMMUNITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-600 transition hover:text-[var(--aws-orange)] dark:text-zinc-400"
              >
                {item.label}
              </Link>
            ))}
            {L.meetupUrl ? (
              <a
                href={L.meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-[var(--aws-orange)] dark:text-zinc-400"
              >
                Meetup
              </a>
            ) : null}
            <div className="mt-1 flex gap-1.5">
              {L.whatsappUrl ? (
                <a
                  href={L.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              ) : null}
              {L.linkedinUrl ? (
                <a
                  href={L.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              ) : null}
              {L.instagramUrl ? (
                <a
                  href={L.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              ) : null}
              {L.tiktokUrl ? (
                <a
                  href={L.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="TikTok"
                >
                  <TiktokGlyph className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </nav>

          <nav className="flex flex-col gap-1.5 text-sm" aria-label="Recursos">
            <p className="mb-1 font-bold text-slate-900 dark:text-white">
              Recursos
            </p>
            {RESOURCES.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 transition hover:text-[var(--aws-orange)] dark:text-zinc-400"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-600 transition hover:text-[var(--aws-orange)] dark:text-zinc-400"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 dark:border-white/5 dark:text-zinc-600">
          <Link
            href="/legal/terms"
            className="hover:text-slate-700 dark:hover:text-zinc-400"
          >
            Términos
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-slate-700 dark:hover:text-zinc-400"
          >
            Privacidad
          </Link>
          <Link
            href="/legal/cookies"
            className="hover:text-slate-700 dark:hover:text-zinc-400"
          >
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
