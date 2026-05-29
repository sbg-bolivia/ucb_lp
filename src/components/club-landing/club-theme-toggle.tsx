"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Switch tipo píldora: track violeta (#6a11cb) en oscuro / celeste en claro,
 * thumb blanco con icono sol o luna. Etiquetas con contraste en ambos temas.
 */
export function ClubThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="flex h-9 items-center gap-3 rounded-full border border-sky-200/80 bg-white/70 px-3 dark:border-white/10 dark:bg-zinc-800/50"
        aria-hidden
      >
        <span className="w-10" />
        <span className="h-9 w-[4.25rem] rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <span className="w-12" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-3"
      title={isDark ? "Modo oscuro" : "Modo claro"}
    >
      <span
        className={cn(
          "min-w-[2.75rem] text-sm font-semibold tracking-tight transition-colors",
          !isDark ? "text-[#0c4a6e]" : "text-zinc-400"
        )}
      >
        Claro
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative h-9 w-[4.25rem] shrink-0 rounded-full shadow-inner transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b41ff] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
          isDark ? "bg-[#6a11cb]" : "bg-sky-400"
        )}
      >
        <span
          className={cn(
            "absolute top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-[transform,left] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark ? "left-[calc(100%-1.75rem-0.25rem)]" : "left-1"
          )}
        >
          {isDark ? (
            <Moon
              className="h-4 w-4 text-[#6a11cb]"
              strokeWidth={2}
              aria-hidden
            />
          ) : (
            <Sun className="h-4 w-4 text-sky-600" strokeWidth={2} aria-hidden />
          )}
        </span>
      </button>

      <span
        className={cn(
          "min-w-[3.25rem] text-sm font-semibold tracking-tight transition-colors",
          isDark ? "text-zinc-100" : "text-slate-600 dark:text-zinc-500"
        )}
      >
        Oscuro
      </span>
    </div>
  );
}
