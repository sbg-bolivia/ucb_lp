"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-primary/20"
        aria-label="Cambiar tema"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] text-foreground/70" />
      </Button>
    );
  }

  const currentTheme = theme || "light";
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-9 w-9 border-border/40 bg-background/50 relative overflow-hidden"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        } text-foreground/70`}
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] absolute transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        } text-foreground/70`}
      />
      <span className="sr-only">
        {isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      </span>
    </Button>
  );
}
