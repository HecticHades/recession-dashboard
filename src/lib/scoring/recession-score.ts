import type {
  NormalizedSignal,
  RecessionScore,
  IndicatorCategory,
} from "../types";
import { clamp } from "../utils";

/**
 * Category weights in the composite recession probability.
 * Leading indicators have the most predictive power.
 */
const CATEGORY_WEIGHTS: Record<IndicatorCategory, number> = {
  leading: 0.40,
  coincident: 0.25,
  financial_stress: 0.20,
  lagging: 0.15,
  commodity: 0.0, // Commodities feed into sentiment, not directly
  sentiment: 0.0,
};

/**
 * Compute composite recession probability from normalized signals.
 *
 * Algorithm:
 * 1. Group signals by category
 * 2. Within each category, compute weighted average of normalized values
 * 3. Map each category's composite from [-1, +1] to [0, 100] recession risk
 * 4. Weight categories per CATEGORY_WEIGHTS
 * 5. Final score is weighted average → 0-100% recession probability
 */
export function computeRecessionScore(
  signals: NormalizedSignal[]
): RecessionScore {
  if (signals.length === 0) {
    return {
      overall: 0,
      byCategory: {
        leading: 0,
        coincident: 0,
        financial_stress: 0,
        lagging: 0,
        commodity: 0,
        sentiment: 0,
      },
      signals,
      confidence: 0,
      lastCalculated: new Date().toISOString(),
    };
  }

  // Group by category
  const grouped = new Map<IndicatorCategory, NormalizedSignal[]>();
  for (const signal of signals) {
    const list = grouped.get(signal.category) ?? [];
    list.push(signal);
    grouped.set(signal.category, list);
  }

  // Compute per-category scores
  const byCategory: Record<IndicatorCategory, number> = {
    leading: 0,
    coincident: 0,
    financial_stress: 0,
    lagging: 0,
    commodity: 0,
    sentiment: 0,
  };

  for (const [category, catSignals] of grouped) {
    // Weighted average within category
    let totalWeight = 0;
    let weightedSum = 0;

    for (const signal of catSignals) {
      weightedSum += signal.normalizedValue * signal.weight;
      totalWeight += signal.weight;
    }

    if (totalWeight > 0) {
      const avgSignal = weightedSum / totalWeight; // -1 to +1
      // Map to 0-100 recession probability:
      // -1 (strong boom) → 0%, 0 (neutral) → 50%, +1 (deep recession) → 100%
      // But since negative normalizedValue means recession risk for our scoring:
      // Actually: normalizedValue > 0 → expansion, < 0 → recession
      // So recession probability = (1 - avgSignal) / 2 * 100
      byCategory[category] = clamp(((1 - avgSignal) / 2) * 100, 0, 100);
    }
  }

  // Compute overall weighted score
  let overallSum = 0;
  let overallWeightSum = 0;

  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    if (weight > 0 && grouped.has(category as IndicatorCategory)) {
      overallSum += byCategory[category as IndicatorCategory] * weight;
      overallWeightSum += weight;
    }
  }

  // Also factor in commodities if available (bonus weight)
  if (grouped.has("commodity")) {
    overallSum += byCategory.commodity * 0.05;
    overallWeightSum += 0.05;
  }

  const overall =
    overallWeightSum > 0
      ? clamp(overallSum / overallWeightSum, 0, 100)
      : 0;

  // Confidence = percentage of expected categories with data
  const expectedCategories = Object.entries(CATEGORY_WEIGHTS).filter(
    ([, w]) => w > 0
  ).length;
  const availableCategories = [...grouped.keys()].filter(
    (cat) => CATEGORY_WEIGHTS[cat] > 0
  ).length;
  const confidence = (availableCategories / expectedCategories) * 100;

  return {
    overall,
    byCategory,
    signals,
    confidence,
    lastCalculated: new Date().toISOString(),
  };
}
