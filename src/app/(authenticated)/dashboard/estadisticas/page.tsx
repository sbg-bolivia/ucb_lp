"use client";

import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { downloadStatsCsv } from "@/lib/export-stats-csv";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  Cloud,
  Download,
  Eye,
  Globe2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/80">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="rounded-xl bg-gradient-to-br from-[#7E2CFF]/15 to-[#00C8FF]/15 p-2.5">
          <Icon className="h-5 w-5 text-[#7E2CFF] dark:text-[#00C8FF]" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function EstadisticasPage() {
  const { data, isLoading } = trpc.dashboardStats.getOverview.useQuery();

  const maxDayViews = Math.max(
    ...(data?.traffic.last7Days.map((d) => d.views) ?? [1]),
    1
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={BarChart3}
        title="Estadísticas"
        description="Visitas al sitio público, contenido publicado y salud general de la plataforma."
        actions={
          data ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => downloadStatsCsv(data)}
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          ) : null
        }
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-border bg-muted/30"
            />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Visitas (7 días)"
              value={data.traffic.views7d}
              hint="Páginas públicas registradas"
              icon={Eye}
            />
            <StatCard
              label="Visitas (30 días)"
              value={data.traffic.views30d}
              icon={TrendingUp}
            />
            <StatCard
              label="Usuarios"
              value={data.content.users}
              icon={Users}
            />
            <StatCard
              label="Eventos publicados"
              value={data.content.eventsPublished}
              hint={`${data.content.eventsTotal} en total`}
              icon={Calendar}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Tráfico últimos 7 días</CardTitle>
                <CardDescription>
                  Registro interno de visitas (complementa Google Analytics si lo
                  activas).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-40 items-end gap-2">
                  {data.traffic.last7Days.map((day) => (
                    <div
                      key={day.date}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-[#7E2CFF] to-[#00C8FF] transition-all"
                        style={{
                          height: `${Math.max(8, (day.views / maxDayViews) * 100)}%`,
                          minHeight: day.views > 0 ? "12px" : "4px",
                          opacity: day.views > 0 ? 1 : 0.25,
                        }}
                        title={`${day.views} visitas`}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {day.date.slice(5)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Páginas más visitadas (30 días)</CardTitle>
                <CardDescription>Rutas con más registros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.traffic.topPages.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aún no hay visitas registradas. Navega el sitio público para
                    empezar a acumular datos.
                  </p>
                ) : (
                  data.traffic.topPages.map((page) => (
                    <div
                      key={page.path}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                    >
                      <code className="text-sm">{page.path}</code>
                      <Badge variant="secondary">{page.views}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Contenido publicado</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/dashboard/club-servicios"
                className="flex items-center gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-[#7E2CFF]/30 hover:bg-primary/5"
              >
                <Cloud className="h-5 w-5 text-[#00C8FF]" />
                <div>
                  <p className="font-semibold">{data.content.servicesPublished}</p>
                  <p className="text-xs text-muted-foreground">Servicios AWS</p>
                </div>
              </Link>
              <Link
                href="/dashboard/club-comunidades"
                className="flex items-center gap-3 rounded-xl border border-border/60 p-4 transition-colors hover:border-[#7E2CFF]/30 hover:bg-primary/5"
              >
                <Globe2 className="h-5 w-5 text-[#7E2CFF]" />
                <div>
                  <p className="font-semibold">
                    {data.content.communitiesPublished}
                  </p>
                  <p className="text-xs text-muted-foreground">Comunidades</p>
                </div>
              </Link>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 p-4">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">
                    {data.content.projectsPublished}
                  </p>
                  <p className="text-xs text-muted-foreground">Proyectos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Fuentes de tráfico (30 días)</CardTitle>
                <CardDescription>
                  Referrer registrado en visitas internas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.traffic.sources.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sin datos aún. Navega el sitio público para acumular fuentes.
                  </p>
                ) : (
                  data.traffic.sources.map((source) => (
                    <div
                      key={source.label}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                    >
                      <span className="text-sm">{source.label}</span>
                      <Badge variant="secondary">{source.count}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Dispositivos (30 días)</CardTitle>
                <CardDescription>
                  Clasificación por user-agent en visitas internas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.traffic.devices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sin datos de dispositivos todavía.
                  </p>
                ) : (
                  data.traffic.devices.map((device) => (
                    <div
                      key={device.label}
                      className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
                    >
                      <span className="text-sm capitalize">{device.label}</span>
                      <Badge variant="secondary">{device.count}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Google Analytics</CardTitle>
              <CardDescription>
                {data.integrations.googleAnalyticsConfigured
                  ? "GOOGLE_ANALYTICS_ID está configurado. Las visitas también se envían a GA vía gtag."
                  : "Añade GOOGLE_ANALYTICS_ID en .env para el script de seguimiento en el sitio público."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.integrations.ga4DataApiConfigured ? (
                data.integrations.ga4 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Fuentes GA4 (30 días)</p>
                      {data.integrations.ga4.sources.map((s) => (
                        <div
                          key={s.label}
                          className="flex justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                        >
                          <span>{s.label}</span>
                          <Badge variant="outline">{s.count}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Dispositivos GA4</p>
                      {data.integrations.ga4.devices.map((d) => (
                        <div
                          key={d.label}
                          className="flex justify-between rounded-lg border border-border/60 px-3 py-2 text-sm"
                        >
                          <span className="capitalize">{d.label}</span>
                          <Badge variant="outline">{d.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    GA4 Data API configurada pero no se pudo obtener el reporte.
                    Verifica permisos de la service account en la propiedad GA4.
                  </p>
                )
              ) : (
                <p className="text-sm text-muted-foreground">
                  Para fuentes y dispositivos desde GA4 directamente, añade{" "}
                  <code className="rounded bg-muted px-1">
                    GOOGLE_ANALYTICS_PROPERTY_ID
                  </code>{" "}
                  y{" "}
                  <code className="rounded bg-muted px-1">
                    GOOGLE_SERVICE_ACCOUNT_JSON
                  </code>{" "}
                  (JSON de la cuenta de servicio con acceso de lectura a Analytics).
                </p>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
