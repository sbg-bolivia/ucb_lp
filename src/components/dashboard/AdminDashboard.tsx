"use client";

import { AdminPageHeader } from "@/components/dashboard/AdminPageHeader";
import { DashboardAlerts } from "@/components/dashboard/DashboardAlerts";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { getAdminNavGroups } from "@/lib/admin-nav-sections";
import { trpc } from "@/utils/trpc";
import { Eye, ExternalLink, Shield } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import TenantInfo from "./TenantInfo";

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    tenantId?: string;
  } | null;
}

function QuickLinkCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-border/70 bg-card p-5 transition-all hover:border-[#7E2CFF]/30 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-gradient-to-br from-[#7E2CFF]/15 to-[#00C8FF]/15 p-2.5">
          <Icon className="h-5 w-5 text-[#7E2CFF] dark:text-[#00C8FF]" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground group-hover:text-primary">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <span className="mt-4 text-xs font-medium text-primary">Abrir →</span>
    </Link>
  );
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const { t } = useTranslation("dashboard");
  const { data: stats } = trpc.dashboardStats.getOverview.useQuery(undefined, {
    enabled: Boolean(user?.tenantId),
  });

  const navGroups = getAdminNavGroups({
    users: t("users"),
    usersDescription: t("usersDescription"),
    rolesPermissions: t("rolesPermissions"),
    rolesDescription: t("rolesDescription"),
    clubPublicTeam: t("clubPublicTeam"),
    clubPublicTeamDesc: t("clubPublicTeamDesc"),
    clubEventsAdmin: t("clubEventsAdmin"),
    clubEventsAdminDesc: t("clubEventsAdminDesc"),
    clubServicesAdmin: t("clubServicesAdmin"),
    clubServicesAdminDesc: t("clubServicesAdminDesc"),
    clubCommunitiesAdmin: t("clubCommunitiesAdmin"),
    clubCommunitiesAdminDesc: t("clubCommunitiesAdminDesc"),
    clubProjectsAdmin: t("clubProjectsAdmin"),
    clubProjectsAdminDesc: t("clubProjectsAdminDesc"),
    settings2: t("settings2"),
    systemSettings: t("systemSettings"),
  });

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={Shield}
        title={t("adminPanel")}
        description={t("adminWelcome", {
          name: user?.name || "Administrador",
        })}
        actions={
          <Badge className="bg-gradient-to-r from-[#7E2CFF]/20 to-[#00C8FF]/20 text-foreground">
            {t("superAdmin")}
          </Badge>
        }
      />

      <DashboardAlerts />

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/dashboard/estadisticas"
            className="rounded-2xl border border-border/70 bg-card p-5 transition-colors hover:border-[#7E2CFF]/30 hover:bg-primary/5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Visitas 7 días
                </p>
                <p className="mt-1 text-2xl font-bold">{stats.traffic.views7d}</p>
              </div>
              <Eye className="h-5 w-5 text-[#00C8FF]" />
            </div>
          </Link>
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Usuarios
            </p>
            <p className="mt-1 text-2xl font-bold">{stats.content.users}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Eventos publicados
            </p>
            <p className="mt-1 text-2xl font-bold">
              {stats.content.eventsPublished}
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Visitas 30 días
            </p>
            <p className="mt-1 text-2xl font-bold">{stats.traffic.views30d}</p>
          </div>
        </div>
      ) : null}

      {navGroups.map((group) => (
        <section key={group.id} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <QuickLinkCard
                key={item.href}
                title={item.title}
                description={item.description}
                href={item.href}
                icon={item.icon}
              />
            ))}
          </div>
        </section>
      ))}

      {user?.tenantId ? (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Resumen del tenant
          </h2>
          <TenantInfo />
        </section>
      ) : null}
    </div>
  );
}
