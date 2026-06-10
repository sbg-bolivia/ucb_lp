type StatsExport = {
  traffic: {
    views7d: number;
    views30d: number;
    topPages: Array<{ path: string; views: number }>;
    last7Days: Array<{ date: string; views: number }>;
    sources: Array<{ label: string; count: number }>;
    devices: Array<{ label: string; count: number }>;
  };
  content: {
    users: number;
    eventsPublished: number;
    eventsTotal: number;
    servicesPublished: number;
    communitiesPublished: number;
    projectsPublished: number;
  };
};

function csvEscape(value: string | number) {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function rowsToCsv(rows: Array<Array<string | number>>) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

export function downloadStatsCsv(data: StatsExport) {
  const rows: Array<Array<string | number>> = [
    ["Métrica", "Valor"],
    ["Visitas 7 días", data.traffic.views7d],
    ["Visitas 30 días", data.traffic.views30d],
    ["Usuarios", data.content.users],
    ["Eventos publicados", data.content.eventsPublished],
    ["Eventos totales", data.content.eventsTotal],
    ["Servicios publicados", data.content.servicesPublished],
    ["Comunidades publicadas", data.content.communitiesPublished],
    ["Proyectos publicados", data.content.projectsPublished],
    [],
    ["Fecha", "Visitas"],
    ...data.traffic.last7Days.map((d) => [d.date, d.views]),
    [],
    ["Página", "Visitas"],
    ...data.traffic.topPages.map((p) => [p.path, p.views]),
    [],
    ["Fuente", "Visitas"],
    ...data.traffic.sources.map((s) => [s.label, s.count]),
    [],
    ["Dispositivo", "Visitas"],
    ...data.traffic.devices.map((d) => [d.label, d.count]),
  ];

  const blob = new Blob([rowsToCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `estadisticas-club-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
