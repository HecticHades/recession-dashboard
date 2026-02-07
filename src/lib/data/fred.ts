import type { DataPoint, FredApiResponse } from "../types";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred";
const BATCH_DELAY_MS = 500;

/**
 * Fetch a single FRED series. Only call from server actions (API key hidden).
 */
export async function fetchFredSeries(
  seriesId: string,
  apiKey: string,
  options?: {
    observationStart?: string;
    observationEnd?: string;
    limit?: number;
    sortOrder?: "asc" | "desc";
  }
): Promise<DataPoint[]> {
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: "json",
    sort_order: options?.sortOrder ?? "desc",
    limit: String(options?.limit ?? 500),
  });

  if (options?.observationStart) {
    params.set("observation_start", options.observationStart);
  }
  if (options?.observationEnd) {
    params.set("observation_end", options.observationEnd);
  }

  const url = `${FRED_BASE_URL}/series/observations?${params}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(
      `FRED API error for ${seriesId}: ${res.status} ${res.statusText}`
    );
  }

  const data: FredApiResponse = await res.json();

  if (!data.observations || !Array.isArray(data.observations)) {
    throw new Error(`FRED API returned invalid response for ${seriesId}: missing observations array`);
  }

  return data.observations
    .filter((obs) => obs.value !== ".")
    .map((obs) => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }))
    .filter((d) => !isNaN(d.value));
}

/**
 * Fetch multiple FRED series in parallel. Respects rate limits by batching.
 */
export async function fetchMultipleFredSeries(
  seriesIds: string[],
  apiKey: string,
  options?: {
    observationStart?: string;
    limit?: number;
  }
): Promise<Record<string, DataPoint[]>> {
  const results: Record<string, DataPoint[]> = {};

  // FRED allows 120 req/min — batch in groups of 10 with small delays
  const batchSize = 10;
  for (let i = 0; i < seriesIds.length; i += batchSize) {
    const batch = seriesIds.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map((id) => fetchFredSeries(id, apiKey, options))
    );

    batch.forEach((id, idx) => {
      const result = batchResults[idx];
      if (result.status === "fulfilled") {
        results[id] = result.value;
      } else {
        console.error(`Failed to fetch FRED series ${id}:`, result.reason);
        results[id] = [];
      }
    });

    // Exponential backoff between batches to avoid rate limiting
    if (i + batchSize < seriesIds.length) {
      const batchIndex = Math.floor(i / batchSize);
      const delay = Math.min(BATCH_DELAY_MS * Math.pow(1.5, batchIndex), 5000);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return results;
}

/**
 * Yield curve specific fetch — gets multiple Treasury rates for the curve.
 */
export async function fetchYieldCurveData(
  apiKey: string
): Promise<{ maturity: string; rate: number }[]> {
  const seriesMap: Record<string, string> = {
    "1M": "DGS1MO",
    "3M": "DGS3MO",
    "6M": "DGS6MO",
    "1Y": "DGS1",
    "2Y": "DGS2",
    "3Y": "DGS3",
    "5Y": "DGS5",
    "7Y": "DGS7",
    "10Y": "DGS10",
    "20Y": "DGS20",
    "30Y": "DGS30",
  };

  const entries = Object.entries(seriesMap);
  const results = await Promise.allSettled(
    entries.map(([, seriesId]) =>
      fetchFredSeries(seriesId, apiKey, { limit: 5, sortOrder: "desc" })
    )
  );

  return entries
    .map(([maturity], idx) => {
      const result = results[idx];
      if (result.status === "fulfilled" && result.value.length > 0) {
        return { maturity, rate: result.value[0].value };
      }
      return { maturity, rate: NaN };
    })
    .filter((d) => !isNaN(d.rate));
}
