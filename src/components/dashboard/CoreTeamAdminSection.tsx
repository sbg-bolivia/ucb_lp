"use client";

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
import { trpc } from "@/utils/trpc";
import { Save, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Editor del core team del sitio público (/equipo).
 * Persiste en `Tenant.coreTeam` vía `companyInfo.update`.
 */
export function CoreTeamAdminSection() {
  const { data: tenant, refetch } = trpc.companyInfo.getForAdmin.useQuery();
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

  return (
    <Card className="rounded-xl border border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          Core team (página pública)
        </CardTitle>
        <CardDescription>
          Fotos (URL), nombres, cargos y enlaces a LinkedIn, Instagram y GitHub.
          Si no guardas ningún miembro válido, el sitio usa los datos por
          defecto del código.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No hay miembros. Usa &quot;Añadir miembro&quot; para comenzar.
          </p>
        ) : null}

        {members.map((member, index) => (
          <div
            key={member.id}
            className="space-y-3 rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">Miembro {index + 1}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() =>
                  setMembers((prev) => prev.filter((_, j) => j !== index))
                }
              >
                Quitar
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`ct-name-${member.id}`}>Nombre</Label>
                <Input
                  id={`ct-name-${member.id}`}
                  value={member.name}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, name: e.target.value } : m
                      )
                    )
                  }
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ct-role-${member.id}`}>Rol / cargo</Label>
                <Input
                  id={`ct-role-${member.id}`}
                  value={member.role}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, role: e.target.value } : m
                      )
                    )
                  }
                  placeholder="Ej. Presidente · Liderazgo"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`ct-img-${member.id}`}>
                  URL de foto (opcional)
                </Label>
                <Input
                  id={`ct-img-${member.id}`}
                  value={member.image ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, image: e.target.value } : m
                      )
                    )
                  }
                  placeholder="/miembros/foto.jpg o https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ct-li-${member.id}`}>LinkedIn</Label>
                <Input
                  id={`ct-li-${member.id}`}
                  value={member.linkedin ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, linkedin: e.target.value } : m
                      )
                    )
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`ct-ig-${member.id}`}>Instagram</Label>
                <Input
                  id={`ct-ig-${member.id}`}
                  value={member.instagram ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, instagram: e.target.value } : m
                      )
                    )
                  }
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor={`ct-gh-${member.id}`}>GitHub</Label>
                <Input
                  id={`ct-gh-${member.id}`}
                  value={member.github ?? ""}
                  onChange={(e) =>
                    setMembers((prev) =>
                      prev.map((m, j) =>
                        j === index ? { ...m, github: e.target.value } : m
                      )
                    )
                  }
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              setMembers((prev) => [
                ...prev,
                {
                  id:
                    typeof crypto !== "undefined" && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `m-${Date.now()}`,
                  name: "",
                  role: "",
                  image: "",
                  linkedin: "",
                  instagram: "",
                  github: "",
                },
              ])
            }
          >
            Añadir miembro
          </Button>
          <Button
            type="button"
            onClick={() => void save()}
            disabled={updateInfo.isPending}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar equipo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
