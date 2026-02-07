"use client";

import { useState } from "react";
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
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      {/* Section header — clickable to collapse */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="section-header mb-4 w-full cursor-pointer"
        aria-expanded={expanded}
      >
        <h3
          className="text-sm font-medium tracking-tight text-text-secondary"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {categoryLabels[category] ?? category}
        </h3>
        <span className="text-[10px] tracking-wide text-text-muted">
          {indicators.length} indicators
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-auto text-text-muted transition-transform duration-300"
          style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)" }}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
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
      )}
    </div>
  );
}
