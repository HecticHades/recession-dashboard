"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getIndicatorConfig } from "@/lib/data/series-config";
import { useFredSeries } from "@/hooks/use-fred-series";
import { useAlphaVantageCommodities } from "@/hooks/use-alpha-vantage";
import { formatValue, formatDate, formatChange, getStartDate, categoryLabels } from "@/lib/utils";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import type { TimeRange, DataPoint } from "@/lib/types";

export default function IndicatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [timeRange, setTimeRange] = useState<TimeRange>("2Y");
  const config = getIndicatorConfig(id);

  const startDate = getStartDate(timeRange);
  const fredQuery = useFredSeries(
    config?.source === "fred" ? config.seriesId : "",
    startDate,
    1000
  );
  const avQuery = useAlphaVantageCommodities();

  if (!config) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6">
        <div className="text-center">
          <h1 className="text-xl font-bold text-text-primary">
            Indicator Not Found
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            No indicator with ID &quot;{id}&quot; exists.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-chart-1 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isLoading =
    config.source === "fred" ? fredQuery.isLoading : avQuery.isLoading;

  let rawData: DataPoint[] = [];
  if (config.source === "fred") {
    rawData = fredQuery.data ?? [];
  } else if (avQuery.data) {
    rawData = avQuery.data[config.seriesId] ?? [];
  }

  const sorted = [...rawData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const current = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;
  const change =
    current && previous && previous.value !== 0
      ? ((current.value - previous.value) / Math.abs(previous.value)) * 100
      : null;
  const { text: changeText, color: changeColor, arrow } = formatChange(change);

  // Stats
  const values = sorted.map((d) => d.value);
  const min = values.length > 0 ? Math.min(...values) : null;
  const max = values.length > 0 ? Math.max(...values) : null;
  const avg =
    values.length > 0
      ? values.reduce((s, v) => s + v, 0) / values.length
      : null;

  const chartData = sorted.map((d) => ({
    date: d.date,
    value: d.value,
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-bg-tertiary px-2 py-0.5 text-[10px] font-medium uppercase text-text-muted">
              {categoryLabels[config.category]}
            </span>
            <span className="rounded bg-bg-tertiary px-2 py-0.5 text-[10px] font-medium uppercase text-text-muted">
              {config.source === "fred" ? "FRED" : "Alpha Vantage"}
            </span>
          </div>
          <h1 className="mt-2 text-xl font-bold text-text-primary">
            {config.name}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-text-muted">
            {config.description}
          </p>
        </div>
        <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
      </div>

      {/* KPI row */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs text-text-muted">Current Value</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {current
              ? formatValue(current.value, config.format, config.decimals)
              : "—"}
          </p>
          {current && (
            <p className="mt-0.5 text-xs text-text-muted">
              {formatDate(current.date)}
            </p>
          )}
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted">Change</p>
          <p className={`mt-1 text-2xl font-bold ${changeColor}`}>
            {arrow} {changeText}
          </p>
          <p className="mt-0.5 text-xs text-text-muted">vs previous period</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted">Period High</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {max !== null
              ? formatValue(max, config.format, config.decimals)
              : "—"}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-muted">Period Average</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">
            {avg !== null
              ? formatValue(avg, config.format, config.decimals)
              : "—"}
          </p>
        </div>
      </div>

      {/* Main chart */}
      <div className="card p-5">
        <h3 className="mb-4 text-sm font-semibold text-text-secondary">
          {config.shortName} — Historical Data
        </h3>
        {isLoading ? (
          <div className="skeleton h-72 w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-text-muted">
            No data available for this time range
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-1)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={{ stroke: "var(--border-secondary)" }}
                  tickLine={false}
                  tickFormatter={(v) => formatDate(v, true)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)" }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tickFormatter={(v) =>
                    formatValue(v, config.format, config.decimals)
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-primary)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "var(--text-primary)",
                  }}
                  labelFormatter={(v) => formatDate(v)}
                  formatter={(value) => [
                    formatValue(Number(value), config.format, config.decimals),
                    config.shortName,
                  ]}
                />
                {avg !== null && (
                  <ReferenceLine
                    y={avg}
                    stroke="var(--text-muted)"
                    strokeDasharray="3 3"
                    label={{
                      value: "Avg",
                      position: "right",
                      fill: "var(--text-muted)",
                      fontSize: 10,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#detailGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Data table (recent values) */}
      <div className="card mt-6 overflow-hidden">
        <div className="px-5 py-4">
          <h3 className="text-sm font-semibold text-text-secondary">
            Recent Observations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-t border-border-secondary bg-bg-secondary">
                <th className="px-5 py-2.5 font-medium text-text-muted">
                  Date
                </th>
                <th className="px-5 py-2.5 text-right font-medium text-text-muted">
                  Value
                </th>
                <th className="px-5 py-2.5 text-right font-medium text-text-muted">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {[...sorted]
                .reverse()
                .slice(0, 20)
                .map((d, i, arr) => {
                  const prev = arr[i + 1];
                  const pctChange =
                    prev && prev.value !== 0
                      ? ((d.value - prev.value) / Math.abs(prev.value)) * 100
                      : null;
                  const { text, color } = formatChange(pctChange);

                  return (
                    <tr
                      key={d.date}
                      className="border-t border-border-secondary"
                    >
                      <td className="px-5 py-2 text-text-primary">
                        {formatDate(d.date)}
                      </td>
                      <td className="px-5 py-2 text-right font-mono text-text-primary">
                        {formatValue(d.value, config.format, config.decimals)}
                      </td>
                      <td className={`px-5 py-2 text-right font-mono ${color}`}>
                        {text}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Series metadata */}
      <div className="card mt-6 p-5">
        <h3 className="mb-3 text-sm font-semibold text-text-secondary">
          Series Information
        </h3>
        <div className="grid gap-y-2 text-xs sm:grid-cols-2">
          <div>
            <span className="text-text-muted">Series ID: </span>
            <span className="font-mono text-text-primary">
              {config.seriesId}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Source: </span>
            <span className="text-text-primary">
              {config.source === "fred"
                ? "Federal Reserve Economic Data (FRED)"
                : "Alpha Vantage"}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Unit: </span>
            <span className="text-text-primary">{config.unit}</span>
          </div>
          <div>
            <span className="text-text-muted">Category: </span>
            <span className="text-text-primary">
              {categoryLabels[config.category]}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Signal Direction: </span>
            <span className="text-text-primary capitalize">
              {config.signalDirection}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Observations: </span>
            <span className="text-text-primary">{sorted.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
