"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatisticItem {
  id: string;
  target: number;
  suffix: string;
  finalDisplay: string;
  formatValue: (progress: number) => string;
  lines: string[];
  ariaLabel: string;
}

const DURATION_MS = 1800; // 1.8 seconds synchronized duration

// Cubic ease-out deceleration curve: swift entry, graceful deceleration to rest
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const STATISTICS: StatisticItem[] = [
  {
    id: "customers",
    target: 1000000,
    suffix: "+",
    finalDisplay: "1M+",
    formatValue: (progress: number) => {
      if (progress >= 1) return "1M";
      if (progress === 0) return "0";
      // Calm, readable progression across tenths of a million (0.1M, 0.2M ... 0.9M, 1M)
      const tenths = Math.round(progress * 10) / 10;
      if (tenths === 0) return "0";
      if (tenths >= 1) return "1M";
      return `${tenths.toFixed(1)}M`;
    },
    lines: ["Happy Customers across", "the globe"],
    ariaLabel: "1M+ Happy Customers across the globe",
  },
  {
    id: "legacy",
    target: 50,
    suffix: "+",
    finalDisplay: "50+",
    formatValue: (progress: number) => {
      if (progress >= 1) return "50";
      return Math.floor(progress * 50).toString();
    },
    lines: ["Years of legacy"],
    ariaLabel: "50+ Years of legacy",
  },
  {
    id: "states",
    target: 14,
    suffix: "+",
    finalDisplay: "14+",
    formatValue: (progress: number) => {
      if (progress >= 1) return "14";
      return Math.floor(progress * 14).toString();
    },
    lines: ["States Connected"],
    ariaLabel: "14+ States Connected",
  },
];

export function TrustBanner() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const [counts, setCounts] = useState<{ [key: string]: string }>({
    customers: "0",
    legacy: "0",
    states: "0",
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (hasTriggeredRef.current) return;

    function runAnimation() {
      let startTime: number | null = null;

      function step(timestamp: number) {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(1, elapsed / DURATION_MS);
        const easedProgress = easeOutCubic(rawProgress);

        setCounts({
          customers: STATISTICS[0].formatValue(easedProgress),
          legacy: STATISTICS[1].formatValue(easedProgress),
          states: STATISTICS[2].formatValue(easedProgress),
        });

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Lock into exact target values
          setCounts({
            customers: "1M",
            legacy: "50",
            states: "14",
          });
          rafRef.current = null;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          observer.disconnect();

          const prefersReducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          if (prefersReducedMotion) {
            setCounts({
              customers: "1M",
              legacy: "50",
              states: "14",
            });
            return;
          }

          runAnimation();
        }
      },
      {
        threshold: 0.2, // Trigger when 20% visible in viewport
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trust-banner"
      className="py-3 sm:py-6 lg:py-8 bg-transparent"
      aria-label="Ruchi Foodline Trust & Legacy Statistics"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Contained, unified editorial banner canvas */}
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200/80 bg-[#fbfaf7] shadow-2xs min-h-[170px] sm:min-h-[240px] md:min-h-[30vh] lg:min-h-[35vh] flex items-center justify-center">
          {/* Accessible Static Content for Screen Readers */}
          <div className="sr-only">
            <h2>Ruchi Foodline Trust Statistics</h2>
            <ul>
              {STATISTICS.map((stat) => (
                <li key={stat.id}>{stat.ariaLabel}</li>
              ))}
            </ul>
          </div>

          {/* Three-column statistics grid */}
          <div
            className="w-full grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0 sm:divide-x divide-stone-200/80 py-4 sm:py-9 lg:py-12"
            role="list"
          >
            {STATISTICS.map((stat) => {
              const currentVal = counts[stat.id] ?? "0";

              return (
                <div
                  key={stat.id}
                  role="listitem"
                  className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-10 py-3 sm:py-2"
                >
                  {/* Oversized, bold, maximalist numeral */}
                  <div
                    aria-hidden="true"
                    className="font-serif font-bold text-[#0e6337] tracking-tight leading-none text-4xl sm:text-5xl lg:text-[clamp(3.25rem,5.5vw,5.75rem)] select-text flex items-baseline justify-center"
                  >
                    <span className="tabular-nums">{currentVal}</span>
                    <span className="select-text">{stat.suffix}</span>
                  </div>

                  {/* Supporting text with controlled line breaks and baseline alignment */}
                  <div className="mt-1 sm:mt-3.5 lg:mt-4 min-h-auto sm:min-h-[2.75rem] flex flex-col justify-start">
                    <p className="font-sans text-xs sm:text-sm lg:text-base font-medium text-stone-700 leading-snug tracking-normal">
                      {stat.lines.map((line, idx) => (
                        <span key={idx} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export as StatsCounter for compatibility
export { TrustBanner as StatsCounter };
