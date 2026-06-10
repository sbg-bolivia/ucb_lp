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
import {
  AWS_DIFFICULTY_LABELS,
  AWS_SERVICE_CARD_TYPE_LABELS,
  AWS_SERVICE_CATEGORY_LABELS,
} from "@/lib/aws-labels";
import { slugify } from "@/lib/slugify";
import { trpc } from "@/utils/trpc";
import type {
  AwsDifficultyLevel,
  AwsServiceCardType,
  AwsServiceCategory,
} from "@prisma/client";
import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { Badge } from "@/components/ui/badge";
import { useAdminViewMode } from "@/hooks/useAdminViewMode";
import { Cloud, ExternalLink, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ServiceFormState = {
  slug: string;
  name: string;
  category: AwsServiceCategory;
  shortDescription: string;
  technicalExplanation: string;
  whenToUse: string;
  whenNotToUse: string;
  officialDocsUrl: string;
  difficultyLevel: AwsDifficultyLevel | "";
  isPopular: boolean;
  isPublished: boolean;
  sortOrder: string;
};

type CardFormState = {
  cardType: AwsServiceCardType;
  title: string;
  content: string;
  linkUrl: string;
  linkLabel: string;
  isPublished: boolean;
  sortOrder: string;
};

type ServiceCardRow = {
  id: string;
  cardType: AwsServiceCardType;
  title: string | null;
  content: string;
  linkUrl: string | null;
  linkLabel: string | null;
  isPublished: boolean;
  sortOrder: number;
};

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  category: AwsServiceCategory;
  shortDescription: string;
  technicalExplanation: string | null;
  whenToUse: string | null;
  whenNotToUse: string | null;
  officialDocsUrl: string | null;
  difficultyLevel: AwsDifficultyLevel | null;
  isPopular: boolean;
  isPublished: boolean;
  sortOrder: number;
  cards: ServiceCardRow[];
};

const CATEGORIES = Object.keys(
  AWS_SERVICE_CATEGORY_LABELS
) as AwsServiceCategory[];
const DIFFICULTIES = Object.keys(
  AWS_DIFFICULTY_LABELS
) as AwsDifficultyLevel[];
const CARD_TYPES = Object.keys(
  AWS_SERVICE_CARD_TYPE_LABELS
) as AwsServiceCardType[];

const emptyServiceForm: ServiceFormState = {
  slug: "",
  name: "",
  category: "COMPUTE",
  shortDescription: "",
  technicalExplanation: "",
  whenToUse: "",
  whenNotToUse: "",
  officialDocsUrl: "",
  difficultyLevel: "",
  isPopular: false,
  isPublished: false,
  sortOrder: "0",
};

const emptyCardForm: CardFormState = {
  cardType: "USE_CASE",
  title: "",
  content: "",
  linkUrl: "",
  linkLabel: "",
  isPublished: true,
  sortOrder: "0",
};

function serviceToForm(s: ServiceRow): ServiceFormState {
  return {
    slug: s.slug,
    name: s.name,
    category: s.category,
    shortDescription: s.shortDescription,
    technicalExplanation: s.technicalExplanation ?? "",
    whenToUse: s.whenToUse ?? "",
    whenNotToUse: s.whenNotToUse ?? "",
    officialDocsUrl: s.officialDocsUrl ?? "",
    difficultyLevel: s.difficultyLevel ?? "",
    isPopular: s.isPopular,
    isPublished: s.isPublished,
    sortOrder: String(s.sortOrder),
  };
}

