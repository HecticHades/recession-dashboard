import type { DataPoint } from "../types";

const AV_BASE_URL = "https://www.alphavantage.co/query";

type CommodityFunction = "WTI" | "BRENT" | "NATURAL_GAS" | "COPPER" | "ALUMINUM" | "WHEAT" | "CORN" | "COTTON" | "SUGAR" | "COFFEE";

/**
 * Fetch commodity data from Alpha Vantage.
 * Only call from server actions (API key hidden).
 */
export async function fetchCommodityData(
  commodity: CommodityFunction | "GOLD" | "SILVER",
  apiKey: string,
  interval: "daily" | "weekly" | "monthly" = "monthly"
): Promise<DataPoint[]> {
  let functionName: string;
  let dataKey: string;

  if (commodity === "GOLD" || commodity === "SILVER") {
    // Precious metals use a different endpoint
    functionName = commodity === "GOLD" ? "GOLD" : "SILVER";
    dataKey = "data";
  } else {
    functionName = commodity;
    dataKey = "data";
  }

  const params = new URLSearchParams({
    function: functionName,
    interval,
    apikey: apiKey,
  });

  const url = `${AV_BASE_URL}?${params}`;
  const res = await fetch(url, { next: { revalidate: 7200 } }); // 2hr cache

  if (!res.ok) {
    throw new Error(
      `Alpha Vantage API error for ${commodity}: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();

  if (!json || typeof json !== 'object') {
    throw new Error(`Alpha Vantage API returned invalid response for ${commodity}`);
  }

  // Check for rate limit or error messages
  if (json["Note"] || json["Information"]) {
    throw new Error(`Alpha Vantage rate limit for ${commodity}: ${json["Note"] || json["Information"]}`);
  }

  const entries: Array<{ date: string; value: string }> = json[dataKey] ?? [];

  return entries
    .filter((e) => e.value !== "." && e.value !== "")
    .map((e) => ({
      date: e.date,
      value: parseFloat(e.value),
    }))
    .filter((d) => !isNaN(d.value))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Fetch all commodity indicators.
 * Staggers requests to respect 25 req/day limit on free tier.
 */
export async function fetchAllCommodities(
  apiKey: string
): Promise<Record<string, DataPoint[]>> {
  const commodities = ["GOLD", "SILVER", "WTI", "COPPER"] as const;
  const results: Record<string, DataPoint[]> = {};

  // Sequential to respect rate limits
  for (const commodity of commodities) {
    try {
      results[commodity] = await fetchCommodityData(
        commodity as CommodityFunction | "GOLD" | "SILVER",
        apiKey,
        "monthly"
      );
    } catch (error) {
      console.error(`Failed to fetch ${commodity}:`, error);
      results[commodity] = [];
    }
    // 1s delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return results;
}
