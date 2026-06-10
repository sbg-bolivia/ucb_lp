import { isClubFeatureEnabled } from "@/lib/club-features";

export type DashboardSearchRoute = {
  title: string;
  href: string;
  group: string;
  keywords?: string[];
};

export function getDashboardSearchRoutes(): DashboardSearchRoute[] {
  const routes: DashboardSearchRoute[] = [
    {
      title: "Panel principal",
      href: "/dashboard",
      group: "General",
      keywords: ["inicio", "home"],
    },
    {
      title: "Usuarios",
      href: "/dashboard/users",
      group: "Administración",
      keywords: ["users", "cuentas"],
    },
    {
      title: "Roles y permisos",
      href: "/dashboard/roles",
      group: "Administración",
      keywords: ["rbac", "permisos"],
    },
    {
      title: "Estadísticas",
      href: "/dashboard/estadisticas",
      group: "Administración",
      keywords: ["analytics", "visitas", "métricas"],
    },
    {
      title: "Equipo público",
      href: "/dashboard/club-equipo",
      group: "Contenido",
      keywords: ["team", "miembros"],
    },
    {
      title: "Eventos",
      href: "/dashboard/club-eventos",
      group: "Contenido",
      keywords: ["calendar", "talleres"],
    },
    {
      title: "Banners del home",
      href: "/dashboard/club-banners",
      group: "Contenido",
      keywords: ["hero", "promo", "carrusel"],
    },
    {
      title: "Configuración",
      href: "/dashboard/settings",
      group: "Configuración",
      keywords: ["settings", "logo", "seo"],
    },
  ];

  if (isClubFeatureEnabled("awsServices")) {
    routes.push({
      title: "Servicios AWS",
      href: "/dashboard/club-servicios",
      group: "Contenido",
      keywords: ["s3", "ec2", "cloud"],
    });
  }

  if (isClubFeatureEnabled("awsCommunitiesMap")) {
    routes.push({
      title: "Comunidades AWS",
      href: "/dashboard/club-comunidades",
      group: "Contenido",
      keywords: ["mapa", "universidades"],
    });
  }

  if (isClubFeatureEnabled("projects")) {
    routes.push({
      title: "Proyectos",
      href: "/dashboard/club-proyectos",
      group: "Contenido",
      keywords: ["portfolio"],
    });
  }

  return routes;
}

export function filterDashboardRoutes(
  query: string,
  routes: DashboardSearchRoute[]
): DashboardSearchRoute[] {
  const q = query.trim().toLowerCase();
  if (!q) return routes.slice(0, 8);

  return routes
    .filter((route) => {
      const haystack = [
        route.title,
        route.group,
        route.href,
        ...(route.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 8);
}
