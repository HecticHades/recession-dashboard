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

const directionArrows: Record<string, string> = {
  accelerating: "→",
  decelerating: "←",
  stable: "·",
};

export default function EconomicCycleMeter({
  position,
  isLoading,
}: EconomicCycleMeterProps) {
  if (isLoading || !position) {
    return (
      <div className="card p-6">
        <div className="skeleton mb-4 h-4 w-36" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  const currentIdx = PHASES.findIndex((p) => p.phase === position.phase);
  const currentPhase = PHASES[currentIdx];

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary">
            Economic Cycle Position
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">
            Phase detection via leading/coincident divergence
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            backgroundColor: `${currentPhase.color}15`,
            color: currentPhase.color,
          }}
        >
          {position.conviction}% conviction
        </span>
      </div>

      {/* Phase bar */}
      <div className="relative mb-6">
        <div className="flex gap-1">
          {PHASES.map((p, i) => (
            <div
              key={p.phase}
              className="relative flex-1"
            >
              <div
                className="h-3 rounded-sm transition-opacity duration-300"
                style={{
                  backgroundColor: p.color,
                  opacity: i === currentIdx ? 1 : 0.2,
                }}
              />
              <span
                className="mt-1.5 block text-center text-[10px] font-medium"
                style={{
                  color: i === currentIdx ? p.color : "var(--text-muted)",
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>

        {/* Animated position indicator */}
        <div
          className="absolute -top-1.5 h-6 w-6 rounded-full border-2 border-bg-card transition-all duration-700"
          style={{
            left: `${(currentIdx / PHASES.length) * 100 + 100 / (PHASES.length * 2)}%`,
            transform: "translateX(-50%)",
            backgroundColor: currentPhase.color,
            boxShadow: `0 0 12px ${currentPhase.color}60`,
          }}
        />
      </div>

      {/* Composite signals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-bg-secondary p-3">
          <p className="text-xs text-text-muted">Leading Composite</p>
          <p className="mt-1 text-lg font-semibold" style={{
            color: position.leadingComposite > 0 ? "var(--color-success)" : "var(--color-danger)"
          }}>
            {position.leadingComposite > 0 ? "+" : ""}
            {position.leadingComposite.toFixed(3)}
          </p>
        </div>
        <div className="rounded-lg bg-bg-secondary p-3">
          <p className="text-xs text-text-muted">Coincident Composite</p>
          <p className="mt-1 text-lg font-semibold" style={{
            color: position.coincidentComposite > 0 ? "var(--color-success)" : "var(--color-danger)"
          }}>
            {position.coincidentComposite > 0 ? "+" : ""}
            {position.coincidentComposite.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-muted">
        <span>Direction:</span>
        <span className="font-medium capitalize" style={{ color: currentPhase.color }}>
          {position.direction} {directionArrows[position.direction]}
        </span>
      </div>
    </div>
  );
}
