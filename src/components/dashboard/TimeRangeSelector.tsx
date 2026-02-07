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
    <div className="flex gap-0.5 rounded-xl border border-border-secondary bg-bg-secondary/50 p-1 backdrop-blur-sm">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className="relative rounded-lg px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-300"
          style={{
            color: selected === range ? "var(--bg-primary)" : "var(--text-muted)",
            backgroundColor: selected === range ? "var(--accent)" : "transparent",
            boxShadow: selected === range ? "0 2px 8px rgba(212, 168, 83, 0.25)" : "none",
          }}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
