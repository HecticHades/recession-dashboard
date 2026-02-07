import type { NormalizedSignal, CyclePosition, CyclePhase } from "../types";

const DIRECTION_THRESHOLD = 0.6;

/**
 * Detect economic cycle position from normalized signals.
 *
 * Four-phase cycle detection:
 * - Expansion: Leading > 0, Coincident > 0, trend accelerating
 * - Peak:      Leading turning negative, Coincident still positive
 * - Contraction: Leading < 0, Coincident < 0
 * - Trough:    Leading turning positive, Coincident still negative
 *
 * Uses the divergence between leading and coincident composites.
 */
export function detectCyclePosition(
  signals: NormalizedSignal[]
): CyclePosition {
  const leading = signals.filter((s) => s.category === "leading");
  const coincident = signals.filter((s) => s.category === "coincident");

  if (leading.length === 0 && coincident.length === 0) {
    return {
      phase: "expansion",
      conviction: 0,
      direction: "stable",
      leadingComposite: 0,
      coincidentComposite: 0,
      monthsInPhase: 0,
    };
  }

  // Compute weighted composites
  const leadingComposite = computeWeightedComposite(leading);
  const coincidentComposite = computeWeightedComposite(coincident);

  // Determine phase
  let phase: CyclePhase;
  if (leadingComposite > 0 && coincidentComposite > 0) {
    phase = "expansion";
  } else if (leadingComposite < 0 && coincidentComposite > 0) {
    phase = "peak";
  } else if (leadingComposite < 0 && coincidentComposite < 0) {
    phase = "contraction";
  } else {
    // leading > 0, coincident < 0
    phase = "trough";
  }

  // Single-pass trend counting (js-combine-iterations)
  let improvingCount = 0;
  let deterioratingCount = 0;
  for (const s of leading) {
    if (s.trend === "improving") improvingCount++;
    else if (s.trend === "deteriorating") deterioratingCount++;
  }
  const totalTrend = leading.length || 1;

  let direction: "accelerating" | "decelerating" | "stable";
  if (improvingCount / totalTrend > DIRECTION_THRESHOLD) {
    direction = "accelerating";
  } else if (deterioratingCount / totalTrend > DIRECTION_THRESHOLD) {
    direction = "decelerating";
  } else {
    direction = "stable";
  }

  // Conviction: % of all indicators that agree with the assigned phase
  const allSignals = [...leading, ...coincident];
  const agreeCount = allSignals.filter((s) => {
    switch (phase) {
      case "expansion":
        return s.normalizedValue > 0;
      case "contraction":
        return s.normalizedValue < 0;
      case "peak":
        return s.category === "leading"
          ? s.normalizedValue < 0
          : s.normalizedValue > 0;
      case "trough":
        return s.category === "leading"
          ? s.normalizedValue > 0
          : s.normalizedValue < 0;
    }
  }).length;

  const conviction =
    allSignals.length > 0
      ? Math.round((agreeCount / allSignals.length) * 100)
      : 0;

  return {
    phase,
    conviction,
    direction,
    leadingComposite,
    coincidentComposite,
    monthsInPhase: 0, // Always 0: accurate tracking requires persisting phase history across sessions
  };
}

function computeWeightedComposite(signals: NormalizedSignal[]): number {
  if (signals.length === 0) return 0;
  let totalWeight = 0;
  let weightedSum = 0;
  for (const s of signals) {
    weightedSum += s.normalizedValue * s.weight;
    totalWeight += s.weight;
  }
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}
