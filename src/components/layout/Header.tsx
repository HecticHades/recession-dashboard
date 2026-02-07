"use client";

import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-secondary bg-bg-primary/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 sm:px-8">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          {/* Logo mark — geometric diamond with pulse */}
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div
              className="absolute inset-0 rounded-lg opacity-20"
              style={{
                background: "linear-gradient(135deg, var(--accent), transparent)",
              }}
            />
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Seismograph line */}
              <polyline
                points="2 12 6 12 9 4 12 20 15 8 18 12 22 12"
                stroke="var(--accent)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div>
            <h1
              className="text-base font-medium tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Recession Dashboard
            </h1>
            <p className="hidden text-[11px] tracking-wide text-text-muted sm:block">
              MACRO ECONOMIC RISK MONITOR
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Live data indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-border-secondary bg-bg-secondary/50 px-4 py-1.5 text-[11px] tracking-wide text-text-muted backdrop-blur-sm sm:flex">
            <span className="relative flex h-2 w-2">
              <span
                className="absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{
                  backgroundColor: "var(--color-success)",
                  animation: "live-pulse 2s ease-in-out infinite",
                }}
              />
              <span
                className="relative inline-flex h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--color-success)" }}
              />
            </span>
            LIVE
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
