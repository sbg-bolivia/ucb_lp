"use client";

import { S3ImageUploadField } from "@/components/dashboard/S3ImageUploadField";
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
import { AWS_COMMUNITY_TYPE_LABELS } from "@/lib/aws-labels";
import { useTrpcMutation } from "@/utils/trpc-shallow";
import { trpc } from "@/utils/trpc";
import type { AwsCommunityType } from "@prisma/client";
import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { Badge } from "@/components/ui/badge";
import { useAdminViewMode } from "@/hooks/useAdminViewMode";
import { Globe2, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  name: string;
  communityType: AwsCommunityType;
  university: string;
  department: string;
  city: string;
  latitude: string;
  longitude: string;
  description: string;
  meetupUrl: string;
  websiteUrl: string;
  logoUrl: string;
  isOwnGroup: boolean;
  isPublished: boolean;
  sortOrder: string;
};

type CommunityRow = {
  id: string;
  name: string;
  communityType: AwsCommunityType;
  university: string | null;
  department: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  meetupUrl: string | null;
  websiteUrl: string | null;
  logoUrl: string | null;
  isOwnGroup: boolean;
  isPublished: boolean;
  sortOrder: number;
};

const COMMUNITY_TYPES = Object.keys(
  AWS_COMMUNITY_TYPE_LABELS
) as AwsCommunityType[];

const emptyForm: FormState = {
  name: "",
  communityType: "USER_GROUP",
  university: "",
  department: "",
  city: "",
  latitude: "",
  longitude: "",
  description: "",
  meetupUrl: "",
  websiteUrl: "",
  logoUrl: "",
  isOwnGroup: false,
  isPublished: true,
  sortOrder: "0",
};

function communityToForm(c: CommunityRow): FormState {
  return {
    name: c.name,
    communityType: c.communityType,
    university: c.university ?? "",
    department: c.department ?? "",
    city: c.city,
    latitude: c.latitude != null ? String(c.latitude) : "",
    longitude: c.longitude != null ? String(c.longitude) : "",
    description: c.description ?? "",
    meetupUrl: c.meetupUrl ?? "",
    websiteUrl: c.websiteUrl ?? "",
    logoUrl: c.logoUrl ?? "",
    isOwnGroup: c.isOwnGroup,
    isPublished: c.isPublished,
    sortOrder: String(c.sortOrder),
  };
}

function parseCoord(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) ? n : null;
}

