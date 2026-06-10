"use client";

import { AdminListLoading } from "@/components/dashboard/AdminListLoading";
import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { trpc } from "@/utils/trpc";
import type { AuditAction } from "@prisma/client";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Globe,
  Monitor,
  Search,
  Shield,
} from "lucide-react";
import { Fragment, useMemo, useState } from "react";

const ACTION_VARIANT: Record<
  AuditAction,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  RESTORE: "outline",
  REORDER: "outline",
  LOGIN: "default",
  LOGOUT: "secondary",
  OTHER: "outline",
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function shortUserAgent(ua: string | null | undefined) {
  if (!ua) return "—";
  if (ua.length <= 60) return ua;
  return `${ua.slice(0, 57)}…`;
}

export default function AuditoriaPage() {
  const [userId, setUserId] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [resource, setResource] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const queryInput = useMemo(
    () => ({
      limit: 40,
      ...(userId !== "all" ? { userId } : {}),
      ...(action !== "all"
        ? { action: action as AuditAction }
        : {}),
      ...(resource !== "all" ? { resource } : {}),
      ...(searchDebounced ? { search: searchDebounced } : {}),
    }),
    [userId, action, resource, searchDebounced]
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.auditLogs.list.useInfiniteQuery(queryInput, {
      getNextPageParam: (last) => last.nextCursor,
    });

  const rows = data?.pages.flatMap((p) => p.items) ?? [];
  const filters = data?.pages[0]?.filters;

  const applySearch = () => setSearchDebounced(search.trim());

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={ClipboardList}
        title="Auditoría"
        description="Historial de acciones del core team en el panel. Solo usuarios autenticados; las visitas públicas no se registran aquí."
      />

      <Card className="rounded-2xl border-border/70 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-[#7E2CFF]" />
            Filtros
          </CardTitle>
          <CardDescription>
            IP, usuario, tipo de acción y recurso afectado.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
          <div className="flex flex-1 min-w-[200px] flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Buscar
            </span>
            <div className="flex gap-2">
              <Input
                placeholder="Email, nombre, IP, resumen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applySearch()}
              />
              <Button type="button" variant="secondary" onClick={applySearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <span className="text-xs font-medium text-muted-foreground">
              Usuario
            </span>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filters?.users.map((u) => (
                  <SelectItem key={u.userId} value={u.userId}>
                    {u.userName ?? u.userEmail}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <span className="text-xs font-medium text-muted-foreground">
              Acción
            </span>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {filters?.actions.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <span className="text-xs font-medium text-muted-foreground">
              Recurso
            </span>
            <Select value={resource} onValueChange={setResource}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {filters?.resources.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <AdminListLoading />
      ) : (
        <Card className="rounded-2xl border-border/70 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Resumen</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    Aún no hay registros. Las acciones del panel (crear,
                    editar, eliminar) aparecerán aquí automáticamente.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const open = expandedId === row.id;
                  return (
                    <Fragment key={row.id}>
                      <TableRow className="group">
                          <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  setExpandedId(open ? null : row.id)
                                }
                              >
                                {open ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {formatDate(row.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">
                              {row.userName ?? "—"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {row.userEmail}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={ACTION_VARIANT[row.action]}>
                              {row.actionLabel}
                            </Badge>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {row.resourceLabel}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm truncate" title={row.summary}>
                              {row.summary}
                            </p>
                            {row.procedure ? (
                              <p className="text-[10px] font-mono text-muted-foreground truncate">
                                {row.procedure}
                              </p>
                            ) : null}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {row.ipAddress ?? "—"}
                          </TableCell>
                        </TableRow>
                      {open ? (
                        <TableRow
                          key={`${row.id}-detail`}
                          className="bg-muted/20 hover:bg-muted/20"
                        >
                          <TableCell colSpan={6} className="py-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div className="space-y-2 text-sm">
                                <p className="flex items-center gap-2 font-medium">
                                  <Globe className="h-3.5 w-3.5" />
                                  IP:{" "}
                                  <span className="font-mono font-normal">
                                    {row.ipAddress ?? "No disponible"}
                                  </span>
                                </p>
                                <p className="flex items-start gap-2">
                                  <Monitor className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                  <span className="text-muted-foreground break-all">
                                    {shortUserAgent(row.userAgent)}
                                  </span>
                                </p>
                                {row.resourceId ? (
                                  <p className="text-xs text-muted-foreground">
                                    ID recurso:{" "}
                                    <code className="rounded bg-muted px-1">
                                      {row.resourceId}
                                    </code>
                                  </p>
                                ) : null}
                              </div>
                              {row.changes ? (
                                <div>
                                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Datos enviados (contraseñas redactadas)
                                  </p>
                                  <pre className="max-h-48 overflow-auto rounded-lg border bg-background p-3 text-[11px] leading-relaxed">
                                    {JSON.stringify(row.changes, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Sin detalle de cambios para esta acción.
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
          {hasNextPage ? (
            <div className="border-t p-4 text-center">
              <Button
                type="button"
                variant="outline"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Cargando…" : "Cargar más"}
              </Button>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
