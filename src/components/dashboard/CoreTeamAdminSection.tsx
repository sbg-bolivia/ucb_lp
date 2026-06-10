"use client";

import { AdminDragHandle, reorderItems } from "@/components/dashboard/AdminDragReorder";
import { useConfirm } from "@/components/dashboard/ConfirmDialogProvider";
import { S3ImageUploadField } from "@/components/dashboard/S3ImageUploadField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CoreTeamMember,
  parseCoreTeamJson,
} from "@/lib/club-core-team-schema";
import { getInitials } from "@/lib/utils/avatar";
import { trpc } from "@/utils/trpc";
import {
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Plus,
  Save,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function newMemberId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}`;
}

function emptyMember(): CoreTeamMember {
  return {
    id: newMemberId(),
    name: "",
    role: "",
    image: "",
    linkedin: "",
    instagram: "",
    github: "",
  };
}

function MemberPreviewAvatar({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(image?.trim()) && !imgFailed;
  const initials = getInitials(name) || "?";

  return (
    <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl border-2 border-primary/20 bg-muted shadow-inner">
      {showImage ? (
        <Image
          src={image as string}
          alt={name || "Miembro"}
          fill
          className="object-cover"
          sizes="96px"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#7E2CFF] to-[#00C8FF] text-xl font-bold text-white">
          {initials}
        </div>
      )}
    </div>
  );
}

function TeamMemberCard({
  member,
  index,
  onChange,
  onRemove,
  onDragReorder,
}: {
  member: CoreTeamMember;
  index: number;
  onChange: (patch: Partial<CoreTeamMember>) => void;
  onRemove: () => void;
  onDragReorder: (from: number, to: number) => void;
}) {
  const displayName = member.name.trim() || `Miembro ${index + 1}`;

  return (
    <Card
      draggable
      onDragStart={(e) =>
        e.dataTransfer.setData("text/plain", String(index))
      }
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const from = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
        if (Number.isFinite(from) && from !== index) {
          onDragReorder(from, index);
        }
      }}
      className="cursor-grab overflow-hidden rounded-2xl border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      <CardHeader className="relative space-y-4 border-b border-border/50 bg-muted/20 pb-4">
        <div className="absolute left-2 top-2">
          <AdminDragHandle label={`Reordenar ${displayName}`} />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={onRemove}
          aria-label={`Quitar a ${displayName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <MemberPreviewAvatar name={member.name} image={member.image} />

        <div className="space-y-1 text-center">
          <p className="text-base font-semibold text-foreground">
            {member.name.trim() || "Sin nombre"}
          </p>
          <p className="text-sm text-primary/90">
            {member.role.trim() || "Sin cargo asignado"}
          </p>
        </div>

        <div className="flex justify-center gap-2">
          {member.linkedin?.trim() ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <Linkedin className="h-3.5 w-3.5" />
            </span>
          ) : null}
          {member.instagram?.trim() ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <Instagram className="h-3.5 w-3.5" />
            </span>
          ) : null}
          {member.github?.trim() ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
              <Github className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor={`ct-name-${member.id}`}>Nombre</Label>
          <Input
            id={`ct-name-${member.id}`}
            value={member.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Nombre completo"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`ct-role-${member.id}`}>Rol / cargo</Label>
          <Input
            id={`ct-role-${member.id}`}
            value={member.role}
            onChange={(e) => onChange({ role: e.target.value })}
            placeholder="Ej. Presidente · Liderazgo"
          />
        </div>
        <S3ImageUploadField
          id={`ct-img-${member.id}`}
          label="Foto"
          folder="team"
          value={member.image ?? ""}
          onChange={(url) => onChange({ image: url })}
          placeholder="Sube a S3 o pega una URL"
        />
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label htmlFor={`ct-li-${member.id}`}>LinkedIn</Label>
            <Input
              id={`ct-li-${member.id}`}
              value={member.linkedin ?? ""}
              onChange={(e) => onChange({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ct-ig-${member.id}`}>Instagram</Label>
            <Input
              id={`ct-ig-${member.id}`}
              value={member.instagram ?? ""}
              onChange={(e) => onChange({ instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`ct-gh-${member.id}`}>GitHub</Label>
            <Input
              id={`ct-gh-${member.id}`}
              value={member.github ?? ""}
              onChange={(e) => onChange({ github: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Editor del core team del sitio público (/equipo).
 * Persiste en `Tenant.coreTeam` vía `companyInfo.update`.
 */
export function CoreTeamAdminSection() {
  const confirm = useConfirm();
  const { data: tenant, refetch, isLoading } =
    trpc.companyInfo.getForAdmin.useQuery();
  const [members, setMembers] = useState<CoreTeamMember[]>([]);

  useEffect(() => {
    if (tenant) {
      setMembers(
        parseCoreTeamJson((tenant as { coreTeam?: unknown }).coreTeam) ?? []
      );
    }
  }, [tenant]);

  const updateInfo = (
    trpc.companyInfo.update as unknown as {
      useMutation: (opts: {
        onSuccess: () => void;
        onError: (e: unknown) => void;
      }) => {
        mutateAsync: (input: { coreTeam: unknown }) => Promise<unknown>;
        isPending: boolean;
      };
    }
  ).useMutation({
    onSuccess: () => {
      toast.success("Equipo público guardado");
      refetch();
    },
    onError: (e: unknown) =>
      toast.error(e instanceof Error ? e.message : "Error al guardar"),
  });

  const save = async () => {
    const payload = members
      .filter((m) => m.name.trim() && m.role.trim())
      .map((m) => ({
        ...m,
        name: m.name.trim(),
        role: m.role.trim(),
        image: m.image?.trim() || null,
        linkedin: m.linkedin?.trim() || null,
        instagram: m.instagram?.trim() || null,
        github: m.github?.trim() || null,
      }));
    await updateInfo.mutateAsync({
      coreTeam: payload.length > 0 ? payload : null,
    });
  };

  const updateMember = (index: number, patch: Partial<CoreTeamMember>) => {
    setMembers((prev) =>
      prev.map((m, j) => (j === index ? { ...m, ...patch } : m))
    );
  };

  const reorderMembers = (from: number, to: number) => {
    setMembers((prev) => reorderItems(prev, from, to));
  };

  const removeMember = async (index: number) => {
    const name = members[index]?.name.trim() || `Miembro ${index + 1}`;
    const ok = await confirm({
      title: "Quitar miembro",
      description: `¿Quitar a «${name}» del equipo público? Debes guardar para aplicar el cambio.`,
      confirmLabel: "Quitar",
      destructive: true,
    });
    if (ok) setMembers((prev) => prev.filter((_, j) => j !== index));
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border/80 bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Core team</CardTitle>
              <CardDescription className="mt-1 max-w-xl">
                Gestiona los miembros que aparecen en la página pública. Cada
                tarjeta es una vista previa de cómo se verá en el sitio.
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              {members.length} {members.length === 1 ? "miembro" : "miembros"}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/equipo" target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver público
              </Link>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setMembers((prev) => [...prev, emptyMember()])}
            >
              <Plus className="mr-2 h-4 w-4" />
              Añadir
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void save()}
              disabled={updateInfo.isPending}
            >
              <Save className="mr-2 h-4 w-4" />
              {updateInfo.isPending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="h-80 animate-pulse rounded-2xl border-border/60 bg-muted/30"
            />
          ))}
        </div>
      ) : members.length === 0 ? (
        <button
          type="button"
          onClick={() => setMembers([emptyMember()])}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="rounded-full bg-primary/10 p-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Sin miembros aún</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Añade el primer miembro del core team con una tarjeta editable.
            </p>
          </div>
        </button>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {members.map((member, index) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              index={index}
              onChange={(patch) => updateMember(index, patch)}
              onRemove={() => void removeMember(index)}
              onDragReorder={reorderMembers}
            />
          ))}

          <button
            type="button"
            onClick={() => setMembers((prev) => [...prev, emptyMember()])}
            className="flex min-h-[280px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-muted/10 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-foreground"
          >
            <Plus className="h-8 w-8" />
            <span className="text-sm font-medium">Añadir miembro</span>
          </button>
        </div>
      )}
    </div>
  );
}
