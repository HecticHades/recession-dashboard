"use client";

import type { IndicatorConfig, DataPoint } from "@/lib/types";
import { categoryLabels } from "@/lib/utils";
import IndicatorCard from "./IndicatorCard";

interface IndicatorPanelProps {
  category: string;
  indicators: IndicatorConfig[];
  data: Record<string, DataPoint[]>;
  isLoading: boolean;
}

export default function IndicatorPanel({
  category,
  indicators,
  data,
  isLoading,
}: IndicatorPanelProps) {
  return (
    <div className="animate-fade-in">
      <h3 className="mb-3 text-sm font-semibold text-text-secondary">
        {categoryLabels[category] ?? category}
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {indicators.map((config) => (
          <IndicatorCard
            key={config.id}
            config={config}
            data={data[config.seriesId] ?? []}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
