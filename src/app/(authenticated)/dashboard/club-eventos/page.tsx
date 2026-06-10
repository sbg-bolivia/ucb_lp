"use client";

import { AdminDragHandle, reorderItems } from "@/components/dashboard/AdminDragReorder";
import { S3ImageUploadField } from "@/components/dashboard/S3ImageUploadField";
import { S3VideoUploadField } from "@/components/dashboard/S3VideoUploadField";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { parseDatetimeLocal, toDatetimeLocalValue } from "@/lib/datetime-local";
import {
  EVENT_STATUS_LABELS,
  REGISTRATION_TYPE_LABELS,
} from "@/lib/event-labels";
import type { EventStatus, RegistrationType } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { Badge } from "@/components/ui/badge";
import { useAdminViewMode } from "@/hooks/useAdminViewMode";
import { Calendar, Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  imageUrl: string;
  externalUrl: string;
  registrationUrl: string;
  registrationType: RegistrationType;
  status: EventStatus;
  isOnline: boolean;
  isFeatured: boolean;
  promoVideoUrl: string;
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
  registrationUrl: string | null;
  registrationType: RegistrationType;
  status: EventStatus;
  isOnline: boolean;
  isFeatured: boolean;
  promoVideoUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

const REGISTRATION_TYPES = Object.keys(
  REGISTRATION_TYPE_LABELS
) as RegistrationType[];
const EVENT_STATUSES = Object.keys(EVENT_STATUS_LABELS) as EventStatus[];

const emptyForm: FormState = {
  title: "",
  description: "",
  startsAt: "",
  endsAt: "",
  location: "",
  imageUrl: "",
  externalUrl: "",
  registrationUrl: "",
  registrationType: "EXTERNAL",
  status: "UPCOMING",
  isOnline: false,
  isFeatured: false,
  promoVideoUrl: "",
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
    registrationUrl: e.registrationUrl ?? e.externalUrl ?? "",
    registrationType: e.registrationType ?? "EXTERNAL",
    status: e.status ?? "UPCOMING",
    isOnline: e.isOnline ?? false,
    isFeatured: e.isFeatured ?? false,
    promoVideoUrl: e.promoVideoUrl ?? "",
    isPublished: e.isPublished,
    sortOrder: String(e.sortOrder),
  };
}

