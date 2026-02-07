"use client";

import { useMemo } from "react";
import { useMultipleFredSeries } from "./use-fred-series";
import { REGIONAL_CONFIGS, getAllRegionalSeriesIds } from "@/lib/data/regional-series-config";
import { normalizeAll } from "@/lib/scoring/normalize";
import { computeRecessionScore } from "@/lib/scoring/recession-score";

export interface RegionalScore {
  regionCode: string;
  score: number;
  indicators: number;
  isLoading: boolean;
}

const allRegionalSeriesIds = getAllRegionalSeriesIds();

export function useRegionalScores(): RegionalScore[] {
  const {
    data: regionalData,
    isLoading,
  } = useMultipleFredSeries(allRegionalSeriesIds, undefined, 500);

  const scores = useMemo(() => {
    return Object.entries(REGIONAL_CONFIGS).map(([regionCode, configs]) => {
      if (!regionalData || isLoading) {
        return { regionCode, score: 0, indicators: 0, isLoading: true };
      }

      // Check how many indicators have data
      const availableConfigs = configs.filter(
        (c) => regionalData[c.seriesId] && regionalData[c.seriesId].length >= 10
      );

      if (availableConfigs.length === 0) {
        return { regionCode, score: 0, indicators: 0, isLoading: false };
      }

      // Normalize and compute recession score using existing pipeline
      const signals = normalizeAll(availableConfigs, regionalData);
      if (signals.length === 0) {
        return { regionCode, score: 0, indicators: 0, isLoading: false };
      }

      const recessionScore = computeRecessionScore(signals);
      return {
        regionCode,
        score: recessionScore.overall,
        indicators: availableConfigs.length,
        isLoading: false,
      };
    });
  }, [regionalData, isLoading]);

  return scores;
}
