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
            <div className="skeleton h-3 w-20 mb-2" />
            <div className="skeleton h-6 w-24 mb-1" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="skeleton h-10 w-20" />
        </div>
      </div>
    );
  }

  // Data comes desc from FRED — reverse for charts, take recent for display
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

  // Determine sparkline color based on signal direction + trend
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
      <div className="card cursor-pointer p-4 transition-all hover:scale-[1.01]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-text-muted">
              {config.shortName}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              {current !== null
                ? formatValue(current, config.format, config.decimals)
                : "—"}
            </p>
            <div className="mt-0.5 flex items-center gap-1">
              <span className={`text-xs font-medium ${changeColor}`}>
                {arrow} {changeText}
              </span>
            </div>
          </div>

          {sparkData.length > 2 && (
            <div className="h-10 w-20 flex-shrink-0">
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
