"use client";

import React, { useState } from "react";

interface Milestone {
  period: string;
  yearLabel: string;
  headline: string;
  description: string;
  highlights: string[];
}

const MILESTONES: Milestone[] = [
  {
    period: "1976",
    yearLabel: "1976",
    headline: "Foundation in Cuttack & RUCHI Spices",
    description:
      "Founded by late Dr. Sarat Kumar Sahoo and late Banamali Sahoo as Om Oil & Flour Mills in Cuttack. Pioneered packaged pure ground spices under the brand 'RUCHI' to replace loose, adulterated spice markets.",
    highlights: [
      "Inception of Om Oil & Flour Mills in Cuttack",
      "Launch of packaged pure spices under 'RUCHI'",
      "Rooted in purity and consumer hygiene",
    ],
  },
  {
    period: "1986–1996",
    yearLabel: "1986 – 1996",
    headline: "Industrial Peace & Enterprise Honors",
    description:
      "A decade of rapid regional expansion across Odisha and neighboring states. Recognized three consecutive times with the Best Successful Enterprise & Industrial Peace Award by OASME.",
    highlights: [
      "3x Consecutive Best Successful Enterprise Awards",
      "OASME Industrial Peace Recognition",
      "Expansion of dealer network across Eastern India",
    ],
  },
  {
    period: "1997–1998",
    yearLabel: "1997 – 1998",
    headline: "Pasta Revolution & Spices House Certification",
    description:
      "Incorporation as Om Oil & Flour Mills Ltd. Awarded the Spices House Certificate by the Spices Board of India (1998). Established Eastern India's first Italian Pasta manufacturing plant in Cuttack with imported machinery from Italy and South Korea. Established RUCHI Prativa Foundation.",
    highlights: [
      "Establishment of RUCHI Prativa Foundation (1997)",
      "Corporate Incorporation as Limited Company",
      "Eastern India's 1st Italian Pasta Plant in Cuttack",
      "Spices Board of India Spices House Certificate (1998)",
    ],
  },
  {
    period: "2000–2005",
    yearLabel: "2000 – 2005",
    headline: "AGMARK, ISO 9002 & State Safety Accreditations",
    description:
      "Consolidating quality governance through AGMARK certification (2001) and ISO 9002 standards. Awarded the OSFC Best Entrepreneur Award (2002) and Odisha State Safety Award (2004).",
    highlights: [
      "AGMARK Food Quality Certification (2001)",
      "ISO 9002 Quality Management System",
      "OSFC Best Entrepreneur Award (2002)",
      "State Safety Award (2004)",
    ],
  },
  {
    period: "2008–2014",
    yearLabel: "2008 – 2014",
    headline: "Leadership Recognitions & Corporate Eminence",
    description:
      "Conferred the Times of India Think Odisha Leadership Award (2008), ACRUX Showcase Odisha Global Leadership Award (2012), and Best Corporate Award (2014).",
    highlights: [
      "Times of India Think Odisha Leadership Award (2008)",
      "ACRUX Global Leadership Award (2012)",
      "Best Corporate Award (2014)",
      "Continuous innovation in extruded pasta and vermicelli",
    ],
  },
  {
    period: "2017–2019",
    yearLabel: "2017 – 2019",
    headline: "MSME Export Triumph & Brands of Odisha",
    description:
      "Recognized on the national stage by the Ministry of MSME and India SME Forum (2017). Won the World Trade Center MSME Export Achievement Award (2017) and Sambad Brands of Odisha – Pride of India (2019).",
    highlights: [
      "India SME Forum Best Entrepreneur Award (2017)",
      "World Trade Center MSME Export Achievement (2017)",
      "Brands of Odisha – Pride of India (2019)",
      "Global export footprint expansion across 10+ nations",
    ],
  },
  {
    period: "2021–2026",
    yearLabel: "2021 – 2026",
    headline: "50-Year Golden Milestone & Future Ready",
    description:
      "Conferred the FICCI FLO Odisha Women's Award (2021), Spice Icon Award (2022), and Times Icons of Odisha (2024). Commenced commercial production at the modern Ramdaspur facility (June 2025) and celebrated 50 years under '50 Saal Aapke Sehat Ke Saath'.",
    highlights: [
      "FICCI FLO Odisha Women's Award (2021)",
      "Spice Icon Award & Most Promising Brand Award (2022)",
      "Times Icons of Odisha Award (2024)",
      "Ramdaspur Modern Manufacturing Unit (June 2025)",
      "50 Saal Aapke Sehat Ke Saath Golden Jubilee",
    ],
  },
];

