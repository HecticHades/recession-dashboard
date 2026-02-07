"use client";

import { useState } from "react";
import type { TimeRange } from "@/lib/types";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { getIndicatorsByCategory } from "@/lib/data/series-config";
import { categoryOrder } from "@/lib/utils";
import TimeRangeSelector from "./TimeRangeSelector";
import RecessionRiskMeter from "./RecessionRiskMeter";
import EconomicCycleMeter from "./EconomicCycleMeter";
import YieldCurveChart from "./YieldCurveChart";
import GdpTrendChart from "./GdpTrendChart";
import InflationRatesChart from "./InflationRatesChart";
import IndicatorPanel from "./IndicatorPanel";
import RegionHeatMap from "./RegionHeatMap";
import RecessionTimeline from "./RecessionTimeline";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("2Y");
  const {
    allData,
    recessionScore,
    cyclePosition,
    isLoading,
  } = useDashboardData();

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar: title + time range */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-text-primary">
            US Economy Overview
          </h2>
          <p className="text-xs text-text-muted">
            Real-time recession risk analysis from 20+ economic indicators
          </p>
        </div>
        <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
      </div>

      {/* Row 1: Risk Meter + Cycle Meter */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecessionRiskMeter score={recessionScore} isLoading={isLoading} />
        <EconomicCycleMeter position={cyclePosition} isLoading={isLoading} />
      </div>

      {/* Row 2: Yield Curve + GDP */}
      <div className="grid gap-6 lg:grid-cols-2">
        <YieldCurveChart />
        <GdpTrendChart timeRange={timeRange} />
      </div>

      {/* Row 3: Inflation + Regions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <InflationRatesChart timeRange={timeRange} />
        <RegionHeatMap usRiskScore={recessionScore?.overall ?? 0} />
      </div>

      {/* Row 4: Historical Timeline */}
      <RecessionTimeline currentRiskScore={recessionScore?.overall ?? 0} />

      {/* Indicator panels by category */}
      {categoryOrder.map((category) => {
        const indicators = getIndicatorsByCategory(category);
        if (indicators.length === 0) return null;
        return (
          <IndicatorPanel
            key={category}
            category={category}
            indicators={indicators}
            data={allData}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
}