function ServiceCardsEditor({
  serviceId,
  cards,
  onChanged,
}: {
  serviceId: string;
  cards: ServiceCardRow[];
  onChanged: () => void;
}) {
  const confirm = useConfirm();
  const [cardOpen, setCardOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [cardForm, setCardForm] = useState<CardFormState>(emptyCardForm);

  const createCardMut = trpc.awsServices.createCard.useMutation({
    onSuccess: () => {
      toast.success("Tarjeta añadida");
      onChanged();
      setCardOpen(false);
      setCardForm(emptyCardForm);
      setEditingCardId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateCardMut = trpc.awsServices.updateCard.useMutation({
    onSuccess: () => {
      toast.success("Tarjeta actualizada");
      onChanged();
      setCardOpen(false);
      setCardForm(emptyCardForm);
      setEditingCardId(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteCardMut = trpc.awsServices.deleteCard.useMutation({
    onSuccess: () => {
      toast.success("Tarjeta eliminada");
      onChanged();
    },
    onError: (e) => toast.error(e.message),
  });

  const openNewCard = () => {
    setEditingCardId(null);
    setCardForm(emptyCardForm);
    setCardOpen(true);
  };

  const openEditCard = (card: ServiceCardRow) => {
    setEditingCardId(card.id);
    setCardForm({
      cardType: card.cardType,
      title: card.title ?? "",
      content: card.content,
      linkUrl: card.linkUrl ?? "",
      linkLabel: card.linkLabel ?? "",
      isPublished: card.isPublished,
      sortOrder: String(card.sortOrder),
    });
    setCardOpen(true);
  };

  const submitCard = () => {
    const content = cardForm.content.trim();
    if (!content) {
      toast.error("El contenido de la tarjeta es obligatorio");
      return;
    }
    const sortOrder = Number.parseInt(cardForm.sortOrder, 10);
    const payload = {
      cardType: cardForm.cardType,
      title: cardForm.title.trim() || null,
      content,
      linkUrl: cardForm.linkUrl.trim() || null,
      linkLabel: cardForm.linkLabel.trim() || null,
      isPublished: cardForm.isPublished,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    };

    if (editingCardId) {
      updateCardMut.mutate({ id: editingCardId, ...payload });
    } else {
      createCardMut.mutate({ serviceId, ...payload });
    }
  };

  const cardBusy = createCardMut.isPending || updateCardMut.isPending;

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">Tarjetas opcionales</p>
        <Button type="button" size="sm" variant="outline" onClick={openNewCard}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Añadir tarjeta
        </Button>
      </div>
      {cards.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sin tarjetas. Añade tips, labs, advertencias, etc.
        </p>
      ) : (
        <ul className="space-y-2">
          {cards.map((card) => (
            <li
              key={card.id}
              className="flex items-start justify-between gap-2 rounded-md border border-border bg-background p-3 text-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {AWS_SERVICE_CARD_TYPE_LABELS[card.cardType]}
                  {card.title ? ` · ${card.title}` : ""}
                </p>
                <p className="line-clamp-2 text-muted-foreground">
                  {card.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEditCard(card)}
                  aria-label="Editar tarjeta"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={async () => {
                    const ok = await confirm({
                      title: "Eliminar tarjeta",
                      description: "¿Eliminar esta tarjeta del servicio?",
                      confirmLabel: "Eliminar",
                      destructive: true,
                    });
                    if (ok) deleteCardMut.mutate({ id: card.id });
                  }}
                  aria-label="Eliminar tarjeta"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={cardOpen} onOpenChange={setCardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCardId ? "Editar tarjeta" : "Nueva tarjeta"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={cardForm.cardType}
                onValueChange={(v) =>
                  setCardForm((f) => ({
                    ...f,
                    cardType: v as AwsServiceCardType,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {AWS_SERVICE_CARD_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-title">Título (opcional)</Label>
              <Input
                id="card-title"
                value={cardForm.title}
                onChange={(e) =>
                  setCardForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-content">Contenido</Label>
              <Textarea
                id="card-content"
                rows={4}
                value={cardForm.content}
                onChange={(e) =>
                  setCardForm((f) => ({ ...f, content: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="card-link">Enlace (opcional)</Label>
                <Input
                  id="card-link"
                  value={cardForm.linkUrl}
                  onChange={(e) =>
                    setCardForm((f) => ({ ...f, linkUrl: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-link-label">Texto enlace</Label>
                <Input
                  id="card-link-label"
                  value={cardForm.linkLabel}
                  onChange={(e) =>
                    setCardForm((f) => ({ ...f, linkLabel: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-sort">Orden</Label>
              <Input
                id="card-sort"
                type="number"
                min={0}
                value={cardForm.sortOrder}
                onChange={(e) =>
                  setCardForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="card-pub"
                checked={cardForm.isPublished}
                onCheckedChange={(c) =>
                  setCardForm((f) => ({ ...f, isPublished: c === true }))
                }
              />
              <Label htmlFor="card-pub" className="font-normal cursor-pointer">
                Publicada
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCardOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submitCard} disabled={cardBusy}>
              {editingCardId ? "Guardar" : "Añadir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ClubServiciosAdminPage() {
  const { t } = useTranslation("dashboard");
  const confirm = useConfirm();
  const { mode: viewMode, setMode: setViewMode } =
    useAdminViewMode("club-servicios");
  const { data: services, refetch, isLoading } =
    trpc.awsServices.listForAdmin.useQuery();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormState>(emptyServiceForm);
  const [slugTouched, setSlugTouched] = useState(false);

  // @ts-expect-error TS2589 — profundidad de tipos Zod + tRPC en awsServices.create
  const createMut = trpc.awsServices.create.useMutation({
    onSuccess: () => {
      toast.success("Servicio creado");
      void refetch();
      setOpen(false);
      setForm(emptyServiceForm);
      setEditingId(null);
      setSlugTouched(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateMut = trpc.awsServices.update.useMutation({
    onSuccess: () => {
      toast.success("Servicio actualizado");
      void refetch();
      setOpen(false);
      setForm(emptyServiceForm);
      setEditingId(null);
      setSlugTouched(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteMut = trpc.awsServices.delete.useMutation({
    onSuccess: () => {
      toast.success("Servicio eliminado");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const sorted = useMemo(() => services ?? [], [services]);
  const editingService = sorted.find((s) => s.id === editingId);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyServiceForm);
    setSlugTouched(false);
    setOpen(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditingId(s.id);
    setForm(serviceToForm(s));
    setSlugTouched(true);
    setOpen(true);
  };

  const submit = () => {
    const name = form.name.trim();
    const slug = form.slug.trim();
    const shortDescription = form.shortDescription.trim();
    if (!name || !slug || !shortDescription) {
      toast.error("Nombre, slug y descripción corta son obligatorios");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      toast.error("Slug inválido: usa minúsculas, números y guiones");
      return;
    }
    const sortOrder = Number.parseInt(form.sortOrder, 10);
    const payload = {
      slug,
      name,
      category: form.category,
      shortDescription,
      technicalExplanation: form.technicalExplanation.trim() || null,
      whenToUse: form.whenToUse.trim() || null,
      whenNotToUse: form.whenNotToUse.trim() || null,
      officialDocsUrl: form.officialDocsUrl.trim() || null,
      difficultyLevel: form.difficultyLevel || null,
      isPopular: form.isPopular,
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

  const handleDelete = async (s: ServiceRow) => {
    const ok = await confirm({
      title: "Eliminar servicio",
      description: `¿Eliminar «${s.name}» y todas sus tarjetas?`,
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (ok) deleteMut.mutate({ id: s.id });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={Cloud}
        title={t("clubServicesAdmin")}
        description={
          <>
            {t("clubServicesAdminDesc")}{" "}
            <Link
              href="/servicios"
              className="text-primary underline-offset-2 hover:underline"
            >
              Ver en /servicios
            </Link>
          </>
        }
        showViewToggle
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actions={
          <Button type="button" onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo servicio
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
            <div className="col-span-full rounded-2xl border border-dashed border-border py-16 text-center text-muted-foreground">
              No hay servicios. Crea el primero con &quot;Nuevo servicio&quot;.
            </div>
          ) : (
            sorted.map((s) => (
              <div
                key={s.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 border-b border-border/50 bg-gradient-to-br from-[#7E2CFF]/8 to-[#00C8FF]/8 p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 shrink-0 text-[#7E2CFF]" />
                      <h3 className="truncate font-semibold">{s.name}</h3>
                      {s.isPopular ? (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                      ) : null}
                    </div>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {s.slug}
                    </p>
                  </div>
                  <Badge variant={s.isPublished ? "default" : "secondary"}>
                    {s.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-xs font-medium text-primary/90">
                    {AWS_SERVICE_CATEGORY_LABELS[s.category]}
                  </p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {s.shortDescription}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.cards.length} tarjeta{s.cards.length === 1 ? "" : "s"}
                  </p>
                  <div className="flex justify-end gap-1 pt-2">
                    {s.isPublished ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={`/servicios/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ver público"
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
                      onClick={() => openEdit(s)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => void handleDelete(s)}
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
              <TableHead>Nombre</TableHead>
              <TableHead className="hidden md:table-cell">Slug</TableHead>
              <TableHead className="hidden lg:table-cell">Categoría</TableHead>
              <TableHead>Tarjetas</TableHead>
              <TableHead>Publicado</TableHead>
              <TableHead className="w-[140px] text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <AdminListLoading colSpan={5} />
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-muted-foreground"
                >
                  No hay servicios. Crea el primero con &quot;Nuevo servicio&quot;.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">
                    {s.name}
                    {s.isPopular ? (
                      <span className="ml-2 text-xs text-primary">★</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {s.slug}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {AWS_SERVICE_CATEGORY_LABELS[s.category]}
                  </TableCell>
                  <TableCell>{s.cards.length}</TableCell>
                  <TableCell>{s.isPublished ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-right">
                    {s.isPublished ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a
                          href={`/servicios/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ver público"
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
                      onClick={() => openEdit(s)}
                      aria-label="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => void handleDelete(s)}
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
        <DialogContent className="max-h-[min(92vh,860px)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              {editingId ? "Editar servicio AWS" : "Nuevo servicio AWS"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-name">Nombre</Label>
                <Input
                  id="svc-name"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: slugTouched ? f.slug : slugify(name),
                    }));
                  }}
                  placeholder="Amazon EC2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-slug">Slug (URL)</Label>
                <Input
                  id="svc-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm((f) => ({ ...f, slug: e.target.value }));
                  }}
                  placeholder="ec2"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      category: v as AwsServiceCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {AWS_SERVICE_CATEGORY_LABELS[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dificultad</Label>
                <Select
                  value={form.difficultyLevel || "none"}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      difficultyLevel:
                        v === "none" ? "" : (v as AwsDifficultyLevel),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin especificar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin especificar</SelectItem>
                    {DIFFICULTIES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {AWS_DIFFICULTY_LABELS[d]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-short">Descripción corta</Label>
              <Textarea
                id="svc-short"
                rows={2}
                value={form.shortDescription}
                onChange={(e) =>
                  setForm((f) => ({ ...f, shortDescription: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-tech">Explicación técnica</Label>
              <Textarea
                id="svc-tech"
                rows={3}
                value={form.technicalExplanation}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    technicalExplanation: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="svc-when">Cuándo usarlo</Label>
                <Textarea
                  id="svc-when"
                  rows={3}
                  value={form.whenToUse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, whenToUse: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svc-when-not">Cuándo no usarlo</Label>
                <Textarea
                  id="svc-when-not"
                  rows={3}
                  value={form.whenNotToUse}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, whenNotToUse: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-docs">Docs oficiales AWS</Label>
              <Input
                id="svc-docs"
                value={form.officialDocsUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, officialDocsUrl: e.target.value }))
                }
                placeholder="https://docs.aws.amazon.com/..."
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="svc-pop"
                  checked={form.isPopular}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isPopular: c === true }))
                  }
                />
                <Label htmlFor="svc-pop" className="font-normal cursor-pointer">
                  Marcar como popular
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="svc-pub"
                  checked={form.isPublished}
                  onCheckedChange={(c) =>
                    setForm((f) => ({ ...f, isPublished: c === true }))
                  }
                />
                <Label htmlFor="svc-pub" className="font-normal cursor-pointer">
                  Publicado en la web
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="svc-sort">Orden</Label>
              <Input
                id="svc-sort"
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sortOrder: e.target.value }))
                }
              />
            </div>

            {editingId && editingService ? (
              <ServiceCardsEditor
                serviceId={editingId}
                cards={editingService.cards}
                onChanged={() => void refetch()}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Guarda el servicio primero; luego podrás añadir tarjetas
                opcionales al editarlo.
              </p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={submit} disabled={busy}>
              {editingId ? "Guardar cambios" : "Crear servicio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
