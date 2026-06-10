"use client";

import { MeetupLogo } from "@/components/club-landing/club-social-icons";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  showExternal?: boolean;
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const sizeClass = {
  sm: "h-9 gap-2.5 px-4 text-xs",
  md: "h-11 gap-2.5 px-5 text-sm",
  lg: "h-12 gap-3 px-7 text-sm sm:h-14 sm:px-8 sm:text-base",
};

export function ClubMeetupButton({
  href,
  children,
  showExternal = false,
  size = "md",
  className,
  ...rest
}: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center justify-center rounded-full font-bold text-white",
        "bg-[#F05663] hover:bg-[#e04552] active:scale-[0.98]",
        "shadow-[0_4px_20px_rgba(240,86,99,0.35)] hover:shadow-[0_8px_28px_rgba(240,86,99,0.42)]",
        "transition-all duration-500 ease-out hover:-translate-y-0.5",
        sizeClass[size],
        className
      )}
      {...rest}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#F05663] shadow-sm sm:h-8 sm:w-8"
        aria-hidden
      >
        <MeetupLogo className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
      </span>
      {children}
      {showExternal ? (
        <ExternalLink className="h-4 w-4 opacity-90 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      ) : null}
    </a>
  );
}
