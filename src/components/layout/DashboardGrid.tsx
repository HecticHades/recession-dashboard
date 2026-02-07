import { type ReactNode } from "react";

export default function DashboardGrid({ children }: { children: ReactNode }) {
  return (
    <main className="relative mx-auto max-w-[1600px] px-5 py-8 sm:px-8" style={{ zIndex: 1 }}>
      {/* Dot grid background decoration */}
      <div
        className="dot-grid pointer-events-none absolute inset-0 opacity-30"
        style={{ zIndex: -1 }}
      />
      <div className="flex flex-col gap-8">{children}</div>
    </main>
  );
}
