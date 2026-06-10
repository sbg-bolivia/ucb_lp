"use client";

import { Input } from "@/components/ui/input";
import {
  filterDashboardRoutes,
  getDashboardSearchRoutes,
} from "@/lib/dashboard-search-routes";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

export function DashboardGlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const routes = useMemo(() => getDashboardSearchRoutes(), []);
  const results = useMemo(
    () => filterDashboardRoutes(query, routes),
    [query, routes]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={containerRef} className="relative hidden min-w-0 flex-1 sm:block sm:max-w-xs lg:max-w-sm">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar en el panel…"
        className="h-9 pl-9 pr-14 text-sm"
        aria-label="Búsqueda global del dashboard"
        aria-expanded={open}
        aria-controls="dashboard-search-results"
      />
      <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
        Ctrl+K
      </kbd>

      {open && results.length > 0 ? (
        <ul
          id="dashboard-search-results"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-border bg-popover p-1 shadow-lg"
        >
          {results.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex flex-col rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                )}
              >
                <span className="font-medium">{route.title}</span>
                <span className="text-xs text-muted-foreground">
                  {route.group} · {route.href}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && results.length === 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-border bg-popover p-3 text-sm text-muted-foreground shadow-lg">
          Sin resultados. Prueba «eventos», «estadísticas» o «banners».
        </div>
      ) : null}
    </div>
  );
}
