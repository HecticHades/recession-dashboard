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
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8">
        <div className="text-center">
          <h1
            className="text-2xl text-text-primary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Indicator Not Found
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            No indicator with ID &quot;{id}&quot; exists.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium transition-colors"
            style={{ color: "var(--accent)" }}
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
    <div className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8" style={{ zIndex: 1 }}>
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-text-secondary"
      >
        <svg
          width="14"
          height="14"
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
      <div className="animate-reveal mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="rounded-md border border-border-secondary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {categoryLabels[config.category]}
            </span>
            <span
              className="rounded-md border border-border-secondary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {config.source === "fred" ? "FRED" : "ALPHA VANTAGE"}
            </span>
          </div>
          <h1
            className="mt-3 text-2xl text-text-primary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {config.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-text-muted">
            {config.description}
          </p>
        </div>
        <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
      </div>

      {/* KPI row */}
      <div className="animate-reveal stagger-1 mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <p className="text-[10px] tracking-wide text-text-muted">CURRENT VALUE</p>
          <p
            className="mt-2 text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {current
              ? formatValue(current.value, config.format, config.decimals)
              : "\u2014"}
          </p>
          {current && (
            <p
              className="mt-1 text-[11px] text-text-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {formatDate(current.date)}
            </p>
          )}
        </div>
        <div className="card p-5">
          <p className="text-[10px] tracking-wide text-text-muted">CHANGE</p>
          <p
            className={`mt-2 text-2xl font-bold ${changeColor}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {arrow} {changeText}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">vs previous period</p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] tracking-wide text-text-muted">PERIOD HIGH</p>
          <p
            className="mt-2 text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {max !== null
              ? formatValue(max, config.format, config.decimals)
              : "\u2014"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-[10px] tracking-wide text-text-muted">PERIOD AVERAGE</p>
          <p
            className="mt-2 text-2xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {avg !== null
              ? formatValue(avg, config.format, config.decimals)
              : "\u2014"}
          </p>
        </div>
      </div>

      {/* Main chart */}
      <div className="animate-reveal stagger-2 card p-6">
        <h3
          className="mb-5 text-sm font-medium text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {config.shortName} &mdash; Historical Data
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
                      stopOpacity={0.2}
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
                  tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                  axisLine={{ stroke: "var(--border-secondary)" }}
                  tickLine={false}
                  tickFormatter={(v) => formatDate(v, true)}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
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
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
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
      <div className="animate-reveal stagger-3 card data-table mt-8 overflow-hidden">
        <div className="px-6 py-5">
          <h3
            className="text-sm font-medium text-text-secondary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Recent Observations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-t border-border-secondary bg-bg-secondary/50">
                <th
                  className="px-6 py-3 text-[10px] font-semibold tracking-wide text-text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  DATE
                </th>
                <th
                  className="px-6 py-3 text-right text-[10px] font-semibold tracking-wide text-text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  VALUE
                </th>
                <th
                  className="px-6 py-3 text-right text-[10px] font-semibold tracking-wide text-text-muted"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  CHANGE
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
                      <td
                        className="px-6 py-2.5 text-text-primary"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {formatDate(d.date)}
                      </td>
                      <td
                        className="px-6 py-2.5 text-right text-text-primary"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {formatValue(d.value, config.format, config.decimals)}
                      </td>
                      <td
                        className={`px-6 py-2.5 text-right ${color}`}
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
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
      <div className="animate-reveal stagger-4 card mt-8 p-6">
        <h3
          className="mb-4 text-sm font-medium text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Series Information
        </h3>
        <div className="grid gap-y-3 text-xs sm:grid-cols-2">
          <div>
            <span className="text-text-muted">Series ID </span>
            <span
              className="font-medium text-text-primary"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {config.seriesId}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Source </span>
            <span className="font-medium text-text-primary">
              {config.source === "fred"
                ? "Federal Reserve Economic Data (FRED)"
                : "Alpha Vantage"}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Unit </span>
            <span className="font-medium text-text-primary">{config.unit}</span>
          </div>
          <div>
            <span className="text-text-muted">Category </span>
            <span className="font-medium text-text-primary">
              {categoryLabels[config.category]}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Signal Direction </span>
            <span className="font-medium capitalize text-text-primary">
              {config.signalDirection}
            </span>
          </div>
          <div>
            <span className="text-text-muted">Observations </span>
            <span
              className="font-medium text-text-primary"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {sorted.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
