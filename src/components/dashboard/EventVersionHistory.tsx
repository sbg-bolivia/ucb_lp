"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { ClubEventSnapshot } from "@/lib/club-event-snapshot";
import { trpc } from "@/utils/trpc";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type Props = {
  eventId: string | null;
  eventTitle?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestored?: () => void;
};

function formatWhen(value: Date | string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EventVersionHistory({
  eventId,
  eventTitle,
  open,
  onOpenChange,
  onRestored,
}: Props) {
  const { data: versions, isLoading, refetch } =
    trpc.clubEvents.listVersions.useQuery(
      { eventId: eventId ?? "" },
      { enabled: Boolean(eventId) && open }
    );

  const restoreMut = trpc.clubEvents.restoreVersion.useMutation({
    onSuccess: () => {
      toast.success("Versión restaurada");
      void refetch();
      onRestored?.();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de versiones
          </SheetTitle>
          <SheetDescription>
            {eventTitle
              ? `Cambios guardados de «${eventTitle}». Cada vez que editas se crea una versión automática.`
              : "Guarda el evento primero para ver el historial."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {!eventId ? (
            <p className="text-sm text-muted-foreground">
              Crea o guarda el evento para empezar a acumular versiones.
            </p>
          ) : isLoading ? (
            <p className="text-sm text-muted-foreground">Cargando historial…</p>
          ) : !versions?.length ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay versiones. Se creará la primera al guardar cambios.
            </p>
          ) : (
            (versions as Array<{
              id: string;
              versionNumber: number;
              snapshot: unknown;
              createdAt: Date | string;
            }>).map((v) => {
              const snap = v.snapshot as ClubEventSnapshot;
              return (
                <div
                  key={v.id}
                  className="rounded-xl border border-border/70 bg-muted/20 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">v{v.versionNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatWhen(v.createdAt)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      disabled={restoreMut.isPending}
                      onClick={() => restoreMut.mutate({ versionId: v.id })}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Restaurar
                    </Button>
                  </div>
                  <p className="mt-2 text-sm font-medium">{snap.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {snap.description || "Sin descripción"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {snap.isPublished ? "Publicado" : "Borrador"} · orden{" "}
                    {snap.sortOrder}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
