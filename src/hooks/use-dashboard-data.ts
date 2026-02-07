"use client";

import { useMemo } from "react";
import { useMultipleFredSeries } from "./use-fred-series";
import { useAlphaVantageCommodities } from "./use-alpha-vantage";
import { INDICATOR_CONFIGS, getIndicatorsBySource } from "@/lib/data/series-config";
import { normalizeAll } from "@/lib/scoring/normalize";
import { computeRecessionScore } from "@/lib/scoring/recession-score";
import { detectCyclePosition } from "@/lib/scoring/cycle-position";
import type { RecessionScore, CyclePosition, DataPoint, NormalizedSignal } from "@/lib/types";

const fredConfigs = getIndicatorsBySource("fred");
const fredSeriesIds = fredConfigs.map((c) => c.seriesId);

interface DashboardData {
  fredData: Record<string, DataPoint[]>;
  avData: Record<string, DataPoint[]>;
  allData: Record<string, DataPoint[]>;
  signals: NormalizedSignal[];
  recessionScore: RecessionScore | null;
  cyclePosition: CyclePosition | null;
  isLoading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const {
    data: fredData,
    isLoading: fredLoading,
    error: fredError,
  } = useMultipleFredSeries(fredSeriesIds, undefined, 500);

  const {
    data: avData,
    error: avError,
  } = useAlphaVantageCommodities();

  const isLoading = fredLoading;

  const allData = useMemo(() => {
    return { ...(fredData ?? {}), ...(avData ?? {}) };
  }, [fredData, avData]);

  // Depend only on allData which already captures both sources (rerender-dependencies)
  const signals = useMemo(() => {
    if (Object.keys(allData).length === 0) return [];
    return normalizeAll(INDICATOR_CONFIGS, allData);
  }, [allData]);

  const recessionScore = useMemo(() => {
    if (signals.length === 0) return null;
    return computeRecessionScore(signals);
  }, [signals]);

  const cyclePosition = useMemo(() => {
    if (signals.length === 0) return null;
    return detectCyclePosition(signals);
  }, [signals]);

  return {
    fredData: fredData ?? {},
    avData: avData ?? {},
    allData,
    signals,
    recessionScore,
    cyclePosition,
    isLoading,
    error: fredError || avError ? [fredError && String(fredError), avError && String(avError)].filter(Boolean).join('; ') : null,
  };
}
