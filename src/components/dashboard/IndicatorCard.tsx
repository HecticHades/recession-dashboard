"use client";

import Link from "next/link";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import type { IndicatorConfig, DataPoint } from "@/lib/types";
import { formatValue, formatChange } from "@/lib/utils";

interface IndicatorCardProps {
  config: IndicatorConfig;
  data: DataPoint[];
  isLoading?: boolean;
}

export default function IndicatorCard({
  config,
  data,
  isLoading,
}: IndicatorCardProps) {
  if (isLoading) {
    return (
      <div className="card p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="skeleton mb-2 h-3 w-20" />
            <div className="skeleton mb-1 h-6 w-24" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="skeleton h-10 w-20" />
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="card p-4">
        <div className="flex h-full min-h-[72px] items-center justify-center">
          <p className="text-xs text-text-muted">No data available</p>
        </div>
      </div>
    );
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const sparkData = sorted.slice(-30).map((d) => ({ v: d.value }));

  const current = sorted.length > 0 ? sorted[sorted.length - 1].value : null;
  const previous = sorted.length > 1 ? sorted[sorted.length - 2].value : null;
  const change =
    current !== null && previous !== null && previous !== 0
      ? ((current - previous) / Math.abs(previous)) * 100
      : null;

  const { text: changeText, color: changeColor, arrow } = formatChange(change);

  const isPositiveTrend =
    change !== null &&
    ((config.signalDirection === "positive" && change > 0) ||
      (config.signalDirection === "negative" && change < 0) ||
      (config.signalDirection === "inverted" && change > 0));

  const sparkColor = isPositiveTrend
    ? "var(--color-success)"
    : change !== null && change !== 0
      ? "var(--color-danger)"
      : "var(--text-muted)";

  return (
    <Link href={`/indicator/${config.id}`}>
      <div className="card cursor-pointer p-4 transition-[transform,border-color,box-shadow] duration-300 hover:scale-[1.01]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] tracking-wide text-text-muted">
              {config.shortName}
            </p>
            <p
              className="mt-1.5 text-lg font-semibold text-text-primary"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {current !== null
                ? formatValue(current, config.format, config.decimals)
                : "\u2014"}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <span
                className={`text-[11px] font-semibold ${changeColor}`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {arrow} {changeText}
              </span>
            </div>
          </div>

          {sparkData.length > 2 && (
            <div className="h-10 w-20 flex-shrink-0 opacity-70">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={sparkColor}
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
