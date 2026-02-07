"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function DataFreshnessIndicator() {
  const queryClient = useQueryClient();
  const [minutesAgo, setMinutesAgo] = useState<number | null>(null);

  useEffect(() => {
    const check = () => {
      const queries = queryClient.getQueryCache().findAll({ queryKey: ["fred-series"] });
      let latest = 0;
      for (const q of queries) {
        if (q.state.dataUpdatedAt > latest) latest = q.state.dataUpdatedAt;
      }
      if (latest > 0) {
        setMinutesAgo(Math.round((Date.now() - latest) / 60_000));
      }
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [queryClient]);

  if (minutesAgo === null) {
    return (
      <div className="hidden items-center gap-2 rounded-full border border-border-secondary bg-bg-secondary/50 px-4 py-1.5 text-[11px] tracking-wide text-text-muted backdrop-blur-sm sm:flex">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "var(--text-muted)" }} />
        </span>
        LOADING
      </div>
    );
  }

  const color = minutesAgo < 15 ? "var(--color-success)" : minutesAgo < 60 ? "var(--color-warning)" : "var(--color-danger)";
  const label = minutesAgo < 1 ? "JUST NOW" : `${minutesAgo}m AGO`;

  return (
    <div className="hidden items-center gap-2 rounded-full border border-border-secondary bg-bg-secondary/50 px-4 py-1.5 text-[11px] tracking-wide text-text-muted backdrop-blur-sm sm:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: color, animation: "live-pulse 2s ease-in-out infinite" }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      </span>
      <span style={{ fontFamily: "var(--font-mono)" }}>{label}</span>
    </div>
  );
}
