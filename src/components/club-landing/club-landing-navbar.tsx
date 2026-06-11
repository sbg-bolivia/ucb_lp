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
import { ClubMeetupButton } from "@/components/club-landing/club-meetup-button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { getClubNavLinks } from "@/lib/club-nav-links";

import { ClubNavLogo } from "./club-logo";
import { clubTheme } from "./club-theme";
import { ClubThemeToggle } from "./club-theme-toggle";

export function ClubLandingNavbar() {
  const NAV_LINKS = getClubNavLinks();
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const links = useClubLinks();

  const handleJoin = () => {
    if (links.meetupUrl) {
      window.open(links.meetupUrl, "_blank", "noopener,noreferrer");
    } else if (isAuthenticated) {
      router.push("/dashboard");
    } else if (links.whatsappUrl) {
      window.open(links.whatsappUrl, "_blank", "noopener,noreferrer");
    } else {
      router.push("/unete");
    }
    setOpen(false);
  };

  const closeSheet = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${clubTheme.navBar}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--aws-orange)]/20 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 lg:flex-none lg:min-w-[200px]">
          <ClubNavLogo heightClass="h-8 w-auto sm:h-9" />
        </div>

        <nav
          className="hidden lg:flex flex-1 items-center justify-center gap-1 xl:gap-1.5"
          aria-label="Principal"
        >
          {NAV_LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname.startsWith(`${l.href}/`));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 hover:-translate-y-[0.5px] ${
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
          {links.meetupUrl ? (
            <ClubMeetupButton
              href={links.meetupUrl}
              size="sm"
              className="hidden sm:inline-flex"
            />
          ) : (
            <Button
              type="button"
              onClick={handleJoin}
              className={`h-9 rounded-full px-4 text-xs font-bold ${clubTheme.gradientButton}`}
            >
              {isAuthenticated ? "Panel" : "Únete"}
            </Button>
          )}

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
