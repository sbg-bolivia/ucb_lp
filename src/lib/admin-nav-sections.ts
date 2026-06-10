import { isClubFeatureEnabled } from "@/lib/club-features";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  Cloud,
  FolderKanban,
  Globe2,
  ImageIcon,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export type AdminNavSection = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  items: AdminNavSection[];
};

type Labels = {
  users: string;
  usersDescription: string;
  rolesPermissions: string;
  rolesDescription: string;
  clubPublicTeam: string;
  clubPublicTeamDesc: string;
  clubEventsAdmin: string;
  clubEventsAdminDesc: string;
  clubServicesAdmin: string;
  clubServicesAdminDesc: string;
  clubCommunitiesAdmin: string;
  clubCommunitiesAdminDesc: string;
  clubProjectsAdmin: string;
  clubProjectsAdminDesc: string;
  settings2: string;
  systemSettings: string;
};

export function getAdminNavGroups(t: Labels): AdminNavGroup[] {
  const contentItems: AdminNavSection[] = [
    {
      title: t.clubPublicTeam,
      description: t.clubPublicTeamDesc,
      href: "/dashboard/club-equipo",
      icon: Users,
    },
    {
      title: t.clubEventsAdmin,
      description: t.clubEventsAdminDesc,
      href: "/dashboard/club-eventos",
      icon: Calendar,
    },
    {
      title: "Banners del home",
      description: "Imágenes promocionales del sitio público",
      href: "/dashboard/club-banners",
      icon: ImageIcon,
    },
  ];

  if (isClubFeatureEnabled("awsServices")) {
    contentItems.push({
      title: t.clubServicesAdmin,
      description: t.clubServicesAdminDesc,
      href: "/dashboard/club-servicios",
      icon: Cloud,
    });
  }

  if (isClubFeatureEnabled("awsCommunitiesMap")) {
    contentItems.push({
      title: t.clubCommunitiesAdmin,
      description: t.clubCommunitiesAdminDesc,
      href: "/dashboard/club-comunidades",
      icon: Globe2,
    });
  }

  if (isClubFeatureEnabled("projects")) {
    contentItems.push({
      title: t.clubProjectsAdmin,
      description: t.clubProjectsAdminDesc,
      href: "/dashboard/club-proyectos",
      icon: FolderKanban,
    });
  }

  return [
    {
      id: "system",
      label: "Administración",
      items: [
        {
          title: t.users,
          description: t.usersDescription,
          href: "/dashboard/users",
          icon: Users,
        },
        {
          title: t.rolesPermissions,
          description: t.rolesDescription,
          href: "/dashboard/roles",
          icon: Shield,
        },
        {
          title: "Estadísticas",
          description: "Visitas y rendimiento del sitio",
          href: "/dashboard/estadisticas",
          icon: BarChart3,
        },
      ],
    },
    {
      id: "content",
      label: "Contenido del sitio",
      items: contentItems,
    },
    {
      id: "settings",
      label: "Configuración",
      items: [
        {
          title: t.settings2,
          description: t.systemSettings,
          href: "/dashboard/settings",
          icon: Settings,
        },
      ],
    },
  ];
}
