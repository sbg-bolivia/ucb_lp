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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslation";
import { trpc } from "@/utils/trpc";
import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { Badge } from "@/components/ui/badge";
import { useAdminViewMode } from "@/hooks/useAdminViewMode";
import { ExternalLink, FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type FormState = {
  title: string;
  description: string;
  tags: string;
  imageUrl: string;
  projectUrl: string;
  isPublished: boolean;
  sortOrder: string;
};

type ClubProjectRow = {
  id: string;
  tenantId: string;
  title: string;
  description: string | null;
  tags: string | null;
  imageUrl: string | null;
  projectUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  tags: "",
  imageUrl: "",
  projectUrl: "",
  isPublished: true,
  sortOrder: "0",
};

function projectToForm(p: ClubProjectRow): FormState {
  return {
    title: p.title,
    description: p.description ?? "",
    tags: p.tags ?? "",
    imageUrl: p.imageUrl ?? "",
    projectUrl: p.projectUrl ?? "",
    isPublished: p.isPublished,
    sortOrder: String(p.sortOrder),
  };
}

export default function ClubProyectosAdminPage() {
  const { t } = useTranslation("dashboard");
  const confirm = useConfirm();
  const { mode: viewMode, setMode: setViewMode } =
    useAdminViewMode("club-proyectos");
  const { data: projects, refetch, isLoading } =
    trpc.clubProjects.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const createMut = trpc.clubProjects.create.useMutation({
    onSuccess: () => {
      toast.success("Proyecto creado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.clubProjects.update.useMutation({
    onSuccess: () => {
      toast.success("Proyecto actualizado");
      void refetch();
      setOpen(false);
      setForm(emptyForm);
      setEditingId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.clubProjects.delete.useMutation({
    onSuccess: () => {
      toast.success("Proyecto eliminado");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const sorted = useMemo(() => projects ?? [], [projects]);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (p: ClubProjectRow) => {
    setEditingId(p.id);
    setForm(projectToForm(p));
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
      tags: form.tags.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      projectUrl: form.projectUrl.trim() || null,
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

  const handleDelete = async (p: { id: string; title: string }) => {
    const ok = await confirm({
      title: "Eliminar proyecto",
      description: `¿Eliminar «${p.title}»? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteMut.mutate({ id: p.id });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={FolderKanban}
        title={t("clubProjectsAdmin")}
        description={t("clubProjectsAdminDesc")}
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actions={
          <Button type="button" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo proyecto
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
              No hay proyectos. Crea el primero con &quot;Nuevo proyecto&quot;.
            </div>
          ) : (
            sorted.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-video bg-muted/40">
                  {p.imageUrl ? (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 320px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#7E2CFF]/10 to-[#00C8FF]/10">
                      <FolderKanban className="h-10 w-10 text-[#7E2CFF]/50" />
                    </div>
                  )}
                  <Badge
                    className="absolute right-2 top-2"
                    variant={p.isPublished ? "default" : "secondary"}
                  >
                    {p.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold leading-snug">{p.title}</h3>
                  {p.tags ? (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {p.tags}
                    </p>
                  ) : null}
                  <div className="flex justify-end gap-1 pt-2">
                    {p.projectUrl ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={p.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Abrir proyecto"
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
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => void handleDelete(p)}
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
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead className="w-[120px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminListLoading colSpan={5} />
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay proyectos. Crea el primero con &quot;Nuevo proyecto&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {p.tags || "—"}
                  </TableCell>
                  <TableCell>{p.isPublished ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEdit(p)}
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(p)}
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
              <FolderKanban className="h-5 w-5" />
              {editingId ? "Editar proyecto" : "Nuevo proyecto"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="pr-title">Título</Label>
              <Input
                id="pr-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Ej. Campus Connect"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-desc">Descripción</Label>
              <Textarea
                id="pr-desc"
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Qué hace el proyecto, stack, impacto..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-tags">Tags (separados por coma)</Label>
              <Input
                id="pr-tags"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="React, AWS Lambda, DynamoDB"
              />
            </div>
            <S3ImageUploadField
              id="pr-img"
              label="Imagen del proyecto (opcional)"
              folder="projects"
              value={form.imageUrl}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            />
            <div className="space-y-2">
              <Label htmlFor="pr-url">Enlace al proyecto (GitHub, demo…)</Label>
              <Input
                id="pr-url"
                value={form.projectUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, projectUrl: e.target.value }))
                }
                placeholder="https://github.com/..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="pr-pub"
                checked={form.isPublished}
                onCheckedChange={(c) =>
                  setForm((f) => ({ ...f, isPublished: c === true }))
                }
              />
              <Label htmlFor="pr-pub" className="font-normal cursor-pointer">
                Publicado en la web
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-sort">Orden (menor = primero)</Label>
              <Input
                id="pr-sort"
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
              {editingId ? "Guardar cambios" : "Crear proyecto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
