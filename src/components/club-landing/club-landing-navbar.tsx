"use client";

import { useAuthContext } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClubLinks } from "@/hooks/useClubLinks";
import { Menu, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { ClubNavLogo } from "./club-logo";
import { clubTheme } from "./club-theme";
import { ClubThemeToggle } from "./club-theme-toggle";

function MeetupGlyph({ className }: { className?: string }) {
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

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/eventos", label: "Eventos" },
  { href: "/beneficios", label: "Proyectos" },
  { href: "/equipo", label: "Comunidad" },
  { href: "/nosotros", label: "Sobre nosotros" },
] as const;

export function ClubLandingNavbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const links = useClubLinks();

  const handleJoin = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
      setOpen(false);
      return;
    }
    if (links.meetupUrl) {
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    } else if (links.whatsappUrl) {
      window.open(links.whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/unete");
    }
    setOpen(false);
  };

  const closeSheet = () => setOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200/40 bg-white/40 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/30 dark:border-white/5 dark:bg-[#0C0D12]/30 dark:supports-[backdrop-filter]:bg-[#0C0D12]/20">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#00C8FF]/30 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:min-w-[200px]">
          <ClubNavLogo heightClass="h-8 w-auto sm:h-9" />
        </div>

        <nav
          className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1"
          aria-label="Principal"
        >
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-2.5 py-2 text-sm font-medium transition-all duration-200 xl:px-3 ${
                  active ? clubTheme.navLinkActive : clubTheme.navLinkIdle
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-2.5 lg:min-w-[220px] lg:gap-3">
          <ClubThemeToggle />
          <Button
            type="button"
            onClick={handleJoin}
            className={`h-9 gap-2 rounded-full border-0 bg-gradient-to-r px-3 text-xs font-semibold text-white shadow-md sm:px-4 sm:text-sm ${clubTheme.gradientButton} transition hover:opacity-95 hover:shadow-lg active:scale-[0.98]`}
          >
            {links.meetupUrl ? (
              <MeetupGlyph className="h-4 w-4 shrink-0" />
            ) : (
              <Users className="h-4 w-4 shrink-0" />
            )}
            {isAuthenticated ? "Panel" : "Únete al grupo"}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex rounded-xl p-2.5 text-slate-700 transition hover:bg-violet-100 dark:text-zinc-200 dark:hover:bg-white/10 lg:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw,22rem)] border-violet-200 bg-[#f7f5ff] text-slate-900 dark:border-white/10 dark:bg-zinc-950 dark:text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left">Menú</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex justify-end px-2">
                <ClubThemeToggle />
              </div>
              <nav
                className="mt-6 flex flex-col gap-1"
                aria-label="Principal móvil"
              >
                {NAV_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeSheet}
                    className="rounded-xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-violet-100/80 dark:text-zinc-200 dark:hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
