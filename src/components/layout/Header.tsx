"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-secondary bg-bg-primary/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--chart-1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text-primary">
              Recession Dashboard
            </h1>
            <p className="hidden text-xs text-text-muted sm:block">
              Macro Economic Risk Monitor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1.5 rounded-lg border border-border-secondary bg-bg-secondary px-3 py-1.5 text-xs text-text-muted sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" />
            Live Data
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
