import type { DataPoint, IndicatorConfig, NormalizedSignal } from "../types";
import { clamp } from "../utils";

/**
 * Compute the percentile of a value within a dataset (0-100).
 */
function percentileRank(value: number, dataset: number[]): number {
  const sorted = [...dataset].sort((a, b) => a - b);
  const below = sorted.filter((v) => v < value).length;
  const equal = sorted.filter((v) => v === value).length;
  return ((below + equal * 0.5) / sorted.length) * 100;
}

/**
 * Compute Z-score of a value relative to a dataset.
 */
function zScore(value: number, dataset: number[]): number {
  const mean = dataset.reduce((a, b) => a + b, 0) / dataset.length;
  const variance =
    dataset.reduce((sum, v) => sum + (v - mean) ** 2, 0) / dataset.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  return (value - mean) / stdDev;
}

/**
 * Determine trend direction from recent data points.
 */
function computeTrend(
  data: DataPoint[],
  periods: number = 3
): "improving" | "deteriorating" | "stable" {
  if (data.length < periods + 1) return "stable";

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const recent = sorted.slice(-periods);
  const avgRecent = recent.reduce((s, d) => s + d.value, 0) / recent.length;
  const prior = sorted.slice(-(periods * 2), -periods);
  if (prior.length === 0) return "stable";
  const avgPrior = prior.reduce((s, d) => s + d.value, 0) / prior.length;

  const changePct = ((avgRecent - avgPrior) / Math.abs(avgPrior)) * 100;

  if (Math.abs(changePct) < 1) return "stable";
  return changePct > 0 ? "improving" : "deteriorating";
}

/**
 * Normalize a single indicator's data into a -1 to +1 signal.
 *
 * Process:
 * 1. Gather historical values (up to 20 years)
 * 2. Compute current value's percentile and z-score
 * 3. Map percentile to -1..+1 based on signal direction
 * 4. Blend z-score for outlier sensitivity
 */
export function normalizeIndicator(
  config: IndicatorConfig,
  data: DataPoint[]
): NormalizedSignal | null {
  if (data.length < 10) return null;

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const values = sorted.map((d) => d.value);
  const currentValue = values[values.length - 1];
  const pct = percentileRank(currentValue, values);
  const z = zScore(currentValue, values);
  const trend = computeTrend(data);

  // Map percentile to signal based on direction
  let normalizedValue: number;

  switch (config.signalDirection) {
    case "positive":
      // Higher is better: high percentile → positive signal (expansion)
      normalizedValue = (pct / 50 - 1); // 0→-1, 50→0, 100→+1
      break;
    case "negative":
      // Lower is better: high percentile → negative signal (recession risk)
      normalizedValue = -(pct / 50 - 1); // 0→+1, 50→0, 100→-1
      break;
    case "inverted":
      // Value itself is a spread; negative = bad (e.g. yield curve)
      // Use z-score more heavily for these
      normalizedValue = clamp(z / 2, -1, 1);
      break;
  }

  // Blend with z-score for outlier sensitivity (70% percentile, 30% z-score)
  const zNormalized = clamp(z / 3, -1, 1);
  if (config.signalDirection !== "inverted") {
    const zContrib =
      config.signalDirection === "positive" ? zNormalized : -zNormalized;
    normalizedValue = normalizedValue * 0.7 + zContrib * 0.3;
  }

  normalizedValue = clamp(normalizedValue, -1, 1);

  return {
    indicatorId: config.id,
    category: config.category,
    rawValue: currentValue,
    normalizedValue,
    percentile: pct,
    zScore: z,
    weight: config.weight,
    trend,
  };
}

/**
 * Normalize multiple indicators at once.
 */
export function normalizeAll(
  configs: IndicatorConfig[],
  dataMap: Record<string, DataPoint[]>
): NormalizedSignal[] {
  const signals: NormalizedSignal[] = [];

  for (const config of configs) {
    const data = dataMap[config.seriesId];
    if (!data || data.length === 0) continue;

    const signal = normalizeIndicator(config, data);
    if (signal) signals.push(signal);
  }

  return signals;
}
