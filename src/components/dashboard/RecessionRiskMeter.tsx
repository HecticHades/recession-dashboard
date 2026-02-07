"use client";

import { getRiskLevel } from "@/lib/utils";
import type { RecessionScore } from "@/lib/types";

interface RecessionRiskMeterProps {
  score: RecessionScore | null;
  isLoading: boolean;
}

export default function RecessionRiskMeter({
  score,
  isLoading,
}: RecessionRiskMeterProps) {
  if (isLoading || !score) {
    return (
      <div className="card p-6">
        <div className="skeleton mb-4 h-4 w-36" />
        <div className="flex items-center justify-center">
          <div className="skeleton h-44 w-44 rounded-full" />
        </div>
      </div>
    );
  }

  const { label, color } = getRiskLevel(score.overall);

  // SVG gauge arc parameters — full semi-circle
  const radius = 70;
  const circumference = Math.PI * radius;
  const progress = (score.overall / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-medium tracking-tight text-text-secondary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recession Probability
          </h3>
          <p className="mt-0.5 text-[11px] text-text-muted">
            Composite score from {score.signals.length} indicators
          </p>
        </div>
        <span
          className="badge badge-risk"
          style={{
            backgroundColor: `${color}12`,
            color,
            borderColor: `${color}25`,
          }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Outer decorative ring */}
            <path
              d="M 12 108 A 76 76 0 0 1 188 108"
              fill="none"
              stroke="var(--border-secondary)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            {/* Background arc */}
            <path
              d="M 18 108 A 70 70 0 0 1 182 108"
              fill="none"
              stroke="var(--bg-tertiary)"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Colored progress arc with glow */}
            <path
              d="M 18 108 A 70 70 0 0 1 182 108"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1), stroke 0.3s",
                filter: `drop-shadow(0 0 6px ${color}60)`,
              }}
            />

            {/* Inner subtle arc */}
            <path
              d="M 30 108 A 58 58 0 0 1 170 108"
              fill="none"
              stroke="var(--border-secondary)"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Center score */}
            <text
              x="100"
              y="82"
              textAnchor="middle"
              fill={color}
              fontSize="38"
              fontWeight="700"
              style={{
                fontFamily: "var(--font-mono)",
                filter: `drop-shadow(0 0 8px ${color}40)`,
              }}
            >
              {Math.round(score.overall)}
            </text>
            <text
              x="100"
              y="104"
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="10"
              style={{ fontFamily: "var(--font-sans)" }}
              letterSpacing="0.1em"
            >
              OUT OF 100
            </text>
          </svg>
        </div>

        {/* Category breakdown — refined bars */}
        <div className="mt-5 grid w-full grid-cols-2 gap-x-8 gap-y-3">
          {(
            [
              ["leading", "Leading"],
              ["coincident", "Coincident"],
              ["financial_stress", "Fin. Stress"],
              ["lagging", "Lagging"],
            ] as const
          ).map(([key, label]) => {
            const catScore = score.byCategory[key];
            const catRisk = getRiskLevel(catScore);
            return (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-text-muted">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-14 overflow-hidden rounded-full bg-bg-tertiary">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${catScore}%`,
                        backgroundColor: catRisk.color,
                        boxShadow: `0 0 4px ${catRisk.color}40`,
                      }}
                    />
                  </div>
                  <span
                    className="w-7 text-right text-[11px] font-semibold"
                    style={{
                      color: catRisk.color,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {Math.round(catScore)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence */}
        <div
          className="mt-4 text-center text-[10px] tracking-widest text-text-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          CONFIDENCE {Math.round(score.confidence)}%
        </div>
      </div>
    </div>
  );
}