export default function ClubEventosAdminPage() {
  const { t } = useTranslation("dashboard");
  const confirm = useConfirm();
  const { mode: viewMode, setMode: setViewMode } =
    useAdminViewMode("club-eventos");
  const { data: events, refetch, isLoading } =
    trpc.clubEvents.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    if (events) setOrderedIds(events.map((e) => e.id));
  }, [events]);

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

  const reorderMut = trpc.clubEvents.reorder.useMutation({
    onSuccess: () => toast.success("Orden actualizado"),
    onError: (e) => toast.error(e.message),
  });

  const sorted = useMemo(() => {
    if (!events) return [];
    const map = new Map(events.map((e) => [e.id, e]));
    const result: typeof events = [];
    for (const id of orderedIds) {
      const item = map.get(id);
      if (item) result.push(item);
    }
    return result;
  }, [events, orderedIds]);

  const handleReorder = (from: number, to: number) => {
    const next = reorderItems(orderedIds, from, to);
    setOrderedIds(next);
    reorderMut.mutate({ orderedIds: next });
  };

  const openNew = () => {
    setEditingId(null);
    setViewOnly(false);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (e: ClubEventRow, readOnly = false) => {
    setEditingId(e.id);
    setViewOnly(readOnly);
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
      registrationUrl: form.registrationUrl.trim() || null,
      registrationType: form.registrationType,
      status: form.status,
      isOnline: form.isOnline,
      isFeatured: form.isFeatured,
      promoVideoUrl: form.promoVideoUrl.trim() || null,
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

  const handleDelete = async (ev: ClubEventRow) => {
    const ok = await confirm({
      title: "Eliminar evento",
      description: `¿Eliminar «${ev.title}»? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteMut.mutate({ id: ev.id });
  };

  const formatDate = (value: Date | string | null) =>
    value
      ? new Intl.DateTimeFormat("es-BO", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(value))
      : "—";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Calendar}
        title={t("clubEventsAdmin")}
        description={t("clubEventsAdminDesc")}
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actions={
          <Button type="button" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo evento
          </Button>
        }
      />

      {viewMode === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-2xl border border-border bg-muted/30"
              />
            ))
          ) : sorted.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
              No hay eventos. Crea el primero con &quot;Nuevo evento&quot;.
            </div>
          ) : (
            sorted.map((ev) => (
              <div
                key={ev.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video bg-muted/40">
                  {ev.imageUrl ? (
                    <Image
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#7E2CFF]/10 to-[#00C8FF]/10">
                      <Calendar className="h-10 w-10 text-[#7E2CFF]/50" />
                    </div>
                  )}
                  <Badge
                    className="absolute right-2 top-2"
                    variant={ev.isPublished ? "default" : "secondary"}
                  >
                    {ev.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold leading-snug">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(ev.startsAt)}
                  </p>
                  {ev.location ? (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {ev.location}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-1 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(ev, true)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(ev)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => void handleDelete(ev)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="hidden lg:table-cell">Lugar</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead className="w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminListLoading colSpan={6} />
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay eventos. Crea el primero con &quot;Nuevo evento&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((ev, index) => (
                <TableRow
                  key={ev.id}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", String(index))
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = Number.parseInt(
                      e.dataTransfer.getData("text/plain"),
                      10
                    );
                    if (Number.isFinite(from) && from !== index) {
                      handleReorder(from, index);
                    }
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TableCell>
                    <AdminDragHandle />
                  </TableCell>
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
                      onClick={() => openEdit(ev, true)}
                      aria-label="Ver"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
                      onClick={() => void handleDelete(ev)}
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
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[min(90vh,720px)] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {viewOnly
                ? "Ver evento"
                : editingId
                  ? "Editar evento"
                  : "Nuevo evento"}
            </DialogTitle>
          </DialogHeader>
          <fieldset
            disabled={viewOnly}
            className="grid gap-4 border-0 p-0 py-2 disabled:opacity-100"
          >
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
            <S3ImageUploadField
              id="ev-img"
              label="Imagen del evento (opcional)"
              folder="events"
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              placeholder="Sube a S3 o pega una URL"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de registro</Label>
                <Select
                  value={form.registrationType}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      registrationType: v as RegistrationType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGISTRATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {REGISTRATION_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as EventStatus }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUSES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {EVENT_STATUS_LABELS[st]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-reg">Enlace de registro</Label>
              <Input
                id="ev-reg"
                value={form.registrationUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, registrationUrl: e.target.value }))
                }
                placeholder="Meetup, YouTube, Google Meet, Zoom..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-ext">Enlace externo legacy (opcional)</Label>
              <Input
                id="ev-ext"
                value={form.externalUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, externalUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <S3VideoUploadField
              id="ev-video"
              label="Video promocional (opcional)"
              folder="events"
              value={form.promoVideoUrl}
              onChange={(url) =>
                setForm((f) => ({ ...f, promoVideoUrl: url }))
              }
              placeholder="Sube MP4/WebM a S3 o pega URL (YouTube, etc.)"
            />
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ev-online"
                  checked={form.isOnline}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isOnline: c === true }))
                  }
                />
                <Label htmlFor="ev-online" className="font-normal cursor-pointer">
                  Evento en línea
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ev-featured"
                  checked={form.isFeatured}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isFeatured: c === true }))
                  }
                />
                <Label htmlFor="ev-featured" className="font-normal cursor-pointer">
                  Destacado
                </Label>
              </div>
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
          </fieldset>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {viewOnly ? "Cerrar" : "Cancelar"}
            </Button>
            {viewOnly ? (
              <Button type="button" onClick={() => setViewOnly(false)}>
                Editar
              </Button>
            ) : (
              <Button type="button" onClick={submit} disabled={busy}>
                {editingId ? "Guardar cambios" : "Crear evento"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