export default function ClubComunidadesAdminPage() {
  const { t } = useTranslation("dashboard");
  const confirm = useConfirm();
  const { mode: viewMode, setMode: setViewMode } =
    useAdminViewMode("club-comunidades");
  const { data: communities, refetch, isLoading } =
    trpc.awsCommunities.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const createMut = useTrpcMutation(trpc.awsCommunities.create, {
    onSuccess: () => {
      toast.success("Comunidad creada");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = useTrpcMutation(trpc.awsCommunities.update, {
    onSuccess: () => {
      toast.success("Comunidad actualizada");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = useTrpcMutation(trpc.awsCommunities.delete, {
    onSuccess: () => {
      toast.success("Comunidad eliminada");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const sorted = useMemo(() => communities ?? [], [communities]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (c: CommunityRow) => {
    setEditingId(c.id);
    setForm(communityToForm(c));
    setOpen(true);
  };

  const submit = () => {
    const name = form.name.trim();
    const city = form.city.trim();
    if (!name || !city) {
      toast.error("Nombre y ciudad son obligatorios");
      return;
    }
    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const payload = {
      name,
      communityType: form.communityType,
      university: form.university.trim() || null,
      department: form.department.trim() || null,
      city,
      latitude: parseCoord(form.latitude),
      longitude: parseCoord(form.longitude),
      description: form.description.trim() || null,
      meetupUrl: form.meetupUrl.trim() || null,
      websiteUrl: form.websiteUrl.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      isOwnGroup: form.isOwnGroup,
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

  const handleDelete = async (c: CommunityRow) => {
    const ok = await confirm({
      title: "Eliminar comunidad",
      description: `¿Eliminar «${c.name}»? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteMut.mutate({ id: c.id });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Globe2}
        title={t("clubCommunitiesAdmin")}
        description={
          <>
            {t("clubCommunitiesAdminDesc")}{" "}
            <Link
              href="/nosotros"
              className="text-primary underline-offset-2 hover:underline"
            >
              Ver en /nosotros
            </Link>
          </>
        }
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actions={
          <Button type="button" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva comunidad
          </Button>
        }
      />

      {viewMode === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl border border-border bg-muted/30"
              />
            ))
          ) : sorted.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed py-16 text-center text-muted-foreground">
              No hay comunidades registradas.
            </div>
          ) : (
            sorted.map((c) => (
              <div
                key={c.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card"
              >
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-[#7E2CFF]/10 to-[#00C8FF]/10">
                  {c.logoUrl ? (
                    <Image
                      src={c.logoUrl}
                      alt={c.name}
                      width={64}
                      height={64}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <Globe2 className="h-10 w-10 text-[#7E2CFF]/40" />
                  )}
                  <Badge className="absolute right-2 top-2" variant={c.isPublished ? "default" : "secondary"}>
                    {c.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {c.city}
                  </p>
                  <div className="flex justify-end gap-1 pt-2">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => void handleDelete(c)}>
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
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Tipo</TableHead>
              <TableHead className="hidden lg:table-cell">Ciudad</TableHead>
              <TableHead>Mapa</TableHead>
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
                  No hay comunidades. Crea la primera con &quot;Nueva
                  comunidad&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.name}
                    {c.isOwnGroup ? (
                      <span className="ml-2 text-xs text-primary">(propia)</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {AWS_COMMUNITY_TYPE_LABELS[c.communityType]}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                    {c.city}
                    {c.department ? `, ${c.department}` : ""}
                  </TableCell>
                  <TableCell className="text-sm">
                    {c.latitude != null && c.longitude != null ? "Sí" : "—"}
                  </TableCell>
                  <TableCell>{c.isPublished ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(c)}
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(c)}
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
        <DialogContent className="max-h-[min(90vh,800px)] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe2 className="h-5 w-5" />
              {editingId ? "Editar comunidad" : "Nueva comunidad"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="comm-name">Nombre</Label>
              <Input
                id="comm-name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="AWS User Group La Paz"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={form.communityType}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      communityType: v as AwsCommunityType,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMUNITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {AWS_COMMUNITY_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-city">Ciudad</Label>
                <Input
                  id="comm-city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comm-dept">Departamento</Label>
                <Input
                  id="comm-dept"
                  value={form.department}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, department: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-uni">Universidad (opcional)</Label>
                <Input
                  id="comm-uni"
                  value={form.university}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, university: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comm-lat">Latitud (mapa)</Label>
                <Input
                  id="comm-lat"
                  value={form.latitude}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, latitude: e.target.value }))
                  }
                  placeholder="-16.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-lng">Longitud (mapa)</Label>
                <Input
                  id="comm-lng"
                  value={form.longitude}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, longitude: e.target.value }))
                  }
                  placeholder="-68.15"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comm-desc">Descripción</Label>
              <Textarea
                id="comm-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
            <S3ImageUploadField
              id="comm-logo"
              label="Logo (opcional)"
              folder="communities"
              value={form.logoUrl}
              onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
            />
            <div className="space-y-2">
              <Label htmlFor="comm-meetup">Meetup (opcional)</Label>
              <Input
                id="comm-meetup"
                value={form.meetupUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meetupUrl: e.target.value }))
                }
                placeholder="https://www.meetup.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comm-web">Sitio web (opcional)</Label>
              <Input
                id="comm-web"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, websiteUrl: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="comm-own"
                  checked={form.isOwnGroup}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isOwnGroup: c === true }))
                  }
                />
                <Label htmlFor="comm-own" className="font-normal cursor-pointer">
                  Es nuestra comunidad
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="comm-pub"
                  checked={form.isPublished}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isPublished: c === true }))
                  }
                />
                <Label htmlFor="comm-pub" className="font-normal cursor-pointer">
                  Publicado en la web
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comm-sort">Orden (menor = primero)</Label>
              <Input
                id="comm-sort"
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={busy}>
              {editingId ? "Guardar cambios" : "Crear comunidad"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
