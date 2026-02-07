import type { IndicatorConfig } from "../types";

/**
 * All indicator definitions with FRED series IDs and Alpha Vantage keys.
 * Each indicator has a unique id, source, and scoring configuration.
 */
export const INDICATOR_CONFIGS: IndicatorConfig[] = [
  // ============================================================
  // LEADING INDICATORS (40% weight in composite)
  // ============================================================
  {
    id: "yield_curve",
    name: "10Y-2Y Treasury Spread",
    shortName: "Yield Curve",
    category: "leading",
    source: "fred",
    seriesId: "T10Y2Y",
    unit: "%",
    description:
      "Difference between 10-Year and 2-Year Treasury yields. Inversion (negative) is a strong recession predictor.",
    signalDirection: "inverted",
    weight: 0.2,
    format: "percent",
    decimals: 2,
  },
  {
    id: "initial_claims",
    name: "Initial Jobless Claims",
    shortName: "Initial Claims",
    category: "leading",
    source: "fred",
    seriesId: "ICSA",
    unit: "thousands",
    description:
      "Weekly new unemployment claims. Rising claims signal labor market deterioration.",
    signalDirection: "negative",
    weight: 0.15,
    format: "thousands",
    decimals: 0,
  },
  {
    id: "building_permits",
    name: "Building Permits",
    shortName: "Permits",
    category: "leading",
    source: "fred",
    seriesId: "PERMIT",
    unit: "thousands",
    description:
      "New private housing units authorized by building permits. Leading indicator of construction activity.",
    signalDirection: "positive",
    weight: 0.1,
    format: "thousands",
    decimals: 0,
  },
  {
    id: "housing_starts",
    name: "Housing Starts",
    shortName: "Housing",
    category: "leading",
    source: "fred",
    seriesId: "HOUST",
    unit: "thousands",
    description:
      "New residential construction starts. Sensitive to interest rates and economic confidence.",
    signalDirection: "positive",
    weight: 0.1,
    format: "thousands",
    decimals: 0,
  },
  {
    id: "consumer_sentiment",
    name: "U. of Michigan Consumer Sentiment",
    shortName: "Sentiment",
    category: "leading",
    source: "fred",
    seriesId: "UMCSENT",
    unit: "index",
    description:
      "Consumer confidence survey. Low sentiment often precedes reduced consumer spending.",
    signalDirection: "positive",
    weight: 0.1,
    format: "index",
    decimals: 1,
  },
  {
    id: "sp500",
    name: "S&P 500 Index",
    shortName: "S&P 500",
    category: "leading",
    source: "fred",
    seriesId: "SP500",
    unit: "index",
    description:
      "Broad US stock market index. Leading economic indicator reflecting corporate earnings expectations.",
    signalDirection: "positive",
    weight: 0.1,
    format: "number",
    decimals: 0,
  },
  {
    id: "m2_money",
    name: "M2 Money Supply",
    shortName: "M2",
    category: "leading",
    source: "fred",
    seriesId: "M2SL",
    unit: "billions",
    description:
      "Broad measure of money supply. Contraction can signal tight monetary conditions.",
    signalDirection: "positive",
    weight: 0.1,
    format: "currency",
    decimals: 0,
  },
  {
    id: "jolts",
    name: "JOLTS Job Openings",
    shortName: "JOLTS",
    category: "leading",
    source: "fred",
    seriesId: "JTSJOL",
    unit: "thousands",
    description:
      "Job Openings and Labor Turnover Survey. Declining openings signal weakening labor demand.",
    signalDirection: "positive",
    weight: 0.15,
    format: "thousands",
    decimals: 0,
  },

  // ============================================================
  // COINCIDENT INDICATORS (25% weight in composite)
  // ============================================================
  {
    id: "real_gdp",
    name: "Real Gross Domestic Product",
    shortName: "Real GDP",
    category: "coincident",
    source: "fred",
    seriesId: "GDPC1",
    unit: "billions",
    description:
      "Inflation-adjusted GDP. The broadest measure of economic output. Two consecutive quarters of decline = technical recession.",
    signalDirection: "positive",
    weight: 0.3,
    format: "currency",
    decimals: 0,
  },
  {
    id: "industrial_production",
    name: "Industrial Production Index",
    shortName: "Ind. Prod.",
    category: "coincident",
    source: "fred",
    seriesId: "INDPRO",
    unit: "index",
    description:
      "Output of manufacturing, mining, and utilities. Key coincident indicator of real economic activity.",
    signalDirection: "positive",
    weight: 0.25,
    format: "index",
    decimals: 2,
  },
  {
    id: "retail_sales",
    name: "Advance Retail Sales",
    shortName: "Retail Sales",
    category: "coincident",
    source: "fred",
    seriesId: "RSAFS",
    unit: "millions",
    description:
      "Total retail and food services sales. Proxy for consumer spending (~70% of GDP).",
    signalDirection: "positive",
    weight: 0.25,
    format: "currency",
    decimals: 0,
  },
  {
    id: "unemployment",
    name: "Unemployment Rate",
    shortName: "Unemp.",
    category: "coincident",
    source: "fred",
    seriesId: "UNRATE",
    unit: "%",
    description:
      "Percentage of labor force that is unemployed. Rises sharply during recessions (Sahm Rule trigger).",
    signalDirection: "negative",
    weight: 0.2,
    format: "percent",
    decimals: 1,
  },

  // ============================================================
  // FINANCIAL STRESS (20% weight in composite)
  // ============================================================
  {
    id: "stl_stress",
    name: "St. Louis Financial Stress Index",
    shortName: "STL Stress",
    category: "financial_stress",
    source: "fred",
    seriesId: "STLFSI4",
    unit: "index",
    description:
      "Composite index of financial stress. Values above 0 indicate above-average stress.",
    signalDirection: "negative",
    weight: 0.3,
    format: "index",
    decimals: 3,
  },
  {
    id: "chicago_fci",
    name: "Chicago Fed National Financial Conditions",
    shortName: "NFCI",
    category: "financial_stress",
    source: "fred",
    seriesId: "NFCI",
    unit: "index",
    description:
      "Financial conditions index. Positive values indicate tighter-than-average conditions.",
    signalDirection: "negative",
    weight: 0.3,
    format: "index",
    decimals: 3,
  },
  {
    id: "fed_funds",
    name: "Federal Funds Effective Rate",
    shortName: "Fed Funds",
    category: "financial_stress",
    source: "fred",
    seriesId: "FEDFUNDS",
    unit: "%",
    description:
      "The interest rate at which banks lend reserves to each other. Key monetary policy tool.",
    signalDirection: "negative",
    weight: 0.2,
    format: "percent",
    decimals: 2,
  },
  {
    id: "ted_spread",
    name: "TED Spread (3M LIBOR - T-Bill)",
    shortName: "TED Spread",
    category: "financial_stress",
    source: "fred",
    seriesId: "TEDRATE",
    unit: "%",
    description:
      "Difference between 3-month LIBOR and T-Bill rate. Measures banking sector credit risk.",
    signalDirection: "negative",
    weight: 0.2,
    format: "percent",
    decimals: 3,
  },

  // ============================================================
  // LAGGING INDICATORS (15% weight in composite)
  // ============================================================
  {
    id: "cpi",
    name: "Consumer Price Index (All Urban)",
    shortName: "CPI",
    category: "lagging",
    source: "fred",
    seriesId: "CPIAUCSL",
    unit: "index",
    description:
      "Headline inflation measure. Persistently high inflation often precedes Fed tightening and slowdown.",
    signalDirection: "negative",
    weight: 0.35,
    format: "index",
    decimals: 1,
  },
  {
    id: "core_pce",
    name: "Core PCE Price Index",
    shortName: "Core PCE",
    category: "lagging",
    source: "fred",
    seriesId: "PCEPILFE",
    unit: "index",
    description:
      "Fed's preferred inflation gauge (ex food & energy). Target is 2% YoY.",
    signalDirection: "negative",
    weight: 0.35,
    format: "index",
    decimals: 1,
  },
  {
    id: "avg_duration_unemp",
    name: "Average Duration of Unemployment",
    shortName: "Avg Duration",
    category: "lagging",
    source: "fred",
    seriesId: "UEMPMEAN",
    unit: "weeks",
    description:
      "Average weeks unemployed. Rises after recession starts and peaks after it ends.",
    signalDirection: "negative",
    weight: 0.3,
    format: "number",
    decimals: 1,
  },

  // ============================================================
  // COMMODITIES & MARKETS (via Alpha Vantage)
  // ============================================================
  {
    id: "gold",
    name: "Gold Price",
    shortName: "Gold",
    category: "commodity",
    source: "alpha_vantage",
    seriesId: "GOLD",
    unit: "$/oz",
    description:
      "Gold spot price. Safe-haven asset; rising gold often signals fear and uncertainty.",
    signalDirection: "negative",
    weight: 0.25,
    format: "currency",
    decimals: 2,
  },
  {
    id: "oil_wti",
    name: "WTI Crude Oil",
    shortName: "WTI Oil",
    category: "commodity",
    source: "alpha_vantage",
    seriesId: "WTI",
    unit: "$/bbl",
    description:
      "West Texas Intermediate crude oil price. Sharp declines may signal demand destruction.",
    signalDirection: "positive",
    weight: 0.25,
    format: "currency",
    decimals: 2,
  },
  {
    id: "copper",
    name: "Copper Price",
    shortName: "Copper",
    category: "commodity",
    source: "alpha_vantage",
    seriesId: "COPPER",
    unit: "$/lb",
    description:
      "Dr. Copper — an industrial bellwether. Declining copper prices suggest weakening global demand.",
    signalDirection: "positive",
    weight: 0.25,
    format: "currency",
    decimals: 4,
  },
  {
    id: "silver",
    name: "Silver Price",
    shortName: "Silver",
    category: "commodity",
    source: "alpha_vantage",
    seriesId: "SILVER",
    unit: "$/oz",
    description:
      "Silver spot price. Both an industrial and precious metal — mixed recession signals.",
    signalDirection: "positive",
    weight: 0.25,
    format: "currency",
    decimals: 2,
  },
];

/** Get indicators by source */
export function getIndicatorsBySource(source: "fred" | "alpha_vantage") {
  return INDICATOR_CONFIGS.filter((c) => c.source === source);
}

/** Get indicators by category */
export function getIndicatorsByCategory(category: string) {
  return INDICATOR_CONFIGS.filter((c) => c.category === category);
}

// Pre-built Map for O(1) lookup by ID (js-set-map-lookups)
const CONFIG_BY_ID = new Map(INDICATOR_CONFIGS.map((c) => [c.id, c]));

/** Get a single indicator config by ID */
export function getIndicatorConfig(id: string) {
  return CONFIG_BY_ID.get(id);
}

/** All FRED series IDs needed */
export function getAllFredSeriesIds(): string[] {
  return INDICATOR_CONFIGS.filter((c) => c.source === "fred").map(
    (c) => c.seriesId
  );
}