export function AboutTimeline() {
  const [activeIdx, setActiveIdx] = useState(0); // Start at 1976 so the story reads forward

  const onStepKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = Math.min(MILESTONES.length - 1, Math.max(0, activeIdx + (e.key === "ArrowRight" ? 1 : -1)));
    setActiveIdx(next);
    document.getElementById(`journey-step-${next}`)?.focus();
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-12 sm:py-16 md:py-20 bg-[#faf9f6] border-b border-gray-200/80" aria-label="50-Year Journey Timeline">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Our 50-Year Journey of Taste &amp; Trust
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Discover the key milestones that transformed a local Cuttack flour mill into an internationally celebrated Indian food brand.
          </p>
        </div>

        {/* ============================================================
            DESKTOP INTERACTIVE STEPPER (lg and above)
            ============================================================ */}
        <div className="hidden lg:block space-y-8">
          {/* Progress Timeline Stepper Bar */}
          <div className="relative pb-4 border-b border-gray-200">
            {/* Track + progress fill (decorative) */}
            <div className="absolute left-5 right-5 top-5 h-0.5 bg-gray-200" aria-hidden="true">
              <div
                className="h-full bg-[#168a4a] motion-safe:transition-[width] motion-safe:duration-500"
                style={{ width: `${(activeIdx / (MILESTONES.length - 1)) * 100}%` }}
              />
            </div>
            <div
              role="tablist"
              aria-label="Ruchi journey milestones, 1976 to 2026"
              onKeyDown={onStepKeyDown}
              className="relative flex items-start justify-between"
            >
              {MILESTONES.map((m, idx) => {
                const isCurrent = idx === activeIdx;
                const isPast = idx < activeIdx;
                return (
                  <button
                    key={m.period}
                    id={`journey-step-${idx}`}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-controls="journey-panel"
                    tabIndex={isCurrent ? 0 : -1}
                    onClick={() => setActiveIdx(idx)}
                    className="group flex flex-col items-center rounded-md px-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-bold transition-colors ${
                        isCurrent
                          ? "bg-[#0e6337] text-white ring-4 ring-emerald-100"
                          : isPast
                            ? "bg-[#168a4a] text-white"
                            : "border border-gray-300 bg-white text-gray-700 group-hover:border-[#168a4a]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`mt-2 text-xs tracking-tight transition-colors ${
                        isCurrent ? "font-bold text-[#0e6337]" : "font-semibold text-gray-600 group-hover:text-gray-900"
                      }`}
                    >
                      {m.period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Milestone Highlight Card */}
          {(() => {
            const active = MILESTONES[activeIdx];
            return (
              <div
                key={activeIdx}
                id="journey-panel"
                role="tabpanel"
                aria-labelledby={`journey-step-${activeIdx}`}
                className="bg-white rounded-2xl border border-gray-200/90 p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center motion-safe:animate-fade-in"
              >
                <div className="lg:col-span-8 space-y-4">
                  <h3 className="font-serif text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
                    {active.headline}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                    {active.description}
                  </p>

                  <div className="pt-2 space-y-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Key Historic Achievements
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium text-gray-800">
                      {active.highlights.map((h, i) => (
                        <div key={i} className="bg-[#f7f6f2] p-2.5 rounded-lg border border-gray-100">
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#0e6337] text-white p-6 rounded-xl flex flex-col justify-between h-full space-y-4">
                  <div>
                    <div className="font-serif text-3xl font-bold text-white">{active.period}</div>
                    <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                      50 Saal Aapke Sehat Ke Saath — Pure Ingredients, Zero Compromise.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs">
                    <button
                      type="button"
                      disabled={activeIdx === 0}
                      onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                      aria-label="Previous milestone"
                      className="rounded px-1 text-white hover:text-emerald-300 disabled:opacity-40 disabled:hover:text-white font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      disabled={activeIdx === MILESTONES.length - 1}
                      onClick={() => setActiveIdx((prev) => Math.min(MILESTONES.length - 1, prev + 1))}
                      aria-label="Next milestone"
                      className="rounded px-1 text-white hover:text-emerald-300 disabled:opacity-40 disabled:hover:text-white font-medium cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* ============================================================
            MOBILE / TABLET VERTICAL TIMELINE (below lg)
            ============================================================ */}
        <ol className="lg:hidden space-y-6 relative before:absolute before:inset-y-0 before:left-[9px] before:w-0.5 before:bg-gray-200" aria-label="Ruchi journey, 1976 to 2026">
          {MILESTONES.map((m) => (
            <li key={m.period} className="relative pl-9">
              {/* Timeline Dot */}
              <div className="absolute left-[10px] top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#168a4a] ring-4 ring-[#eef6ec]" aria-hidden="true" />
              
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-2.5">
                <span className="block font-mono text-xs font-bold uppercase tracking-wider text-[#0e6337]">
                  {m.yearLabel}
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                  {m.headline}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {m.description}
                </p>
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-[13px] text-gray-600">
                  {m.highlights.map((h, i) => (
                    <div key={i}>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
