"use client";

import type { TimeRange } from "@/lib/types";

const RANGES: TimeRange[] = ["1M", "3M", "6M", "1Y", "2Y", "5Y", "MAX"];

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

export default function TimeRangeSelector({
  selected,
  onChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-border-secondary bg-bg-secondary p-1">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            selected === range
              ? "bg-chart-1 text-white"
              : "text-text-muted hover:text-text-secondary hover:bg-bg-tertiary"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
