import type { IndicatorConfig } from "../types";

/**
 * Regional economic indicator definitions with FRED/OECD series IDs.
 * Each region maps to 5 indicators covering leading, coincident, lagging,
 * and financial stress categories.
 */
export const REGIONAL_CONFIGS: Record<string, IndicatorConfig[]> = {
  // ============================================================
  // EUROZONE
  // ============================================================
  EU: [
    {
      id: "eu_cli",
      name: "OECD Composite Leading Indicator (Eurozone)",
      shortName: "EU CLI",
      category: "leading",
      source: "fred",
      seriesId: "EALOLITONOSTSAM",
      unit: "index",
      description:
        "OECD composite leading indicator for the Euro Area. Values above 100 signal expansion.",
      signalDirection: "positive",
      weight: 0.35,
      format: "index",
      decimals: 2,
    },
    {
      id: "eu_unemployment",
      name: "Harmonised Unemployment Rate (Eurozone)",
      shortName: "EU Unemp.",
      category: "coincident",
      source: "fred",
      seriesId: "LRHUTTTTEZM156S",
      unit: "%",
      description:
        "Harmonised unemployment rate for the Euro Area. Rising unemployment signals economic contraction.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "eu_industrial_prod",
      name: "Industrial Production (Eurozone)",
      shortName: "EU Ind. Prod.",
      category: "coincident",
      source: "fred",
      seriesId: "EA19PRINTO01IXOBM",
      unit: "index",
      description:
        "Industrial production index for the Euro Area 19. Measures real output of manufacturing and industry.",
      signalDirection: "positive",
      weight: 0.25,
      format: "index",
      decimals: 2,
    },
    {
      id: "eu_cpi",
      name: "CPI All Items (Eurozone)",
      shortName: "EU CPI",
      category: "lagging",
      source: "fred",
      seriesId: "EA19CPALTT01GYM",
      unit: "%",
      description:
        "Consumer price index growth rate for the Euro Area 19. Persistently high inflation can trigger ECB tightening.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "eu_euribor",
      name: "3-Month Euribor Rate",
      shortName: "Euribor 3M",
      category: "financial_stress",
      source: "fred",
      seriesId: "IR3TIB01EZM156N",
      unit: "%",
      description:
        "3-month Euro Interbank Offered Rate. Rising rates indicate tightening financial conditions in the Eurozone.",
      signalDirection: "negative",
      weight: 0.2,
      format: "percent",
      decimals: 2,
    },
  ],

  // ============================================================
  // UNITED KINGDOM
  // ============================================================
  UK: [
    {
      id: "uk_cli",
      name: "OECD Composite Leading Indicator (UK)",
      shortName: "UK CLI",
      category: "leading",
      source: "fred",
      seriesId: "GBRLOLITONOSTSAM",
      unit: "index",
      description:
        "OECD composite leading indicator for the United Kingdom. Values above 100 signal expansion.",
      signalDirection: "positive",
      weight: 0.35,
      format: "index",
      decimals: 2,
    },
    {
      id: "uk_unemployment",
      name: "Unemployment Rate (UK)",
      shortName: "UK Unemp.",
      category: "coincident",
      source: "fred",
      seriesId: "LRHUTTTTGBM156S",
      unit: "%",
      description:
        "Harmonised unemployment rate for the United Kingdom. Rising unemployment signals labour market deterioration.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "uk_industrial_prod",
      name: "Industrial Production (UK)",
      shortName: "UK Ind. Prod.",
      category: "coincident",
      source: "fred",
      seriesId: "GBRPRINTO01IXOBM",
      unit: "index",
      description:
        "Industrial production index for the United Kingdom. Measures real output of manufacturing and industry.",
      signalDirection: "positive",
      weight: 0.25,
      format: "index",
      decimals: 2,
    },
    {
      id: "uk_cpi",
      name: "Consumer Price Index (UK)",
      shortName: "UK CPI",
      category: "lagging",
      source: "fred",
      seriesId: "GBRCPIALLMINMEI",
      unit: "index",
      description:
        "Consumer price index for the United Kingdom. Measures headline inflation across all items.",
      signalDirection: "negative",
      weight: 0.25,
      format: "index",
      decimals: 1,
    },
    {
      id: "uk_bank_rate",
      name: "3-Month Interbank Rate (UK)",
      shortName: "UK Rate 3M",
      category: "financial_stress",
      source: "fred",
      seriesId: "IR3TIB01GBM156N",
      unit: "%",
      description:
        "3-month interbank rate for the United Kingdom. Rising rates indicate tightening monetary conditions.",
      signalDirection: "negative",
      weight: 0.2,
      format: "percent",
      decimals: 2,
    },
  ],

  // ============================================================
  // CHINA
  // ============================================================
  CN: [
    {
      id: "cn_cli",
      name: "OECD Composite Leading Indicator (China)",
      shortName: "CN CLI",
      category: "leading",
      source: "fred",
      seriesId: "CHNLOLITONOSTSAM",
      unit: "index",
      description:
        "OECD composite leading indicator for China. Values above 100 signal expansion.",
      signalDirection: "positive",
      weight: 0.35,
      format: "index",
      decimals: 2,
    },
    {
      id: "cn_cpi",
      name: "Consumer Price Index (China)",
      shortName: "CN CPI",
      category: "lagging",
      source: "fred",
      seriesId: "CHNCPIALLMINMEI",
      unit: "index",
      description:
        "Consumer price index for China. Measures headline inflation across all items.",
      signalDirection: "negative",
      weight: 0.25,
      format: "index",
      decimals: 1,
    },
    {
      id: "cn_industrial_prod",
      name: "Industrial Production (China)",
      shortName: "CN Ind. Prod.",
      category: "coincident",
      source: "fred",
      seriesId: "CHNPRINTO01IXPYM",
      unit: "index",
      description:
        "Industrial production index for China. Measures real output growth of manufacturing and industry.",
      signalDirection: "positive",
      weight: 0.3,
      format: "index",
      decimals: 2,
    },
    {
      id: "cn_unemployment",
      name: "Unemployment Rate (China)",
      shortName: "CN Unemp.",
      category: "coincident",
      source: "fred",
      seriesId: "LRUN64TTCNM156S",
      unit: "%",
      description:
        "Unemployment rate for China (ages 15-64). Rising unemployment signals weakening economic conditions.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "cn_interbank",
      name: "3-Month Interbank Rate (China)",
      shortName: "CN Rate 3M",
      category: "financial_stress",
      source: "fred",
      seriesId: "IR3TIB01CNM156N",
      unit: "%",
      description:
        "3-month interbank rate for China. Reflects liquidity conditions in the Chinese banking system.",
      signalDirection: "negative",
      weight: 0.2,
      format: "percent",
      decimals: 2,
    },
  ],

  // ============================================================
  // JAPAN
  // ============================================================
  JP: [
    {
      id: "jp_cli",
      name: "OECD Composite Leading Indicator (Japan)",
      shortName: "JP CLI",
      category: "leading",
      source: "fred",
      seriesId: "JPNLOLITONOSTSAM",
      unit: "index",
      description:
        "OECD composite leading indicator for Japan. Values above 100 signal expansion.",
      signalDirection: "positive",
      weight: 0.35,
      format: "index",
      decimals: 2,
    },
    {
      id: "jp_unemployment",
      name: "Unemployment Rate (Japan)",
      shortName: "JP Unemp.",
      category: "coincident",
      source: "fred",
      seriesId: "LRHUTTTTJPM156S",
      unit: "%",
      description:
        "Harmonised unemployment rate for Japan. Rising unemployment signals labour market deterioration.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "jp_industrial_prod",
      name: "Industrial Production (Japan)",
      shortName: "JP Ind. Prod.",
      category: "coincident",
      source: "fred",
      seriesId: "JPNPRINTO01IXOBM",
      unit: "index",
      description:
        "Industrial production index for Japan. Measures real output of manufacturing and industry.",
      signalDirection: "positive",
      weight: 0.25,
      format: "index",
      decimals: 2,
    },
    {
      id: "jp_cpi",
      name: "Consumer Price Index (Japan)",
      shortName: "JP CPI",
      category: "lagging",
      source: "fred",
      seriesId: "JPNCPIALLMINMEI",
      unit: "index",
      description:
        "Consumer price index for Japan. Measures headline inflation; Japan has historically battled deflation.",
      signalDirection: "negative",
      weight: 0.25,
      format: "index",
      decimals: 1,
    },
    {
      id: "jp_interbank",
      name: "3-Month Interbank Rate (Japan)",
      shortName: "JP Rate 3M",
      category: "financial_stress",
      source: "fred",
      seriesId: "IR3TIB01JPM156N",
      unit: "%",
      description:
        "3-month interbank rate for Japan. Reflects Bank of Japan monetary policy stance and liquidity conditions.",
      signalDirection: "negative",
      weight: 0.2,
      format: "percent",
      decimals: 2,
    },
  ],

  // ============================================================
  // EMERGING MARKETS (Brazil as primary proxy)
  // ============================================================
  EM: [
    {
      id: "em_cli",
      name: "OECD Composite Leading Indicator (Brazil)",
      shortName: "EM CLI",
      category: "leading",
      source: "fred",
      seriesId: "BRALOLITONOSTSAM",
      unit: "index",
      description:
        "OECD composite leading indicator for Brazil (emerging market proxy). Values above 100 signal expansion.",
      signalDirection: "positive",
      weight: 0.35,
      format: "index",
      decimals: 2,
    },
    {
      id: "em_cpi",
      name: "Consumer Price Index (Brazil)",
      shortName: "EM CPI",
      category: "lagging",
      source: "fred",
      seriesId: "BRACPIALLMINMEI",
      unit: "index",
      description:
        "Consumer price index for Brazil. Emerging markets often face higher and more volatile inflation.",
      signalDirection: "negative",
      weight: 0.25,
      format: "index",
      decimals: 1,
    },
    {
      id: "em_industrial_prod",
      name: "Industrial Production (Brazil)",
      shortName: "EM Ind. Prod.",
      category: "coincident",
      source: "fred",
      seriesId: "BRAPRINTO01IXOBM",
      unit: "index",
      description:
        "Industrial production index for Brazil. Measures real output of manufacturing and industry.",
      signalDirection: "positive",
      weight: 0.25,
      format: "index",
      decimals: 2,
    },
    {
      id: "em_unemployment",
      name: "Unemployment Rate (Brazil)",
      shortName: "EM Unemp.",
      category: "coincident",
      source: "fred",
      seriesId: "LRHUTTTTBRM156S",
      unit: "%",
      description:
        "Harmonised unemployment rate for Brazil. Rising unemployment signals weakening economic conditions.",
      signalDirection: "negative",
      weight: 0.25,
      format: "percent",
      decimals: 1,
    },
    {
      id: "em_interbank",
      name: "3-Month Interbank Rate (Brazil)",
      shortName: "EM Rate 3M",
      category: "financial_stress",
      source: "fred",
      seriesId: "IR3TIB01BRM156N",
      unit: "%",
      description:
        "3-month interbank rate for Brazil. High rates reflect tight monetary policy and elevated risk premiums.",
      signalDirection: "negative",
      weight: 0.2,
      format: "percent",
      decimals: 2,
    },
  ],
};

/** Get FRED series IDs for a specific region */
export function getRegionalSeriesIds(regionCode: string): string[] {
  return (REGIONAL_CONFIGS[regionCode] ?? []).map((c) => c.seriesId);
}

/** Get all FRED series IDs across all regions */
export function getAllRegionalSeriesIds(): string[] {
  return Object.values(REGIONAL_CONFIGS)
    .flat()
    .map((c) => c.seriesId);
}
