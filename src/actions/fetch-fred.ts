"use server";

import { fetchFredSeries, fetchMultipleFredSeries, fetchYieldCurveData } from "@/lib/data/fred";
import type { DataPoint } from "@/lib/types";

/**
 * Server Action: Fetch a single FRED series.
 * API key is hidden from the client.
 */
export async function getFredSeries(
  seriesId: string,
  observationStart?: string,
  limit?: number
): Promise<DataPoint[]> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY not configured");
  }

  try {
    return await fetchFredSeries(seriesId, apiKey, {
      observationStart,
      limit,
    });
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error);
    throw error;
  }
}

/**
 * Server Action: Fetch multiple FRED series in parallel.
 */
export async function getMultipleFredSeries(
  seriesIds: string[],
  observationStart?: string,
  limit?: number
): Promise<Record<string, DataPoint[]>> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY not configured");
  }

  try {
    return await fetchMultipleFredSeries(seriesIds, apiKey, {
      observationStart,
      limit,
    });
  } catch (error) {
    console.error("Error fetching multiple FRED series:", error);
    throw error;
  }
}

/**
 * Server Action: Fetch yield curve data points.
 */
export async function getYieldCurveData(): Promise<
  { maturity: string; rate: number }[]
> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) {
    throw new Error("FRED_API_KEY not configured");
  }

  try {
    return await fetchYieldCurveData(apiKey);
  } catch (error) {
    console.error("Error fetching yield curve data:", error);
    throw error;
  }
}
