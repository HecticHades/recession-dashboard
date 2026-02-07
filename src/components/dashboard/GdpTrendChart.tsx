"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useFredSeries } from "@/hooks/use-fred-series";
import { formatDate } from "@/lib/utils";
import type { TimeRange } from "@/lib/types";
import { getStartDate } from "@/lib/utils";

interface GdpTrendChartProps {
  timeRange: TimeRange;
}

export default function GdpTrendChart({ timeRange }: GdpTrendChartProps) {
  const startDate = getStartDate(timeRange);
  const { data: gdpData, isLoading } = useFredSeries("GDPC1", startDate, 200);
  const { data: indProdData } = useFredSeries("INDPRO", startDate, 200);

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="skeleton mb-4 h-4 w-28" />
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }

  const gdpSorted = [...(gdpData ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const indSorted = [...(indProdData ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const dateMap = new Map<string, { gdp?: number; indpro?: number }>();
  gdpSorted.forEach((d) => {
    const key = d.date.substring(0, 7);
    dateMap.set(key, { ...dateMap.get(key), gdp: d.value });
  });
  indSorted.forEach((d) => {
    const key = d.date.substring(0, 7);
    dateMap.set(key, { ...dateMap.get(key), indpro: d.value });
  });

  const chartData = Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({
      date,
      gdp: vals.gdp ?? null,
      indpro: vals.indpro ?? null,
    }));

  return (
    <div className="card p-6">
      <div className="mb-5">
        <h3
          className="text-sm font-medium tracking-tight text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          GDP & Industrial Production
        </h3>
        <div className="mt-1 flex items-center gap-4 text-[11px] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-3 rounded" style={{ backgroundColor: "var(--chart-1)" }} />
            Real GDP
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[2px] w-3 rounded" style={{ backgroundColor: "var(--chart-3)" }} />
            Industrial Production
          </span>
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gdpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="indGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--border-secondary)" }}
              tickLine={false}
              tickFormatter={(v) => formatDate(v + "-01", true)}
              interval="preserveStartEnd"
            />
            <YAxis
              yAxisId="gdp"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}T`}
              width={50}
            />
            <YAxis
              yAxisId="indpro"
              orientation="right"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-primary)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
              labelFormatter={(v) => formatDate(v + "-01")}
              formatter={(value, name) => [
                name === "gdp"
                  ? `$${(Number(value) / 1000).toFixed(1)}T`
                  : Number(value).toFixed(1),
                name === "gdp" ? "Real GDP" : "Industrial Prod.",
              ]}
            />
            <Area
              yAxisId="gdp"
              type="monotone"
              dataKey="gdp"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#gdpGrad)"
              connectNulls
            />
            <Area
              yAxisId="indpro"
              type="monotone"
              dataKey="indpro"
              stroke="var(--chart-3)"
              strokeWidth={1.5}
              fill="url(#indGrad)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
