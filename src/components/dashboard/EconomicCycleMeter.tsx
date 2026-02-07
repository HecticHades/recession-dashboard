"use client";

import type { CyclePosition, CyclePhase } from "@/lib/types";

interface EconomicCycleMeterProps {
  position: CyclePosition | null;
  isLoading: boolean;
}

const PHASES: { phase: CyclePhase; label: string; color: string }[] = [
  { phase: "expansion", label: "Expansion", color: "var(--phase-expansion)" },
  { phase: "peak", label: "Peak", color: "var(--phase-peak)" },
  { phase: "contraction", label: "Contraction", color: "var(--phase-contraction)" },
  { phase: "trough", label: "Trough", color: "var(--phase-trough)" },
];

const directionIcons: Record<string, string> = {
  accelerating: "\u2192",
  decelerating: "\u2190",
  stable: "\u2022",
};

export default function EconomicCycleMeter({
  position,
  isLoading,
}: EconomicCycleMeterProps) {
  if (isLoading || !position) {
    return (
      <div className="card p-6">
        <div className="skeleton mb-4 h-4 w-36" />
        <div className="skeleton h-36 w-full" />
      </div>
    );
  }

  const currentIdx = PHASES.findIndex((p) => p.phase === position.phase);
  const currentPhase = PHASES[currentIdx];

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-medium tracking-tight text-text-secondary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Economic Cycle Position
          </h3>
          <p className="mt-0.5 text-[11px] text-text-muted">
            Phase detection via leading/coincident divergence
          </p>
        </div>
        <span
          className="badge badge-risk"
          style={{
            backgroundColor: `${currentPhase.color}12`,
            color: currentPhase.color,
            borderColor: `${currentPhase.color}25`,
          }}
        >
          {position.conviction}% conviction
        </span>
      </div>

      {/* Phase track — circular dots connected by line */}
      <div className="relative mb-8">
        {/* Connection line */}
        <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-bg-tertiary" />

        <div className="relative flex justify-between">
          {PHASES.map((p, i) => {
            const isActive = i === currentIdx;
            return (
              <div key={p.phase} className="flex flex-col items-center gap-2">
                {/* Phase dot */}
                <div className="relative">
                  <div
                    className="h-[22px] w-[22px] rounded-full border-2 transition-all duration-500"
                    style={{
                      borderColor: isActive ? p.color : "var(--border-primary)",
                      backgroundColor: isActive ? p.color : "var(--bg-secondary)",
                      boxShadow: isActive ? `0 0 16px ${p.color}50, 0 0 4px ${p.color}30` : "none",
                    }}
                  />
                  {/* Pulse ring on active */}
                  {isActive && (
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        border: `2px solid ${p.color}`,
                        animation: "live-pulse 2s ease-in-out infinite",
                      }}
                    />
                  )}
                </div>

                {/* Phase label */}
                <span
                  className="text-[10px] font-semibold tracking-wide"
                  style={{
                    color: isActive ? p.color : "var(--text-muted)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {p.label.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Composite signals — refined layout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-border-secondary bg-bg-secondary/50 p-4">
          <p className="text-[10px] tracking-wide text-text-muted">LEADING COMPOSITE</p>
          <p
            className="mt-2 text-xl font-semibold"
            style={{
              color: position.leadingComposite > 0 ? "var(--color-success)" : "var(--color-danger)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {position.leadingComposite > 0 ? "+" : ""}
            {position.leadingComposite.toFixed(3)}
          </p>
        </div>
        <div className="rounded-xl border border-border-secondary bg-bg-secondary/50 p-4">
          <p className="text-[10px] tracking-wide text-text-muted">COINCIDENT COMPOSITE</p>
          <p
            className="mt-2 text-xl font-semibold"
            style={{
              color: position.coincidentComposite > 0 ? "var(--color-success)" : "var(--color-danger)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {position.coincidentComposite > 0 ? "+" : ""}
            {position.coincidentComposite.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-text-muted">
        <span className="tracking-wide">Direction</span>
        <span
          className="font-semibold capitalize tracking-wide"
          style={{
            color: currentPhase.color,
            fontFamily: "var(--font-mono)",
          }}
        >
          {position.direction} {directionIcons[position.direction]}
        </span>
      </div>
    </div>
  );
}
