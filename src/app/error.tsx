"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-xl border p-8 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-secondary)",
        }}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-danger)", opacity: 0.15 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-danger)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2
          className="mb-2 text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Something went wrong
        </h2>
        <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={reset}
          className="rounded-lg px-5 py-2.5 text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--bg-card)",
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
