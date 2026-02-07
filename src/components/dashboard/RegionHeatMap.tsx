"use client";

import type { RegionRisk } from "@/lib/types";
import { getRiskLevel } from "@/lib/utils";

interface RegionHeatMapProps {
  usRiskScore: number;
}

const REGIONS: RegionRisk[] = [
  { region: "United States", regionCode: "US", riskScore: 0, available: true, indicators: 20 },
  { region: "Eurozone", regionCode: "EU", riskScore: 0, available: false, indicators: 0 },
  { region: "United Kingdom", regionCode: "UK", riskScore: 0, available: false, indicators: 0 },
  { region: "China", regionCode: "CN", riskScore: 0, available: false, indicators: 0 },
  { region: "Japan", regionCode: "JP", riskScore: 0, available: false, indicators: 0 },
  { region: "Emerging Markets", regionCode: "EM", riskScore: 0, available: false, indicators: 0 },
];

export default function RegionHeatMap({ usRiskScore }: RegionHeatMapProps) {
  const regions = REGIONS.map((r) =>
    r.regionCode === "US" ? { ...r, riskScore: usRiskScore } : r
  );

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Regional Risk Overview
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          Recession risk by major economy
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((region) => {
          const { color } = region.available
            ? getRiskLevel(region.riskScore)
            : { color: "var(--text-muted)" };

          return (
            <div
              key={region.regionCode}
              className="flex items-center gap-3 rounded-lg bg-bg-secondary p-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-bg-tertiary text-xs font-bold text-text-muted">
                {region.regionCode}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-text-primary">
                  {region.region}
                </p>
                {region.available ? (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${region.riskScore}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color }}
                    >
                      {Math.round(region.riskScore)}
                    </span>
                  </div>
                ) : (
                  <p className="mt-1 text-[10px] italic text-text-muted">
                    Coming soon
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
