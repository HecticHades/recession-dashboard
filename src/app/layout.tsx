import type { Metadata } from "next";
import { Outfit, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";
import Header from "@/components/layout/Header";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Recession Dashboard | Macro Economic Risk Monitor",
  description:
    "Real-time recession probability dashboard aggregating 20+ economic indicators from FRED and Alpha Vantage into composite risk scores and economic cycle positioning.",
  keywords: [
    "recession",
    "economy",
    "dashboard",
    "FRED",
    "yield curve",
    "macro",
    "indicators",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        ` }} />
      </head>
      <body
        className={`${outfit.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable} antialiased`}
        style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
