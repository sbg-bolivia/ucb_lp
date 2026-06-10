"use client";

import { Button } from "@/components/ui/button";
import type { AdminViewMode } from "@/hooks/useAdminViewMode";
import { LayoutGrid, List } from "lucide-react";

type Props = {
  mode: AdminViewMode;
  onChange: (mode: AdminViewMode) => void;
};

export function AdminViewToggle({ mode, onChange }: Props) {
  return (
    <fieldset
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-1"
      aria-label="Tipo de vista"
    >
      <Button
        type="button"
        size="sm"
        variant={mode === "list" ? "default" : "ghost"}
        className="h-8 gap-1.5 px-3"
        onClick={() => onChange("list")}
        aria-pressed={mode === "list"}
      >
        <List className="h-3.5 w-3.5" />
        Lista
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === "cards" ? "default" : "ghost"}
        className="h-8 gap-1.5 px-3"
        onClick={() => onChange("cards")}
        aria-pressed={mode === "cards"}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Tarjetas
      </Button>
    </fieldset>
  );
}
