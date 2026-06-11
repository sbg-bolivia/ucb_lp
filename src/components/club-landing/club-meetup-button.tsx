"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type Props = {
  href: string;
  children?: React.ReactNode;
  showExternal?: boolean;
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children">;

const sizeClass = {
  sm: "h-9 gap-2 px-4 text-xs",
  md: "h-10 gap-2 px-5 text-sm",
  lg: "h-11 gap-2 px-6 text-sm sm:h-12 sm:px-7 sm:text-base",
};

export function ClubMeetupButton({
  href,
  children = "Meetup",
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
      {children}
      {showExternal ? (
        <ExternalLink
          className="h-4 w-4 opacity-90 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      ) : null}
    </a>
  );
}
