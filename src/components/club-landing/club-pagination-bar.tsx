"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  dark?: boolean;
  className?: string;
};

export function ClubPaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  dark = false,
  className,
}: Props) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const btnClass = dark
    ? "border-[var(--border-soft)] text-[var(--text-muted)] hover:border-[var(--aws-orange)]/40 hover:text-[var(--text-main)] disabled:opacity-40"
    : "border-slate-200 text-slate-600 hover:border-[var(--aws-orange)]/50 disabled:opacity-40 dark:border-[var(--border-soft)] dark:text-[var(--text-muted)]";

  return (
    <div
      className={cn(
        "mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6",
        className
      )}
    >
      <p
        className={cn(
          "text-sm tabular-nums",
          dark ? "text-[var(--text-muted)]" : "text-slate-500 dark:text-[var(--text-muted)]"
        )}
      >
        {start}–{end} de {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
            btnClass
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </button>
        <span
          className={cn(
            "min-w-[4rem] text-center text-sm font-semibold tabular-nums",
            dark ? "text-[var(--text-main)]" : "text-slate-700 dark:text-[var(--text-main)]"
          )}
        >
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
            btnClass
          )}
        >
          Siguiente
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
