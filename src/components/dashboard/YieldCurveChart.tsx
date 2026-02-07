"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useYieldCurve } from "@/hooks/use-fred-series";

export default function YieldCurveChart() {
  const { data: curveData, isLoading, error } = useYieldCurve();

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="skeleton mb-4 h-4 w-32" />
        <div className="skeleton h-52 w-full" />
      </div>
    );
  }

  if (error || !curveData || curveData.length === 0) {
    return (
      <div className="card p-6">
        <h3
          className="text-sm font-medium text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Yield Curve
        </h3>
        <div className="mt-4 flex h-52 items-center justify-center text-xs text-text-muted">
          {error ? "Failed to load yield curve" : "No data available"}
        </div>
      </div>
    );
  }

  const isInverted = curveData.some(
    (d, i) => i > 0 && d.rate < curveData[0].rate
  );

  return (
    <div className="card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3
            className="text-sm font-medium tracking-tight text-text-secondary"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            US Treasury Yield Curve
          </h3>
          <p className="mt-0.5 text-[11px] text-text-muted">
            Current rates across maturities
          </p>
        </div>
        {isInverted && (
          <span
            className="badge badge-risk"
            style={{
              backgroundColor: "rgba(255, 59, 92, 0.1)",
              color: "var(--color-danger)",
              borderColor: "rgba(255, 59, 92, 0.2)",
            }}
          >
            Inverted
          </span>
        )}
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={curveData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isInverted ? "var(--color-danger)" : "var(--chart-1)"}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={isInverted ? "var(--color-danger)" : "var(--chart-1)"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="maturity"
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={{ stroke: "var(--border-secondary)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
              width={45}
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
              formatter={(value) => [`${Number(value).toFixed(2)}%`, "Yield"]}
            />
            <ReferenceLine y={0} stroke="var(--border-primary)" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={isInverted ? "var(--color-danger)" : "var(--chart-1)"}
              strokeWidth={2}
              fill="url(#yieldGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
