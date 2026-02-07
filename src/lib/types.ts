// ============================================================
// Core domain types for the Recession Dashboard
// ============================================================

/** A single FRED or Alpha Vantage observation */
export interface DataPoint {
  date: string; // ISO date string YYYY-MM-DD
  value: number;
}

/** Indicator category for weighting */
export type IndicatorCategory =
  | "leading"
  | "coincident"
  | "financial_stress"
  | "lagging"
  | "commodity"
  | "sentiment";

/** Whether a higher value means recession risk or expansion */
export type SignalDirection = "positive" | "negative" | "inverted";

/** Configuration for a single economic indicator */
export interface IndicatorConfig {
  id: string;
  name: string;
  shortName: string;
  category: IndicatorCategory;
  source: "fred" | "alpha_vantage";
  seriesId: string; // FRED series ID or AV function key
  unit: string;
  description: string;
  /** "positive" = higher is better (e.g. GDP growth)
   *  "negative" = lower is better (e.g. unemployment)
   *  "inverted" = value itself is a spread that can go negative */
  signalDirection: SignalDirection;
  /** Weight within its category (0-1) */
  weight: number;
  /** How to format the display value */
  format: "percent" | "number" | "currency" | "index" | "thousands";
  /** Decimal places for display */
  decimals: number;
}

/** Fetched indicator data with metadata */
export interface IndicatorData {
  config: IndicatorConfig;
  observations: DataPoint[];
  currentValue: number | null;
  previousValue: number | null;
  changePercent: number | null;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Normalized signal for a single indicator */
export interface NormalizedSignal {
  indicatorId: string;
  category: IndicatorCategory;
  rawValue: number;
  normalizedValue: number; // -1 to +1
  percentile: number; // 0-100
  zScore: number;
  weight: number;
  trend: "improving" | "deteriorating" | "stable";
}

/** Composite recession risk score */
export interface RecessionScore {
  overall: number; // 0-100 probability
  byCategory: Record<IndicatorCategory, number>; // 0-100 per category
  signals: NormalizedSignal[];
  confidence: number; // 0-100 how many indicators have data
  lastCalculated: string;
}

/** Economic cycle phase */
export type CyclePhase = "expansion" | "peak" | "contraction" | "trough";

/** Economic cycle position output */
export interface CyclePosition {
  phase: CyclePhase;
  conviction: number; // 0-100 % of indicators agreeing
  direction: "accelerating" | "decelerating" | "stable";
  leadingComposite: number; // -1 to +1
  coincidentComposite: number; // -1 to +1
  monthsInPhase: number;
}

/** Region risk entry */
export interface RegionRisk {
  region: string;
  regionCode: string;
  riskScore: number; // 0-100
  available: boolean;
  indicators: number;
}

/** Time range options for chart filtering */
export type TimeRange = "1M" | "3M" | "6M" | "1Y" | "2Y" | "5Y" | "MAX";

/** FRED API response shape */
export interface FredApiResponse {
  realtime_start: string;
  realtime_end: string;
  observation_start: string;
  observation_end: string;
  units: string;
  output_type: number;
  file_type: string;
  order_by: string;
  sort_order: string;
  count: number;
  offset: number;
  limit: number;
  observations: Array<{
    realtime_start: string;
    realtime_end: string;
    date: string;
    value: string;
  }>;
}

/** Alpha Vantage generic time series response */
export interface AlphaVantageTimeSeriesResponse {
  [key: string]: Record<string, Record<string, string>> | Record<string, string>;
}

/** Dashboard-wide state */
export interface DashboardState {
  timeRange: TimeRange;
  selectedRegion: string;
  isLoading: boolean;
}

/** NBER recession period for timeline overlay */
export interface RecessionPeriod {
  start: string;
  end: string;
  name: string;
}
