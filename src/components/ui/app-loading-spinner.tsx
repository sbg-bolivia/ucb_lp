import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
};

export function AppLoadingSpinner({ className, label }: Props) {
  return (
    <output
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
      aria-live="polite"
      aria-label={label ?? "Cargando"}
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#7E2CFF]/25 border-t-[#00C8FF]"
        aria-hidden
      />
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : null}
    </output>
  );
}
