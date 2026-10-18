import React from "react";

export function AboutGlobalReach() {
  // Same 15 destinations as before, grouped by region only.
  const exportRegions: Array<{ region: string; countries: string[] }> = [
    { region: "North America", countries: ["United States of America", "Canada"] },
    { region: "Europe", countries: ["United Kingdom", "Italy", "Germany"] },
    { region: "Middle East", countries: ["Dubai (UAE)", "Muscat (Oman)", "Kuwait"] },
    { region: "Africa", countries: ["Tanzania"] },
    { region: "Asia-Pacific", countries: ["Australia", "Singapore", "Taiwan", "Hong Kong", "Nepal", "Bangladesh"] },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-8 sm:py-12 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Our Reach - India and Global">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Our Reach — Across India &amp; Across the Globe
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            From the heart of Odisha to household kitchens in North America, Europe, Asia-Pacific, and the Middle East.
          </p>
        </div>

        {/* Domestic and International Distribution Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Domestic Distribution (Left) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-5">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Deep Roots in Odisha, Strong Presence Nationwide
            </h3>

            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-20 shrink-0 font-serif text-3xl font-bold text-[#0e6337]">200+</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Authorized Dealers in Odisha</div>
                  <div className="text-[11px] text-gray-600">Covering urban centers &amp; rural districts</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-20 shrink-0 font-serif text-3xl font-bold text-[#0e6337]">40+</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Super Stockists Nationwide</div>
                  <div className="text-[11px] text-gray-600">Supplying GT, MT &amp; quick commerce</div>
                </div>
              </div>

              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-20 shrink-0 font-serif text-3xl font-bold text-[#0e6337]">100%</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">ERP-Enabled Logistics</div>
                  <div className="text-[11px] text-gray-600">Real-time inventory tracking &amp; fulfillment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Export Network (Right) */}
          <div className="lg:col-span-7 bg-[#0a4626] text-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-200">10+ Global Markets</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              Delivering Pure Indian Taste to the Diaspora &amp; Global Food Lovers
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Ruchi Foodline exports pure spices, blended masalas, pasta, and specialty foods to compliant international retail partners across North America, Europe, Africa, the Middle East, and Asia.
            </p>

            {/* Export destinations by region */}
            <div className="pt-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-3">
                Key International Export Destinations
              </h4>
              <dl className="divide-y divide-white/10 border-y border-white/10">
                {exportRegions.map(({ region, countries }) => (
                  <div key={region} className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-x-4 gap-y-0.5 py-2.5">
                    <dt className="text-xs font-bold text-emerald-200">{region}</dt>
                    <dd className="text-xs sm:text-sm text-white">{countries.join(" · ")}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
