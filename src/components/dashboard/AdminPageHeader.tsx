"use client";

import { AdminViewToggle } from "@/components/dashboard/AdminViewToggle";
import { cn } from "@/lib/utils";
import type { AdminViewMode } from "@/hooks/useAdminViewMode";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  viewMode?: AdminViewMode;
  onViewModeChange?: (mode: AdminViewMode) => void;
  showViewToggle?: boolean;
  className?: string;
};

export function AdminPageHeader({
  icon: Icon,
  title,
  description,
  actions,
  viewMode,
  onViewModeChange,
  showViewToggle = false,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gradient-to-br from-[#7E2CFF]/15 to-[#00C8FF]/15 p-2.5">
          <Icon className="h-5 w-5 text-[#7E2CFF] dark:text-[#00C8FF]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showViewToggle && viewMode && onViewModeChange ? (
          <AdminViewToggle mode={viewMode} onChange={onViewModeChange} />
        ) : null}
        {actions}
      </div>
    </div>
  );
}
