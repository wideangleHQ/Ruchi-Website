"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatisticItem {
  id: "customers" | "legacy" | "states";
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
      if (progress <= 0) return "0";
      // Calm, readable progression across tenths of a million (0.1M, 0.2M ... 0.9M, 1M)
      const tenths = Math.round(progress * 10) / 10;
      if (tenths <= 0) return "0";
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

  const latestCountsRef = useRef<{ [key: string]: string }>({
    customers: "0",
    legacy: "0",
    states: "0",
  });

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || hasTriggeredRef.current) return;

    function runAnimation() {
      let startTime: number | null = null;

      function step(timestamp: number) {
        if (startTime === null) {
          startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(1, elapsed / DURATION_MS);
        const easedProgress = easeOutCubic(rawProgress);

        const nextCustomers = STATISTICS[0].formatValue(easedProgress);
        const nextLegacy = STATISTICS[1].formatValue(easedProgress);
        const nextStates = STATISTICS[2].formatValue(easedProgress);

        // Optimize mobile renders: only trigger state update when formatted value changes
        const prev = latestCountsRef.current;
        if (
          prev.customers !== nextCustomers ||
          prev.legacy !== nextLegacy ||
          prev.states !== nextStates
        ) {
          latestCountsRef.current = {
            customers: nextCustomers,
            legacy: nextLegacy,
            states: nextStates,
          };
          setCounts({
            customers: nextCustomers,
            legacy: nextLegacy,
            states: nextStates,
          });
        }

        if (rawProgress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          // Lock into exact target values
          latestCountsRef.current = {
            customers: "1M",
            legacy: "50",
            states: "14",
          };
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

    const triggerIfVisible = () => {
      if (hasTriggeredRef.current || !node) return;

      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Section is genuinely visible in viewport:
      // - Its top has entered the viewport (with a small 20px threshold)
      // - Its bottom is still visible (hasn't been scrolled past completely)
      const isVisibleInViewport =
        rect.top < viewportHeight - 20 && rect.bottom > 20;

      if (isVisibleInViewport) {
        hasTriggeredRef.current = true;
        cleanup();

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
    };

    // Mobile-optimized IntersectionObserver:
    // Multiple thresholds [0, 0.05, 0.1, 0.2] ensure detection even on small viewports
    // rootMargin accounts for mobile bottom nav and browser address bars
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && (entry.isIntersecting || entry.intersectionRatio > 0)) {
            triggerIfVisible();
          }
        },
        {
          threshold: [0, 0.05, 0.1, 0.2],
          rootMargin: "0px 0px -20px 0px",
        }
      );
      observer.observe(node);
    }

    // Scroll & resize fallback listener for mobile momentum scroll & virtual keyboards
    const handleScrollOrResize = () => {
      triggerIfVisible();
    };

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    function cleanup() {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    }

    // Initial check in case section is already in view (e.g. page refreshed midway)
    const initialCheckTimer = setTimeout(() => {
      triggerIfVisible();
    }, 200);

    return () => {
      cleanup();
      clearTimeout(initialCheckTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trust-banner"
      className="py-3 sm:py-5 lg:py-6 xl:py-7 bg-transparent"
      aria-label="Ruchi Foodline Trust & Legacy Statistics"
    >
      <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8">
        {/* Contained, unified editorial banner canvas */}
        <div className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl border border-stone-200/80 bg-[#fbfaf7] shadow-2xs min-h-[105px] xs:min-h-[120px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[240px] flex items-center justify-center">
          {/* Accessible Static Content for Screen Readers */}
          <div className="sr-only">
            <h2>Ruchi Foodline Trust Statistics</h2>
            <ul>
              {STATISTICS.map((stat) => (
                <li key={stat.id}>{stat.ariaLabel}</li>
              ))}
            </ul>
          </div>

          {/* Three-column statistics grid — strictly single row across all mobile & desktop viewports */}
          <div
            className="w-full grid grid-cols-3 divide-x divide-stone-200/80 py-3 xs:py-4 sm:py-6 lg:py-7 xl:py-8"
            role="list"
          >
            {STATISTICS.map((stat) => {
              const currentVal = counts[stat.id] ?? "0";

              return (
                <div
                  key={stat.id}
                  role="listitem"
                  className="min-w-0 flex-1 flex flex-col items-center justify-center text-center px-1 xs:px-2 sm:px-6 lg:px-10 py-1.5 sm:py-3"
                >
                  {/* Oversized, bold, maximalist numeral with fluid responsive sizing */}
                  <div
                    aria-hidden="true"
                    className="font-serif font-bold text-[#0e6337] tracking-tight leading-none text-[clamp(1.25rem,5.5vw,4.75rem)] select-text flex items-baseline justify-center"
                  >
                    <span className="tabular-nums">{currentVal}</span>
                    <span className="select-text">{stat.suffix}</span>
                  </div>

                  {/* Supporting text with fluid typography and controlled line wrapping */}
                  <div className="mt-1 sm:mt-2.5 lg:mt-3.5 flex flex-col justify-start w-full px-0.5">
                    <p className="font-sans text-[clamp(0.5625rem,2vw,0.95rem)] font-medium text-stone-700 leading-[1.2] sm:leading-snug tracking-tight text-center break-words hyphens-auto">
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
