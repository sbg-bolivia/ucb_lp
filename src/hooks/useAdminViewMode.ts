"use client";

import { useCallback, useEffect, useState } from "react";

export type AdminViewMode = "list" | "cards";

export function useAdminViewMode(sectionKey: string, defaultMode: AdminViewMode = "list") {
  const storageKey = `admin-view:${sectionKey}`;

  const [mode, setModeState] = useState<AdminViewMode>(defaultMode);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "list" || stored === "cards") {
        setModeState(stored);
      }
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const setMode = useCallback(
    (next: AdminViewMode) => {
      setModeState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  return { mode, setMode };
}
