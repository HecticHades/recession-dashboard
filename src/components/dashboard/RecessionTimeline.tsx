"use client";

import type { RecessionPeriod } from "@/lib/types";

/** NBER-defined US recession periods (post-1970) */
const NBER_RECESSIONS: RecessionPeriod[] = [
  { start: "1973-11-01", end: "1975-03-01", name: "Oil Crisis" },
  { start: "1980-01-01", end: "1980-07-01", name: "1980" },
  { start: "1981-07-01", end: "1982-11-01", name: "Volcker" },
  { start: "1990-07-01", end: "1991-03-01", name: "Gulf War" },
  { start: "2001-03-01", end: "2001-11-01", name: "Dot-com" },
  { start: "2007-12-01", end: "2009-06-01", name: "Great Recession" },
  { start: "2020-02-01", end: "2020-04-01", name: "COVID-19" },
];

interface RecessionTimelineProps {
  currentRiskScore: number;
}

export default function RecessionTimeline({
  currentRiskScore,
}: RecessionTimelineProps) {
  const now = new Date();
  const timelineStart = new Date("1970-01-01");
  const totalMs = now.getTime() - timelineStart.getTime();

  function dateToPercent(dateStr: string): number {
    const d = new Date(dateStr);
    return ((d.getTime() - timelineStart.getTime()) / totalMs) * 100;
  }

  const avgDuration = Math.round(
    NBER_RECESSIONS.reduce((sum, r) => {
      const months =
        (new Date(r.end).getTime() - new Date(r.start).getTime()) /
        (30.44 * 24 * 60 * 60 * 1000);
      return sum + months;
    }, 0) / NBER_RECESSIONS.length
  );

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-medium tracking-tight text-text-secondary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Historical Recession Timeline
          </h3>
          <p className="mt-0.5 text-[11px] text-text-muted">
            NBER-defined US recessions since 1970
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-text-muted">
          <span
            className="inline-block h-3 w-5 rounded-sm"
            style={{ backgroundColor: "rgba(255, 59, 92, 0.25)" }}
          />
          Recession
        </div>
      </div>

      {/* Timeline bar */}
      <div className="relative h-14 rounded-xl bg-bg-secondary/50">
        {NBER_RECESSIONS.map((recession) => {
          const left = dateToPercent(recession.start);
          const right = dateToPercent(recession.end);
          const width = right - left;

          return (
            <div
              key={recession.name}
              className="group absolute top-0 h-full cursor-default transition-colors"
              style={{
                left: `${left}%`,
                width: `${Math.max(width, 0.5)}%`,
                backgroundColor: "rgba(255, 59, 92, 0.15)",
                borderLeft: "1px solid rgba(255, 59, 92, 0.3)",
                borderRight: "1px solid rgba(255, 59, 92, 0.3)",
              }}
            >
              <div
                className="absolute -top-9 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-border-secondary px-3 py-1.5 text-[10px] shadow-xl group-hover:block"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {recession.name} ({recession.start.substring(0, 4)}&ndash;{recession.end.substring(0, 4)})
              </div>
            </div>
          );
        })}

        {/* "Now" marker */}
        <div
          className="absolute right-0 top-0 h-full w-[2px]"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <div
            className="absolute -top-5 right-0 text-[10px] font-semibold tracking-wide"
            style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }}
          >
            NOW
          </div>
        </div>

        {/* Decade labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1">
          {["1970", "1980", "1990", "2000", "2010", "2020"].map((decade) => (
            <span
              key={decade}
              className="text-[9px] text-text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {decade}
            </span>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-5 flex items-center justify-between text-[11px] text-text-muted">
        <span style={{ fontFamily: "var(--font-mono)" }}>
          {NBER_RECESSIONS.length} recessions since 1970
        </span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          Avg. duration: {avgDuration} months
        </span>
        <span style={{ fontFamily: "var(--font-mono)" }}>
          Current risk:{" "}
          <span
            className="font-semibold"
            style={{
              color:
                currentRiskScore > 60
                  ? "var(--color-danger)"
                  : currentRiskScore > 30
                    ? "var(--color-warning)"
                    : "var(--color-success)",
            }}
          >
            {Math.round(currentRiskScore)}%
          </span>
        </span>
      </div>
    </div>
  );
}
