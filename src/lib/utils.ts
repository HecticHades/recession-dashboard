import type { TimeRange } from "./types";

/** Format a number for display based on format type */
export function formatValue(
  value: number | null,
  format: "percent" | "number" | "currency" | "index" | "thousands",
  decimals: number = 2
): string {
  if (value === null || isNaN(value)) return "N/A";

  switch (format) {
    case "percent":
      return `${value.toFixed(decimals)}%`;
    case "currency":
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
    case "thousands":
      return `${(value / 1000).toFixed(decimals)}K`;
    case "index":
      return value.toFixed(decimals);
    case "number":
    default:
      return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }
}

/** Format a percentage change with + or - sign and color class */
export function formatChange(change: number | null): {
  text: string;
  color: string;
  arrow: string;
} {
  if (change === null || isNaN(change)) {
    return { text: "N/A", color: "text-text-muted", arrow: "" };
  }
  if (change > 0) {
    return {
      text: `+${change.toFixed(2)}%`,
      color: "text-[var(--color-success)]",
      arrow: "↑",
    };
  }
  if (change < 0) {
    return {
      text: `${change.toFixed(2)}%`,
      color: "text-[var(--color-danger)]",
      arrow: "↓",
    };
  }
  return { text: "0.00%", color: "text-text-muted", arrow: "→" };
}

/** Get the start date for a given time range relative to now */
export function getStartDate(range: TimeRange): string {
  const now = new Date();
  const offsets: Record<TimeRange, number> = {
    "1M": 30,
    "3M": 90,
    "6M": 180,
    "1Y": 365,
    "2Y": 730,
    "5Y": 1825,
    MAX: 365 * 30,
  };
  const start = new Date(now.getTime() - offsets[range] * 24 * 60 * 60 * 1000);
  return start.toISOString().split("T")[0];
}

/** Format a date string for display */
export function formatDate(dateStr: string, short = false): string {
  const date = new Date(dateStr);
  if (short) {
    return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Get risk level label from a 0-100 score */
export function getRiskLevel(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score < 20)
    return { label: "Low", color: "var(--risk-low)", bgColor: "bg-risk-low/10" };
  if (score < 40)
    return { label: "Moderate", color: "var(--risk-moderate)", bgColor: "bg-risk-moderate/10" };
  if (score < 60)
    return { label: "Elevated", color: "var(--risk-high)", bgColor: "bg-risk-high/10" };
  if (score < 80)
    return { label: "High", color: "var(--risk-severe)", bgColor: "bg-risk-severe/10" };
  return { label: "Severe", color: "var(--risk-critical)", bgColor: "bg-risk-critical/10" };
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Simple moving average */
export function sma(data: number[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
  }
  return result;
}

/** Calculate percent change between two values */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/** Category display labels */
export const categoryLabels: Record<string, string> = {
  leading: "Leading Indicators",
  coincident: "Coincident Indicators",
  financial_stress: "Financial Stress",
  lagging: "Lagging Indicators",
  commodity: "Commodities & Markets",
  sentiment: "Sentiment & Surveys",
};

/** Category display order */
export const categoryOrder = [
  "leading",
  "coincident",
  "financial_stress",
  "lagging",
  "commodity",
  "sentiment",
] as const;
