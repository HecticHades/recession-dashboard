"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { TimeRange } from "@/lib/types";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { getIndicatorsByCategory } from "@/lib/data/series-config";
import { categoryOrder } from "@/lib/utils";
import TimeRangeSelector from "./TimeRangeSelector";
import RecessionRiskMeter from "./RecessionRiskMeter";
import EconomicCycleMeter from "./EconomicCycleMeter";
import IndicatorPanel from "./IndicatorPanel";
import RegionHeatMap from "./RegionHeatMap";

// Dynamic imports for heavy Recharts-based components (bundle-dynamic-imports)
const YieldCurveChart = dynamic(() => import("./YieldCurveChart"), {
  loading: () => (
    <div className="card p-6">
      <div className="skeleton mb-4 h-4 w-32" />
      <div className="skeleton h-52 w-full" />
    </div>
  ),
});

const GdpTrendChart = dynamic(() => import("./GdpTrendChart"), {
  loading: () => (
    <div className="card p-6">
      <div className="skeleton mb-4 h-4 w-28" />
      <div className="skeleton h-56 w-full" />
    </div>
  ),
});

const InflationRatesChart = dynamic(() => import("./InflationRatesChart"), {
  loading: () => (
    <div className="card p-6">
      <div className="skeleton mb-4 h-4 w-36" />
      <div className="skeleton h-56 w-full" />
    </div>
  ),
});

const RecessionTimeline = dynamic(() => import("./RecessionTimeline"), {
  loading: () => (
    <div className="card p-6">
      <div className="skeleton mb-4 h-4 w-44" />
      <div className="skeleton h-14 w-full" />
    </div>
  ),
});

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("2Y");
  const {
    allData,
    recessionScore,
    cyclePosition,
    isLoading,
  } = useDashboardData();

  return (
    <div className="flex flex-col gap-8">
      {/* Top bar: title + time range */}
      <div className="animate-reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            className="text-2xl font-normal tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            US Economy Overview
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Real-time recession risk analysis from 20+ economic indicators
          </p>
        </div>
        <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
      </div>

      {/* Row 1: Risk Meter + Cycle Meter */}
      <div className="animate-reveal stagger-1 grid gap-6 lg:grid-cols-2">
        <RecessionRiskMeter score={recessionScore} isLoading={isLoading} />
        <EconomicCycleMeter position={cyclePosition} isLoading={isLoading} />
      </div>

      {/* Row 2: Yield Curve + GDP */}
      <div className="animate-reveal stagger-2 grid gap-6 lg:grid-cols-2">
        <YieldCurveChart />
        <GdpTrendChart timeRange={timeRange} />
      </div>

      {/* Row 3: Inflation + Regions */}
      <div className="animate-reveal stagger-3 grid gap-6 lg:grid-cols-2">
        <InflationRatesChart timeRange={timeRange} />
        <RegionHeatMap usRiskScore={recessionScore?.overall ?? 0} />
      </div>

      {/* Row 4: Historical Timeline */}
      <div className="animate-reveal stagger-4">
        <RecessionTimeline currentRiskScore={recessionScore?.overall ?? 0} />
      </div>

      {/* Indicator panels by category */}
      {categoryOrder.map((category, i) => {
        const indicators = getIndicatorsByCategory(category);
        if (indicators.length === 0) return null;
        return (
          <div key={category} className={`animate-reveal stagger-${Math.min(i + 5, 8)}`}>
            <IndicatorPanel
              category={category}
              indicators={indicators}
              data={allData}
              isLoading={isLoading}
            />
          </div>
        );
      })}
    </div>
  );
}
