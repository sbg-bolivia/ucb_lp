"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import {
  BarChart3,
  BookOpen,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Info,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import TenantInfo from "./TenantInfo";

interface ViewerDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tenantId?: string;
  } | null;
}

export default function ViewerDashboard({ user }: ViewerDashboardProps) {
  const { t } = useTranslation("dashboard");
  const router = useRouter();

  const viewerStats = useMemo(
    () => ({
      totalViews: 156,
      reportsViewed: 23,
      dataPoints: 1240,
      lastLogin: "Hace 2 horas",
    }),
    []
  );

  const availableReports = useMemo(
    () => [
      {
        id: 1,
        title: "Resumen de Mercados",
        description: "Análisis general de los mercados financieros",
        type: "market",
        lastUpdated: "Hace 1 hora",
        icon: <BarChart3 className="h-5 w-5 text-primary" />,
      },
      {
        id: 2,
        title: "Estadísticas de Usuarios",
        description: "Métricas de usuarios activos y registros",
        type: "users",
        lastUpdated: "Hace 3 horas",
        icon: <Users className="h-5 w-5 text-secondary" />,
      },
      {
        id: 3,
        title: "Rendimiento del Sistema",
        description: "Métricas de rendimiento y disponibilidad",
        type: "system",
        lastUpdated: "Hace 6 horas",
        icon: <TrendingUp className="h-5 w-5 text-accent-foreground" />,
      },
      {
        id: 4,
        title: "Actividad de la Plataforma",
        description: "Resumen de actividad de la plataforma",
        type: "platform",
        lastUpdated: "Hace 12 horas",
        icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      },
    ],
    []
  );

  const viewerActions = useMemo(
    () => [
      {
        title: t("viewReports"),
        description: t("viewReportsDesc"),
        icon: <FileText className="h-6 w-6" />,
        bgColor: "bg-primary",
        href: "/reports",
      },
      {
        title: t("publicDashboard"),
        description: t("publicDashboardDesc"),
        icon: <BarChart3 className="h-6 w-6" />,
        bgColor: "bg-secondary",
        href: "/public-dashboard",
      },
      {
        title: t("documentation"),
        description: t("documentationDesc"),
        icon: <BookOpen className="h-6 w-6" />,
        bgColor: "bg-accent",
        href: "/docs",
      },
      {
        title: t("configuration"),
        description: t("configurationDesc"),
        icon: <Settings className="h-6 w-6" />,
        bgColor: "bg-muted",
        href: "/settings",
      },
    ],
    []
  );

  const recentActivity = useMemo(
    () => [
      {
        id: 1,
        type: "report_viewed",
        message: "Viste el reporte 'Resumen de Mercados'",
        time: "Hace 30 minutos",
        icon: <FileText className="h-4 w-4 text-primary" />,
      },
      {
        id: 2,
        type: "data_exported",
        message: "Exportaste datos de usuarios",
        time: "Hace 2 horas",
        icon: <DollarSign className="h-4 w-4 text-secondary" />,
      },
      {
        id: 3,
        type: "dashboard_accessed",
        message: "Accediste al dashboard público",
        time: "Hace 4 horas",
        icon: <BarChart3 className="h-4 w-4 text-accent-foreground" />,
      },
      {
        id: 4,
        type: "settings_updated",
        message: "Actualizaste tus preferencias",
        time: "Ayer",
        icon: <Settings className="h-4 w-4 text-muted-foreground" />,
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Viewer Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("viewerDashboard")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 mr-8">
            {t("viewerWelcome", { name: user?.name || "Usuario" })}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {t("viewer")}
          </span>
        </div>
      </div>

      {/* Viewer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-md transition-all">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                {t("totalViews")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {viewerStats.totalViews}
              </p>
              <p className="text-xs text-primary mt-1">+12 esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border hover:border-secondary/20 hover:shadow-md transition-all">
          <div className="flex items-center">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <FileText className="h-5 w-5 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                {t("reportsViewed")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {viewerStats.reportsViewed}
              </p>
              <p className="text-xs text-secondary mt-1">Último: hace 1 hora</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-md transition-all">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                {t("dataPoints")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {viewerStats.dataPoints.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Disponibles para análisis
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-md transition-all">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">
                {t("lastAccess")}
              </p>
              <p className="text-xl font-bold text-foreground">
                {viewerStats.lastLogin}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sesión activa
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Viewer Actions */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-base font-semibold text-foreground mb-4">
              {t("availableActions")}
            </h3>
            <div className="space-y-3">
              {viewerActions.map((action) => (
                <button
                  key={action.href}
                  type="button"
                  onClick={() => router.push(action.href)}
                  className="w-full flex items-center p-3 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/20 transition-all"
                >
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <div className="text-primary">{action.icon}</div>
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {action.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tenant Information */}
          {user?.tenantId && <TenantInfo />}
        </div>

        {/* Available Reports */}
        <div className="xl:col-span-3">
          <div className="bg-card rounded-xl p-6 border border-border">
            <h3 className="text-base font-semibold text-foreground mb-4">
              {t("availableReports")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableReports.map((report) => (
                <button
                  key={report.id}
                  type="button"
                  className="w-full flex items-start justify-between p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/20 cursor-pointer text-left transition-all"
                  onClick={() => router.push(`/reports/${report.id}`)}
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      {report.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm mb-1">
                        {report.title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {report.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("lastUpdated")} {report.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 ml-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-secondary/30 text-secondary"
                    >
                      {report.type}
                    </Badge>
                    <Eye className="h-4 w-4 text-secondary/70" />
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-secondary/20">
              <button
                type="button"
                className="text-sm text-secondary hover:text-secondary/80 font-medium"
              >
                {t("viewAllReports")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <h3 className="text-base font-semibold text-foreground mb-4">
            {t("recentActivity")}
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg flex-shrink-0 mt-0.5">
                  <div className="text-primary">{activity.icon}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-secondary/20">
            <button
              type="button"
              className="text-sm text-secondary hover:text-secondary/80 font-medium"
            >
              {t("viewAllActivity")}
            </button>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div>
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {t("accountStatusTitle2")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("viewerAccount")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {t("accountType")}
              </p>
              <p className="text-sm font-medium text-primary">{t("viewer")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
