"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const body = JSON.stringify({
      path: pathname,
      referrer:
        typeof document !== "undefined" ? document.referrer.slice(0, 500) : "",
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : "",
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/pageview", blob);
      return;
    }

    void fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
