"use client";

import { cn } from "@/lib/utils";

type Props<T extends string> = {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  dark?: boolean;
};

export function ClubFilterPills<T extends string>({
  options,
  value,
  onChange,
  className,
  dark = false,
}: Props<T>) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
      role="tablist"
      aria-label="Filtros"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
              dark
                ? active
                  ? "bg-[var(--aws-orange)] text-[#0F172A] shadow-md"
                  : "border border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--text-muted)] hover:border-[var(--aws-orange)]/40 hover:text-[var(--text-main)]"
                : active
                  ? "bg-gradient-to-br from-[var(--aws-orange)] to-[var(--aws-orange-soft)] text-[var(--ucb-blue-dark)] shadow-[0_8px_20px_rgba(255,153,0,0.22)]"
                  : "border border-[var(--border-soft)] bg-[rgba(255,248,240,0.78)] text-[var(--text-secondary)] hover:border-[var(--aws-orange)]/45 hover:text-[var(--ucb-blue)] dark:border-[var(--border-soft)] dark:bg-[var(--surface-soft)] dark:text-[var(--text-muted)]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
