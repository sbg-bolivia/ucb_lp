"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import {
  parseDatetimeLocal,
  toDatetimeLocalValue,
} from "@/lib/datetime-local";
import { trpc } from "@/utils/trpc";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  imageUrl: string;
  externalUrl: string;
  isPublished: boolean;
  sortOrder: string;
};

/** Fila devuelta por tRPC (fechas pueden venir como string serializado). */
type ClubEventRow = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  startsAt: Date | string | null;
  endsAt: Date | string | null;
  location: string | null;
  imageUrl: string | null;
  externalUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  location: "",
  imageUrl: "",
  externalUrl: "",
  isPublished: true,
  sortOrder: "0",
};

function eventToForm(e: ClubEventRow): FormState {
  return {
    title: e.title,
    description: e.description ?? "",
    startsAt: toDatetimeLocalValue(e.startsAt),
    endsAt: toDatetimeLocalValue(e.endsAt),
    location: e.location ?? "",
    imageUrl: e.imageUrl ?? "",
    externalUrl: e.externalUrl ?? "",
    isPublished: e.isPublished,
    sortOrder: String(e.sortOrder),
  };
}

export default function ClubEventosAdminPage() {
  const { t } = useTranslation("dashboard");
  const { data: events, refetch } = trpc.clubEvents.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const createMut = trpc.clubEvents.create.useMutation({
    onSuccess: () => {
      toast.success("Evento creado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.clubEvents.update.useMutation({
    onSuccess: () => {
      toast.success("Evento actualizado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.clubEvents.delete.useMutation({
    onSuccess: () => {
      toast.success("Evento eliminado");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const sorted = useMemo(() => events ?? [], [events]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (e: ClubEventRow) => {
    setEditingId(e.id);
    setForm(eventToForm(e));
    setOpen(true);
  };

  const submit = () => {
    const title = form.title.trim();
    if (!title) {
      toast.error("El título es obligatorio");
      return;
    }
    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const payload = {
      title,
      description: form.description.trim() || null,
      startsAt: parseDatetimeLocal(form.startsAt),
      endsAt: parseDatetimeLocal(form.endsAt),
      location: form.location.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      externalUrl: form.externalUrl.trim() || null,
      isPublished: form.isPublished,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    };

    if (editingId) {
      updateMut.mutate({ id: editingId, ...payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("clubEventsAdmin")}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("clubEventsAdminDesc")}
          </p>
        </div>
        <Button type="button" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo evento
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="hidden lg:table-cell">Lugar</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead className="w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay eventos. Crea el primero con &quot;Nuevo evento&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="font-medium">{ev.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {ev.startsAt
                      ? new Intl.DateTimeFormat("es-BO", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(ev.startsAt))
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {ev.location || "—"}
                  </TableCell>
                  <TableCell>{ev.isPublished ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(ev)}
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        if (
                          confirm(
                            `¿Eliminar el evento «${ev.title}»? Esta acción no se puede deshacer.`
                          )
                        ) {
                          deleteMut.mutate({ id: ev.id });
                        }
                      }}
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {editingId ? "Editar evento" : "Nuevo evento"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ev-title">Título</Label>
              <Input
                id="ev-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Ej. Taller: introducción a S3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-desc">Descripción</Label>
              <Textarea
                id="ev-desc"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detalle del evento, requisitos, qué traer..."
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ev-start">Inicio</Label>
                <Input
                  id="ev-start"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startsAt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ev-end">Fin (opcional)</Label>
                <Input
                  id="ev-end"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endsAt: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-loc">Lugar</Label>
              <Input
                id="ev-loc"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                placeholder="Campus, aula, enlace Zoom..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-img">URL de imagen (opcional)</Label>
              <Input
                id="ev-img"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                placeholder="/eventos/cartel.jpg o https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-ext">Enlace externo (Meetup, etc.)</Label>
              <Input
                id="ev-ext"
                value={form.externalUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, externalUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="ev-pub"
                checked={form.isPublished}
                onCheckedChange={(c) =>
                  setForm((f) => ({ ...f, isPublished: c === true }))
                }
              />
              <Label htmlFor="ev-pub" className="font-normal cursor-pointer">
                Publicado en la web
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-sort">Orden (menor = primero)</Label>
              <Input
                id="ev-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={busy}>
              {editingId ? "Guardar cambios" : "Crear evento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
