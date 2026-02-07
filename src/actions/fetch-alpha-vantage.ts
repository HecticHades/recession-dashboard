"use server";

import { fetchAllCommodities } from "@/lib/data/alpha-vantage";
import type { DataPoint } from "@/lib/types";

/**
 * Server Action: Fetch all commodity data from Alpha Vantage.
 * API key is hidden from the client.
 */
export async function getAllCommodityData(): Promise<
  Record<string, DataPoint[]>
> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error("ALPHA_VANTAGE_API_KEY not configured");
  }

  try {
    return await fetchAllCommodities(apiKey);
  } catch (error) {
    console.error("Error fetching commodity data:", error);
    throw error;
  }
}
