"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { CLUB } from "@/lib/club-brand";
import { CLUB_LOGO } from "@/lib/club-brand-assets";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const AUTH_INPUT_CLASS =
  "bg-background dark:bg-background/90 border-border/80";

type AuthPageShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: ReactNode;
  backHref?: string;
  backLabel?: string;
  icon?: ReactNode;
};

export function AuthPageShell({
  children,
  title,
  subtitle,
  backHref = "/",
  backLabel,
  icon,
}: AuthPageShellProps) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/90 to-violet-100/80 text-foreground dark:from-[#050608] dark:via-[#0b1220] dark:to-[#0d0a18]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#7E2CFF]/10 blur-3xl dark:bg-[#7E2CFF]/20" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[#00C8FF]/10 blur-3xl dark:bg-[#00C8FF]/15" />
      </div>

      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link
              href={backHref}
              className="mb-8 inline-flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel ?? "Volver al inicio"}
            </Link>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#7E2CFF] to-[#00C8FF] p-2 shadow-lg shadow-violet-500/20">
              {icon ?? (
                <Image
                  src={CLUB_LOGO.white}
                  alt={CLUB.shortName}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              )}
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <div className="mt-2 text-sm text-muted-foreground">{subtitle}</div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/95 px-6 py-8 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-card/80 dark:shadow-[0_32px_80px_-28px_rgba(0,200,255,0.15)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuthDivider({ text }: { text: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-card px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}

type AuthPrimaryButtonProps = {
  children: ReactNode;
  loading?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
};

export function AuthPrimaryButton({
  children,
  loading,
  type = "submit",
  onClick,
  className,
}: AuthPrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={cn("w-full", className)}
    >
      {children}
    </Button>
  );
}

type AuthGoogleButtonProps = {
  children: ReactNode;
  onClick: () => void;
  loading?: boolean;
  icon: ReactNode;
};

export function AuthGoogleButton({
  children,
  onClick,
  loading,
  icon,
}: AuthGoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading}
      className="w-full bg-background/80 hover:bg-accent dark:bg-background/40"
    >
      {icon}
      {children}
    </Button>
  );
}
