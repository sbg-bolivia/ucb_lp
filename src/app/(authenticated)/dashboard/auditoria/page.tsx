"use client";

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
import { parseUserAgentSummary } from "@/lib/parse-user-agent";
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  Globe,
  LogIn,
  LogOut,
  Monitor,
  Pencil,
  RefreshCw,
  Search,
  Shield,
  X,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useState } from "react";

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

const ACTION_ICON: Partial<Record<AuditAction, typeof LogIn>> = {
  LOGIN: LogIn,
  LOGOUT: LogOut,
  UPDATE: Pencil,
};

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function formatRelative(value: Date | string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

function shortUserAgent(ua: string | null | undefined) {
  if (!ua) return "—";
  if (ua.length <= 60) return ua;
  return `${ua.slice(0, 57)}…`;
}

type AuditLogRow = {
  id: string;
  createdAt: Date | string;
  userName: string | null;
  userEmail: string;
  action: AuditAction;
  actionLabel: string;
  resourceLabel: string;
  providerLabel?: string | null;
  deviceLabel?: string | null;
  summary: string;
  procedure: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  resourceId: string | null;
  changes: unknown;
};

type AuditListFilters = {
  users: Array<{ userId: string; userEmail: string; userName: string | null }>;
  resources: Array<{ value: string; label: string }>;
  actions: Array<{ value: string; label: string }>;
};

type AuditStats = {
  total24h: number;
  loginsToday: number;
  logoutsToday: number;
  mutationsToday: number;
};

type RecentLogin = {
  id: string;
  createdAt: Date | string;
  userName: string | null;
  userEmail: string;
  ipAddress: string | null;
  summary: string;
  providerLabel?: string | null;
  deviceLabel?: string | null;
};

type AuditListResult = {
  items: AuditLogRow[];
  nextCursor?: string;
  stats?: AuditStats;
  recentLogins?: RecentLogin[];
  filters: AuditListFilters;
};

function exportRowsToCsv(rows: AuditLogRow[]) {
  const header = [
    "fecha",
    "usuario",
    "email",
    "accion",
    "recurso",
    "resumen",
    "ip",
    "dispositivo",
  ];
  const lines = rows.map((r) =>
    [
      formatDate(r.createdAt),
      r.userName ?? "",
      r.userEmail,
      r.actionLabel,
      r.resourceLabel,
      r.summary,
      r.ipAddress ?? "",
      r.deviceLabel ?? parseUserAgentSummary(r.userAgent),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `auditoria-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AuditoriaPage() {
  const [userId, setUserId] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const [resource, setResource] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pageCursor, setPageCursor] = useState<string | undefined>();
  const [rows, setRows] = useState<AuditLogRow[]>([]);

  const queryInput = useMemo(
    () => ({
      limit: 40,
      ...(pageCursor ? { cursor: pageCursor } : {}),
      ...(userId !== "all" ? { userId } : {}),
      ...(action !== "all" ? { action: action as AuditAction } : {}),
      ...(resource !== "all" ? { resource } : {}),
      ...(searchDebounced ? { search: searchDebounced } : {}),
    }),
    [userId, action, resource, searchDebounced, pageCursor]
  );

  const {
    data: listResult,
    isLoading,
    isFetching,
    refetch,
  } = trpc.auditLogs.list.useQuery(queryInput, {
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
  const data = listResult as AuditListResult | undefined;

  const filters = data?.filters;
  const stats = data?.stats;
  const recentLogins = data?.recentLogins;
  const nextCursor = data?.nextCursor;

  useEffect(() => {
    if (!data?.items) return;
    if (!pageCursor) {
      setRows(data.items);
      return;
    }
    setRows((prev) => {
      const seen = new Set(prev.map((r) => r.id));
      const added = data.items.filter((r) => !seen.has(r.id));
      return added.length > 0 ? [...prev, ...added] : prev;
    });
  }, [data?.items, pageCursor]);

  const resetPagination = () => {
    setPageCursor(undefined);
    setRows([]);
  };

  const applySearch = () => {
    resetPagination();
    setSearchDebounced(search.trim());
  };

  const loadMore = () => {
    if (nextCursor) setPageCursor(nextCursor);
  };

  const filterByAction = (value: string) => {
    resetPagination();
    setAction(value);
  };

  const clearFilters = () => {
    setUserId("all");
    setAction("all");
    setResource("all");
    setSearch("");
    setSearchDebounced("");
    resetPagination();
  };

  const hasActiveFilters =
    userId !== "all" ||
    action !== "all" ||
    resource !== "all" ||
    searchDebounced.length > 0;

  const handleRefresh = () => {
    resetPagination();
    void refetch();
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={ClipboardList}
        title="Auditoría"
        description="Historial de acciones del core team: inicios de sesión, cambios en el panel y más. Solo usuarios autenticados."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={rows.length === 0}
              onClick={() => exportRowsToCsv(rows)}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isFetching}
              onClick={handleRefresh}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
          </div>
        }
      />

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {stats.total24h}
                </p>
                <p className="text-xs text-muted-foreground">
                  Eventos (24 h)
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <LogIn className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {stats.loginsToday}
                </p>
                <p className="text-xs text-muted-foreground">
                  Inicios de sesión hoy
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-amber-500/10 p-2.5">
                <LogOut className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {stats.logoutsToday}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cierres de sesión hoy
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/80">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="rounded-xl bg-violet-500/10 p-2.5">
                <Pencil className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">
                  {stats.mutationsToday}
                </p>
                <p className="text-xs text-muted-foreground">
                  Cambios en panel hoy
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {recentLogins && recentLogins.length > 0 ? (
        <Card className="rounded-2xl border-border/70 bg-card/80">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LogIn className="h-4 w-4 text-emerald-600" />
              Últimos inicios de sesión
            </CardTitle>
            <CardDescription>
              Accesos recientes del equipo al panel (correo, Google, IP y
              dispositivo).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {recentLogins.map((login) => (
                <div
                  key={login.id}
                  className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.04] p-3"
                >
                  <p className="text-sm font-medium">
                    {login.userName ?? login.userEmail}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelative(login.createdAt)} ·{" "}
                    {formatDate(login.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {login.providerLabel ? (
                      <Badge variant="outline" className="text-[10px]">
                        {login.providerLabel}
                      </Badge>
                    ) : null}
                    {login.deviceLabel ? (
                      <Badge variant="secondary" className="text-[10px]">
                        {login.deviceLabel}
                      </Badge>
                    ) : null}
                    {login.ipAddress ? (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {login.ipAddress}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

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
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={action === "LOGIN" ? "default" : "outline"}
              onClick={() => filterByAction(action === "LOGIN" ? "all" : "LOGIN")}
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              Solo inicios de sesión
            </Button>
            <Button
              type="button"
              size="sm"
              variant={action === "LOGOUT" ? "default" : "outline"}
              onClick={() =>
                filterByAction(action === "LOGOUT" ? "all" : "LOGOUT")
              }
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Solo cierres
            </Button>
            <Button
              type="button"
              size="sm"
              variant={resource === "auth_sessions" ? "default" : "outline"}
              onClick={() => {
                resetPagination();
                setResource(
                  resource === "auth_sessions" ? "all" : "auth_sessions"
                );
              }}
            >
              Sesiones
            </Button>
            <Button
              type="button"
              size="sm"
              variant={action === "LOGIN" && resource === "all" ? "default" : "outline"}
              onClick={() => {
                resetPagination();
                setAction("LOGIN");
                setResource("all");
              }}
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Accesos
            </Button>
            {hasActiveFilters ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearFilters}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Limpiar filtros
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
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
              <Select
                value={userId}
                onValueChange={(v) => {
                  resetPagination();
                  setUserId(v);
                }}
              >
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
              <Select
                value={action}
                onValueChange={(v) => {
                  resetPagination();
                  setAction(v);
                }}
              >
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
              <Select
                value={resource}
                onValueChange={(v) => {
                  resetPagination();
                  setResource(v);
                }}
              >
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
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-border/70 bg-muted/30" />
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
                    Aún no hay registros. Los inicios de sesión y las acciones
                    del panel aparecerán aquí automáticamente.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => {
                  const open = expandedId === row.id;
                  const ActionIcon = ACTION_ICON[row.action];
                  const isAuth =
                    row.action === "LOGIN" || row.action === "LOGOUT";

                  return (
                    <Fragment key={row.id}>
                      <TableRow
                        className={
                          isAuth ? "bg-emerald-500/[0.03]" : undefined
                        }
                      >
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
                        <TableCell className="whitespace-nowrap">
                          <div
                            className="text-xs text-muted-foreground"
                            title={formatDate(row.createdAt)}
                          >
                            {formatRelative(row.createdAt)}
                          </div>
                          <div className="text-[10px] text-muted-foreground/80">
                            {formatDate(row.createdAt)}
                          </div>
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
                          <Badge
                            variant={ACTION_VARIANT[row.action]}
                            className="gap-1"
                          >
                            {ActionIcon ? (
                              <ActionIcon className="h-3 w-3" />
                            ) : null}
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
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {row.providerLabel ? (
                              <Badge variant="outline" className="text-[10px]">
                                {row.providerLabel}
                              </Badge>
                            ) : null}
                            {row.deviceLabel ? (
                              <Badge variant="secondary" className="text-[10px]">
                                {row.deviceLabel}
                              </Badge>
                            ) : null}
                            {row.procedure ? (
                              <span className="text-[10px] font-mono text-muted-foreground truncate">
                                {row.procedure}
                              </span>
                            ) : null}
                          </div>
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
                                  <span className="text-muted-foreground">
                                    {row.deviceLabel ??
                                      parseUserAgentSummary(row.userAgent)}
                                    <span className="mt-1 block break-all text-xs opacity-70">
                                      {shortUserAgent(row.userAgent)}
                                    </span>
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
                                    Detalle
                                  </p>
                                  <pre className="max-h-48 overflow-auto rounded-lg border bg-background p-3 text-[11px] leading-relaxed">
                                    {JSON.stringify(row.changes, null, 2)}
                                  </pre>
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Sin detalle adicional para esta acción.
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
          {nextCursor ? (
            <div className="border-t border-border/60 p-4 text-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={loadMore}
              >
                {isFetching ? "Cargando…" : "Cargar más"}
              </Button>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}
