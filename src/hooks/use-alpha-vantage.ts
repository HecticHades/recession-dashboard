"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllCommodityData } from "@/actions/fetch-alpha-vantage";
import type { DataPoint } from "@/lib/types";

/**
 * Hook to fetch all commodity data via server action.
 * Uses longer staleTime to conserve Alpha Vantage's 25 req/day limit.
 */
export function useAlphaVantageCommodities() {
  return useQuery<Record<string, DataPoint[]>>({
    queryKey: ["alpha-vantage-commodities"],
    queryFn: () => getAllCommodityData(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
}
