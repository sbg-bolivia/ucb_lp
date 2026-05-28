"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClubLinks } from "@/hooks/useClubLinks";
import { CLUB } from "@/lib/club-brand";
import { Heart, Instagram, Linkedin, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ClubNavLogo } from "./club-logo";
import { TiktokGlyph } from "./club-social-icons";

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Sobre nosotros" },
  { href: "/eventos", label: "Eventos" },
  { href: "/beneficios", label: "Proyectos" },
  { href: "/equipo", label: "Comunidad" },
  { href: "/contacto", label: "Recursos" },
] as const;

const COMMUNITY = [
  { href: "/unete", label: "Únete" },
  { href: "/equipo", label: "Equipo" },
] as const;

const RESOURCES = [
  { href: "https://aws.amazon.com/education/awseducate/", label: "AWS Educate", external: true },
  { href: "https://docs.aws.amazon.com/", label: "Documentación AWS", external: true },
  { href: "/contacto", label: "Contacto" },
] as const;

const PARTNERS = ["AWS", "GitHub", "Terraform", "Docker", "React", "Python"] as const;

export function ClubLandingFooter() {
  const year = new Date().getFullYear();
  const L = useClubLinks();
  const [email, setEmail] = useState("");

  const onNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    window.location.href = `mailto:${CLUB.email}?subject=Newsletter SBG&body=${encodeURIComponent(email)}`;
  };

  return (
    <footer className="border-t border-white/5 bg-[#050608] px-4 pb-10 pt-14 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          Construimos con las mejores tecnologías
        </p>
        <ul className="mb-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {PARTNERS.map((name) => (
            <li
              key={name}
              className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-400"
            >
              {name}
            </li>
          ))}
        </ul>

        <div className="grid gap-10 border-t border-white/5 pt-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <ClubNavLogo heightClass="h-10 sm:h-11" />
            <p className="max-w-xs text-sm text-zinc-500">
              © {year} {CLUB.shortName}. Todos los derechos reservados.
            </p>
            <p className="flex flex-wrap items-center gap-1 text-sm text-zinc-500">
              Hecho con
              <Heart className="h-3.5 w-3.5 text-[#7E2CFF]" fill="currentColor" aria-hidden />
              por el equipo · {CLUB.fullUniversity}
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm" aria-label="Navegación">
            <p className="mb-1 font-bold text-white">Navegación</p>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-400 transition hover:text-[#00C8FF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-2 text-sm" aria-label="Comunidad">
            <p className="mb-1 font-bold text-white">Comunidad</p>
            {COMMUNITY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-400 transition hover:text-[#00C8FF]"
              >
                {item.label}
              </Link>
            ))}
            {L.meetupUrl ? (
              <a
                href={L.meetupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition hover:text-[#00C8FF]"
              >
                Meetup
              </a>
            ) : null}
            <div className="mt-2 flex gap-2">
              {L.whatsappUrl ? (
                <a
                  href={L.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
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
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
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
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
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
                  className="rounded-full p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                  aria-label="TikTok"
                >
                  <TiktokGlyph className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </nav>

          <nav className="flex flex-col gap-2 text-sm" aria-label="Recursos">
            <p className="mb-1 font-bold text-white">Recursos</p>
            {RESOURCES.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 transition hover:text-[#00C8FF]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-zinc-400 transition hover:text-[#00C8FF]"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div>
            <p className="mb-3 font-bold text-white">Mantente al día</p>
            <p className="mb-4 text-sm text-zinc-500">
              Recibe novedades de eventos y proyectos del club.
            </p>
            <form onSubmit={onNewsletter} className="flex gap-2">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-zinc-600"
                required
              />
              <Button
                type="submit"
                className="shrink-0 rounded-full bg-gradient-to-r from-[#00C8FF] via-[#7E2CFF] to-[#A855F7] font-semibold text-white"
              >
                →
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-4 border-t border-white/5 pt-8 text-xs text-zinc-600">
          <Link href="/legal/terms" className="hover:text-zinc-400">
            Términos
          </Link>
          <Link href="/legal/privacy" className="hover:text-zinc-400">
            Privacidad
          </Link>
          <Link href="/legal/cookies" className="hover:text-zinc-400">
            Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
}
