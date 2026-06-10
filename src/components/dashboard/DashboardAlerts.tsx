"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/utils/trpc";
import { AlertTriangle, Calendar, ImageIcon } from "lucide-react";
import Link from "next/link";

function formatWhen(value: Date | string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-BO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function DashboardAlerts() {
  const { data } = trpc.dashboardStats.getAlerts.useQuery();

  if (!data) return null;

  const hasAlerts =
    data.upcomingEvents.length > 0 ||
    data.expiringBanners.length > 0 ||
    data.draftEvents > 0;

  if (!hasAlerts) return null;

  return (
    <Card className="rounded-2xl border-amber-500/25 bg-amber-500/5">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          Avisos del panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {data.draftEvents > 0 ? (
          <p>
            <Badge variant="secondary" className="mr-2">
              {data.draftEvents}
            </Badge>
            evento{data.draftEvents === 1 ? "" : "s"} en borrador.{" "}
            <Link
              href="/dashboard/club-eventos"
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Revisar
            </Link>
          </p>
        ) : null}

        {data.upcomingEvents.length > 0 ? (
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5" />
              Eventos en las próximas 48 h
            </p>
            <ul className="space-y-1.5 text-muted-foreground">
              {data.upcomingEvents.map((ev) => (
                <li key={ev.id}>
                  <Link
                    href="/dashboard/club-eventos"
                    className="hover:text-foreground"
                  >
                    {ev.title}
                  </Link>{" "}
                  · {formatWhen(ev.startsAt)}
                  {!ev.isPublished ? (
                    <Badge variant="outline" className="ml-2 text-xs">
                      borrador
                    </Badge>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.expiringBanners.length > 0 ? (
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-medium">
              <ImageIcon className="h-3.5 w-3.5" />
              Banners que expiran pronto
            </p>
            <ul className="space-y-1.5 text-muted-foreground">
              {data.expiringBanners.map((b) => (
                <li key={b.id}>
                  <Link
                    href="/dashboard/club-banners"
                    className="hover:text-foreground"
                  >
                    {b.title ?? "Sin título"}
                  </Link>{" "}
                  · hasta {formatWhen(b.endsAt)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
