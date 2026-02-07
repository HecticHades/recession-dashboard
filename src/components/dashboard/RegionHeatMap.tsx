"use client";

import type { RegionRisk } from "@/lib/types";
import type { RegionalScore } from "@/hooks/use-regional-scores";
import { getRiskLevel } from "@/lib/utils";

interface RegionHeatMapProps {
  usRiskScore: number;
  regionalScores: RegionalScore[];
}

const REGION_META: { region: string; regionCode: string }[] = [
  { region: "United States", regionCode: "US" },
  { region: "Eurozone", regionCode: "EU" },
  { region: "United Kingdom", regionCode: "UK" },
  { region: "China", regionCode: "CN" },
  { region: "Japan", regionCode: "JP" },
  { region: "Emerging Markets", regionCode: "EM" },
];

export default function RegionHeatMap({ usRiskScore, regionalScores }: RegionHeatMapProps) {
  const regions: RegionRisk[] = REGION_META.map((meta) => {
    if (meta.regionCode === "US") {
      return {
        ...meta,
        riskScore: usRiskScore,
        available: true,
        indicators: 20,
      };
    }

    const regional = regionalScores.find((r) => r.regionCode === meta.regionCode);
    if (regional && regional.indicators > 0) {
      return {
        ...meta,
        riskScore: regional.score,
        available: true,
        indicators: regional.indicators,
      };
    }

    return {
      ...meta,
      riskScore: 0,
      available: false,
      indicators: 0,
    };
  });

  const anyLoading = regionalScores.some((r) => r.isLoading);

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h3
          className="text-sm font-medium tracking-tight text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Regional Risk Overview
        </h3>
        <p className="mt-0.5 text-[11px] text-text-muted">
          Recession risk by major economy
        </p>
      </div>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => {
          const { color } = region.available
            ? getRiskLevel(region.riskScore)
            : { color: "var(--text-muted)" };

          const isRegionLoading = anyLoading && region.regionCode !== "US" && !region.available;

          return (
            <div
              key={region.regionCode}
              className="flex items-center gap-3 rounded-xl border border-border-secondary bg-bg-secondary/40 p-3 transition-colors hover:bg-bg-secondary/70"
            >
              <div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tracking-wide"
                style={{
                  backgroundColor: region.available ? `${color}10` : "var(--bg-tertiary)",
                  color: region.available ? color : "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {region.regionCode}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-text-primary">
                  {region.region}
                </p>
                {isRegionLoading ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="skeleton h-1 flex-1 rounded-full" />
                  </div>
                ) : region.available ? (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${region.riskScore}%`,
                          backgroundColor: color,
                          boxShadow: `0 0 6px ${color}30`,
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}
                    >
                      {Math.round(region.riskScore)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] tracking-wide text-text-muted">
                    NO DATA
                  </p>
                )}
                {region.available && region.regionCode !== "US" && (
                  <p className="mt-0.5 text-[9px] tracking-wide text-text-muted">
                    {region.indicators} indicators
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
