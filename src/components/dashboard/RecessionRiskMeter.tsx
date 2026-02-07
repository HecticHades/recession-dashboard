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
          <div className="skeleton h-40 w-40 rounded-full" />
        </div>
      </div>
    );
  }

  const { label, color } = getRiskLevel(score.overall);

  // SVG gauge arc parameters
  const radius = 65;
  const circumference = Math.PI * radius; // Half-circle
  const progress = (score.overall / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div className="card p-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text-secondary">
            Recession Probability
          </h3>
          <p className="mt-0.5 text-xs text-text-muted">
            Composite score from {score.signals.length} indicators
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {label}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width="180" height="110" viewBox="0 0 180 110">
            {/* Background arc */}
            <path
              d="M 15 100 A 65 65 0 0 1 165 100"
              fill="none"
              stroke="var(--border-secondary)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Colored progress arc */}
            <path
              d="M 15 100 A 65 65 0 0 1 165 100"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1s ease-out, stroke 0.3s",
              }}
            />
            {/* Center text */}
            <text
              x="90"
              y="80"
              textAnchor="middle"
              fill={color}
              fontSize="32"
              fontWeight="700"
            >
              {Math.round(score.overall)}
            </text>
            <text
              x="90"
              y="98"
              textAnchor="middle"
              fill="var(--text-muted)"
              fontSize="11"
            >
              out of 100
            </text>
          </svg>
        </div>

        {/* Category breakdown */}
        <div className="mt-4 grid w-full grid-cols-2 gap-x-6 gap-y-2">
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
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{label}</span>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-bg-tertiary">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${catScore}%`,
                        backgroundColor: catRisk.color,
                      }}
                    />
                  </div>
                  <span
                    className="w-8 text-right text-xs font-medium"
                    style={{ color: catRisk.color }}
                  >
                    {Math.round(catScore)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confidence */}
        <div className="mt-3 text-center text-xs text-text-muted">
          Confidence: {Math.round(score.confidence)}%
        </div>
      </div>
    </div>
  );
}
