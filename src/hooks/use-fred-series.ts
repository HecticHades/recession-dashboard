"use client";

import { useQuery } from "@tanstack/react-query";
import { getFredSeries, getMultipleFredSeries, getYieldCurveData } from "@/actions/fetch-fred";
import type { DataPoint } from "@/lib/types";

/**
 * Hook to fetch a single FRED series via server action.
 * Uses TanStack Query for caching (15min stale, 1hr GC).
 */
export function useFredSeries(
  seriesId: string,
  observationStart?: string,
  limit?: number
) {
  return useQuery<DataPoint[]>({
    queryKey: ["fred", seriesId, observationStart, limit],
    queryFn: () => getFredSeries(seriesId, observationStart, limit),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Hook to fetch multiple FRED series in a single batch.
 */
export function useMultipleFredSeries(
  seriesIds: string[],
  observationStart?: string,
  limit?: number
) {
  return useQuery<Record<string, DataPoint[]>>({
    queryKey: ["fred-batch", seriesIds.join(","), observationStart, limit],
    queryFn: () => getMultipleFredSeries(seriesIds, observationStart, limit),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: seriesIds.length > 0,
  });
}

/**
 * Hook to fetch yield curve data.
 */
export function useYieldCurve() {
  return useQuery<{ maturity: string; rate: number }[]>({
    queryKey: ["yield-curve"],
    queryFn: () => getYieldCurveData(),
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
