"use client";

import { AdminDragHandle, reorderItems } from "@/components/dashboard/AdminDragReorder";
import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { S3ImageUploadField } from "@/components/dashboard/S3ImageUploadField";
import { Badge } from "@/components/ui/badge";
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
import { BANNER_PLACEMENT_LABELS } from "@/lib/banner-labels";
import { parseDatetimeLocal, toDatetimeLocalValue } from "@/lib/datetime-local";
import type { BannerPlacement } from "@prisma/client";
import { trpc } from "@/utils/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, ImageIcon, Info, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type BannerRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  placement: BannerPlacement;
  isActive: boolean;
  sortOrder: number;
  startsAt: Date | string | null;
  endsAt: Date | string | null;
};

type FormState = {
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  placement: BannerPlacement;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const PLACEMENTS = Object.keys(
  BANNER_PLACEMENT_LABELS
) as BannerPlacement[];

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  imageUrl: "",
  linkUrl: "",
  placement: "HOME_HERO",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

function bannerToForm(b: BannerRow): FormState {
  return {
    title: b.title ?? "",
    subtitle: b.subtitle ?? "",
    imageUrl: b.imageUrl,
    linkUrl: b.linkUrl ?? "",
    placement: b.placement,
    isActive: b.isActive,
    startsAt: toDatetimeLocalValue(b.startsAt),
    endsAt: toDatetimeLocalValue(b.endsAt),
  };
}

export default function ClubBannersAdminPage() {
  const confirm = useConfirm();
  const { data: banners, refetch, isLoading } =
    trpc.siteBanners.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  useEffect(() => {
    if (banners) setOrderedIds(banners.map((b) => b.id));
  }, [banners]);

  const sorted = useMemo(() => {
    if (!banners) return [];
    const map = new Map(banners.map((b) => [b.id, b]));
    const result: typeof banners = [];
    for (const id of orderedIds) {
      const item = map.get(id);
      if (item) result.push(item);
    }
    return result;
  }, [banners, orderedIds]);

  const createMut = trpc.siteBanners.create.useMutation({
    onSuccess: () => {
      toast.success("Banner creado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.siteBanners.update.useMutation({
    onSuccess: () => {
      toast.success("Banner actualizado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.siteBanners.delete.useMutation({
    onSuccess: () => {
      toast.success("Banner eliminado");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const reorderMut = trpc.siteBanners.reorder.useMutation({
    onSuccess: () => toast.success("Orden actualizado"),
    onError: (e) => toast.error(e.message),
  });

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (b: BannerRow) => {
    setEditingId(b.id);
    setForm(bannerToForm(b));
    setOpen(true);
  };

  const submit = () => {
    if (!form.imageUrl.trim()) {
      toast.error("La imagen es obligatoria");
      return;
    }
    const payload = {
      title: form.title.trim() || null,
      subtitle: form.subtitle.trim() || null,
      imageUrl: form.imageUrl.trim(),
      linkUrl: form.linkUrl.trim() || null,
      placement: form.placement,
      isActive: form.isActive,
      startsAt: parseDatetimeLocal(form.startsAt),
      endsAt: parseDatetimeLocal(form.endsAt),
    };

    if (editingId) {
      updateMut.mutate({ id: editingId, ...payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleDelete = async (b: BannerRow) => {
    const ok = await confirm({
      title: "Eliminar banner",
      description: `¿Eliminar «${b.title ?? "sin título"}»?`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteMut.mutate({ id: b.id });
  };

  const handleReorder = (from: number, to: number) => {
    const next = reorderItems(orderedIds, from, to);
    setOrderedIds(next);
    reorderMut.mutate({ orderedIds: next });
  };

  const busy = createMut.isPending || updateMut.isPending;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={ImageIcon}
        title="Banners del home"
        description={
          <>
            Imágenes promocionales del sitio público.{" "}
            <Link
              href="/"
              className="text-primary underline-offset-2 hover:underline"
              target="_blank"
            >
              Ver home
            </Link>
          </>
        }
        actions={
          <Button type="button" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo banner
          </Button>
        }
      />

      <Card className="rounded-2xl border-dashed border-[#7E2CFF]/25 bg-gradient-to-br from-[#7E2CFF]/5 to-[#00C8FF]/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="h-4 w-4 text-[#7E2CFF]" />
            ¿Qué son los banners?
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Son imágenes promocionales que el sitio público puede mostrar en
            zonas concretas (hero del home, sección secundaria, página de
            eventos o servicios). Aquí defines título, imagen, enlace, fechas de
            vigencia y orden. Cuando conectemos el home a esta API, aparecerán
            solos según la ubicación y si están activos en la fecha actual — no
            hace falta tocar código cada vez que cambies una promo.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 text-xs text-muted-foreground">
          Flujo: subes imagen a S3 → eliges ubicación → guardas. El público verá
          solo banners activos y dentro del rango de fechas.
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Vista previa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead>Activo</TableHead>
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
                  No hay banners. Crea el primero con &quot;Nuevo banner&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((b, index) => (
                <TableRow
                  key={b.id}
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
                  <TableCell>
                    <div className="relative h-12 w-20 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={b.imageUrl}
                        alt={b.title ?? "Banner"}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {b.title ?? "—"}
                    {b.subtitle ? (
                      <p className="text-xs text-muted-foreground">{b.subtitle}</p>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {BANNER_PLACEMENT_LABELS[b.placement]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={b.isActive ? "default" : "secondary"}>
                      {b.isActive ? "Sí" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {b.linkUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={b.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir enlace"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(b)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => void handleDelete(b)}
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
            <DialogTitle>
              {editingId ? "Editar banner" : "Nuevo banner"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <S3ImageUploadField
              id="banner-image"
              label="Imagen"
              folder="banners"
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
            <div className="space-y-2">
              <Label htmlFor="banner-title">Título (opcional)</Label>
              <Input
                id="banner-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-sub">Subtítulo (opcional)</Label>
              <Input
                id="banner-sub"
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner-link">Enlace (opcional)</Label>
              <Input
                id="banner-link"
                value={form.linkUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, linkUrl: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Select
                value={form.placement}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    placement: v as BannerPlacement,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLACEMENTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {BANNER_PLACEMENT_LABELS[p]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="banner-start">Visible desde (opcional)</Label>
                <Input
                  id="banner-start"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startsAt: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banner-end">Visible hasta (opcional)</Label>
                <Input
                  id="banner-end"
                  type="datetime-local"
                  value={form.endsAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endsAt: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="banner-active"
                checked={form.isActive}
                onCheckedChange={(c) =>
                  setForm((f) => ({ ...f, isActive: c === true }))
                }
              />
              <Label htmlFor="banner-active" className="cursor-pointer font-normal">
                Banner activo
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={busy}>
              {busy ? "Guardando…" : editingId ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
