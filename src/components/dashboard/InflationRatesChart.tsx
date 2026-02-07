"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useFredSeries } from "@/hooks/use-fred-series";
import { formatDate, getStartDate } from "@/lib/utils";
import type { TimeRange } from "@/lib/types";

interface InflationRatesChartProps {
  timeRange: TimeRange;
}

export default function InflationRatesChart({
  timeRange,
}: InflationRatesChartProps) {
  const startDate = getStartDate(timeRange);
  const { data: cpiData, isLoading } = useFredSeries("CPIAUCSL", startDate, 200);
  const { data: fedFundsData } = useFredSeries("FEDFUNDS", startDate, 200);
  const { data: pceData } = useFredSeries("PCEPILFE", startDate, 200);

  if (isLoading) {
    return (
      <div className="card p-5">
        <div className="skeleton mb-4 h-4 w-36" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  // Compute YoY % change for CPI
  const cpiSorted = [...(cpiData ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const cpiYoY = cpiSorted
    .map((d, i) => {
      if (i < 12) return null;
      const yearAgo = cpiSorted[i - 12];
      return {
        date: d.date.substring(0, 7),
        cpiYoY: ((d.value - yearAgo.value) / yearAgo.value) * 100,
      };
    })
    .filter(Boolean) as { date: string; cpiYoY: number }[];

  // Build merged chart data
  const dateMap = new Map<string, { cpiYoY?: number; fedFunds?: number; pce?: number }>();
  cpiYoY.forEach((d) => dateMap.set(d.date, { cpiYoY: d.cpiYoY }));

  // Compute YoY for PCE
  const pceSorted = [...(pceData ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  pceSorted.forEach((d, i) => {
    if (i < 12) return;
    const yearAgo = pceSorted[i - 12];
    const key = d.date.substring(0, 7);
    const existing = dateMap.get(key) ?? {};
    dateMap.set(key, {
      ...existing,
      pce: ((d.value - yearAgo.value) / yearAgo.value) * 100,
    });
  });

  const ffSorted = [...(fedFundsData ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  ffSorted.forEach((d) => {
    const key = d.date.substring(0, 7);
    const existing = dateMap.get(key) ?? {};
    dateMap.set(key, { ...existing, fedFunds: d.value });
  });

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals }));

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-secondary">
          Inflation vs Interest Rates
        </h3>
        <p className="mt-0.5 text-xs text-text-muted">
          CPI YoY (red) &middot; Core PCE YoY (orange) &middot; Fed Funds (purple)
        </p>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border-secondary)" }}
              tickLine={false}
              tickFormatter={(v) => formatDate(v + "-01", true)}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--text-primary)",
              }}
              labelFormatter={(v) => formatDate(v + "-01")}
              formatter={(value, name) => {
                const labels: Record<string, string> = {
                  cpiYoY: "CPI YoY",
                  fedFunds: "Fed Funds",
                  pce: "Core PCE YoY",
                };
                return [`${Number(value).toFixed(2)}%`, labels[String(name)] ?? name];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: "var(--text-muted)" }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  cpiYoY: "CPI YoY",
                  fedFunds: "Fed Funds Rate",
                  pce: "Core PCE YoY",
                };
                return labels[value] ?? value;
              }}
            />
            <Line
              type="monotone"
              dataKey="cpiYoY"
              stroke="var(--chart-6)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="pce"
              stroke="var(--chart-5)"
              strokeWidth={1.5}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="fedFunds"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
