"use client";

import { Button } from "@/components/ui/button";
import { getClientSiteUrl } from "@/lib/club-brand";
import { ExternalLink, Eye } from "lucide-react";
import { useState } from "react";

type Props = {
  path: string | null;
  label?: string;
};

export function AdminLivePreview({ path, label = "Vista previa pública" }: Props) {
  const [open, setOpen] = useState(false);
  const base = getClientSiteUrl();
  const href = path ? `${base}${path}` : null;

  if (!href) {
    return (
      <p className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
        Guarda el registro para abrir la vista previa en el sitio público.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setOpen((v) => !v)}
        >
          <Eye className="mr-2 h-4 w-4" />
          {open ? "Ocultar preview" : label}
        </Button>
        <Button type="button" size="sm" variant="ghost" asChild>
          <a href={href} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Abrir en pestaña
          </a>
        </Button>
      </div>
      {open ? (
        <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
          <iframe
            title="Vista previa pública"
            src={href}
            className="h-[min(420px,55vh)] w-full bg-background"
            loading="lazy"
          />
        </div>
      ) : null}
    </div>
  );
}
