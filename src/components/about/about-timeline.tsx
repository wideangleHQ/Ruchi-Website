"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle2, History } from "lucide-react";

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
      "Corporate Incorporation as Limited Company",
      "Eastern India's 1st Italian Pasta Plant in Cuttack",
      "Spices Board of India Spices House Certificate (1998)",
      "Establishment of RUCHI Prativa Foundation (1997)",
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
      "Times Icons of Odisha Award (2024)",
      "Spice Icon Award & Most Promising Brand Award (2022)",
      "Ramdaspur Modern Manufacturing Unit (June 2025)",
      "50 Saal Aapke Sehat Ke Saath Golden Jubilee",
    ],
  },
];

export function AboutTimeline() {
  const [activeIdx, setActiveIdx] = useState(6); // Default to current milestone

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#faf9f6] border-b border-gray-200/80" aria-label="50-Year Journey Timeline">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef6ec] text-[#0e6337] text-xs font-bold uppercase tracking-wider mb-2.5">
            <History className="w-3.5 h-3.5 text-[#168a4a]" /> 1976 – 2026
          </div>
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
          <div className="relative flex items-center justify-between pb-4 border-b border-gray-200">
            {MILESTONES.map((m, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <button
                  key={m.period}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex flex-col items-center group cursor-pointer focus:outline-hidden transition-all text-left ${
                    isCurrent ? "scale-105" : "opacity-75 hover:opacity-100"
                  }`}
                  aria-label={`View milestone for ${m.period}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-xs ${
                      isCurrent
                        ? "bg-[#0e6337] text-white ring-4 ring-emerald-100 scale-110"
                        : "bg-white text-gray-700 border border-gray-300 group-hover:border-[#168a4a]"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold tracking-tight transition-colors ${
                      isCurrent ? "text-[#0e6337] font-bold" : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  >
                    {m.period}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Highlight Card */}
          {(() => {
            const active = MILESTONES[activeIdx];
            return (
              <div className="bg-white rounded-2xl border border-gray-200/90 p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all animate-fade-in">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef6ec] text-[#0e6337] text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-[#168a4a]" />
                    <span>Period: {active.yearLabel}</span>
                  </div>
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
                        <div key={i} className="flex items-start gap-2 bg-[#f7f6f2] p-2.5 rounded-lg border border-gray-100">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#168a4a] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#0e6337] text-white p-6 rounded-xl flex flex-col justify-between h-full space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                      Milestone {activeIdx + 1} of {MILESTONES.length}
                    </span>
                    <div className="font-serif text-3xl font-bold mt-1 text-white">{active.period}</div>
                    <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
                      50 Saal Aapke Sehat Ke Saath — Pure Ingredients, Zero Compromise.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/15 text-xs">
                    <button
                      type="button"
                      disabled={activeIdx === 0}
                      onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
                      className="text-white hover:text-emerald-300 disabled:opacity-40 disabled:hover:text-white font-medium cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      disabled={activeIdx === MILESTONES.length - 1}
                      onClick={() => setActiveIdx((prev) => Math.min(MILESTONES.length - 1, prev + 1))}
                      className="text-white hover:text-emerald-300 disabled:opacity-40 disabled:hover:text-white font-medium cursor-pointer"
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
        <div className="lg:hidden space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-gray-200">
          {MILESTONES.map((m) => (
            <div key={m.period} className="relative pl-10">
              {/* Timeline Dot */}
              <div className="absolute left-2.5 top-1 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#168a4a] ring-4 ring-[#eef6ec]" />
              
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-2xs space-y-2.5">
                <span className="inline-block font-mono text-xs font-bold text-[#168a4a] bg-[#eef6ec] px-2.5 py-0.5 rounded-full">
                  {m.yearLabel}
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                  {m.headline}
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed font-medium">
                  {m.description}
                </p>
                <div className="pt-2 border-t border-gray-100 space-y-1.5 text-xs text-gray-600">
                  {m.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#168a4a] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
