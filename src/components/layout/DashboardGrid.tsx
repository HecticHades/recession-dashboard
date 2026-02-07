import { type ReactNode } from "react";

export default function DashboardGrid({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-6">{children}</div>
    </main>
  );
}
