import { cn } from "@/lib/utils";

import { clubTheme } from "./club-theme";

type Props = {
  label?: string;
  className?: string;
};

/** Evita que el footer suba durante cargas de datos */
export function ClubPageLoading({
  label = "Cargando…",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-col items-center justify-center gap-4 py-16",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-soft)] border-t-[var(--aws-orange)]" />
      <p className={`text-sm ${clubTheme.textMuted}`}>{label}</p>
    </div>
  );
}
