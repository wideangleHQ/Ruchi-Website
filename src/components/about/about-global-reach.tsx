import React from "react";
import { Globe2, MapPin, Building } from "lucide-react";

export function AboutGlobalReach() {
  const exportCountries = [
    "United States of America",
    "United Kingdom",
    "Canada",
    "Italy",
    "Germany",
    "Australia",
    "Singapore",
    "Dubai (UAE)",
    "Muscat (Oman)",
    "Kuwait",
    "Tanzania",
    "Taiwan",
    "Hong Kong",
    "Nepal",
    "Bangladesh",
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Our Reach - India and Global">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
            Distribution Footprint
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Our Reach — Across India &amp; Across the Globe
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            From the heart of Odisha to household kitchens in North America, Europe, Asia-Pacific, and the Middle East.
          </p>
        </div>

        {/* Domestic and International Distribution Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Domestic Distribution (Left) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef6ec] text-[#0e6337] text-xs font-bold uppercase tracking-wider">
              <Building className="w-3.5 h-3.5 text-[#168a4a]" /> Pan-India Distribution
            </div>
            
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
              Deep Roots in Odisha, Strong Presence Nationwide
            </h3>

            <div className="space-y-4 pt-2">
              <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="font-serif text-3xl font-bold text-[#0e6337]">200+</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Authorized Dealers in Odisha</div>
                  <div className="text-[11px] text-gray-600">Covering urban centers &amp; rural districts</div>
                </div>
              </div>

              <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="font-serif text-3xl font-bold text-[#0e6337]">40+</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">Super Stockists Nationwide</div>
                  <div className="text-[11px] text-gray-600">Supplying GT, MT &amp; quick commerce</div>
                </div>
              </div>

              <div className="bg-[#f7f6f2] p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                <div className="font-serif text-3xl font-bold text-[#0e6337]">100%</div>
                <div>
                  <div className="text-xs font-bold text-gray-900">ERP-Enabled Logistics</div>
                  <div className="text-[11px] text-gray-600">Real-time inventory tracking &amp; fulfillment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Export Network (Right) */}
          <div className="lg:col-span-7 bg-[#0a4626] text-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                <Globe2 className="w-3.5 h-3.5" /> Global Export Network
              </div>
              <span className="text-xs font-mono text-emerald-200">10+ Global Markets</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
              Delivering Pure Indian Taste to the Diaspora &amp; Global Food Lovers
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Ruchi Foodline exports pure spices, blended masalas, pasta, and specialty foods to compliant international retail partners across North America, Europe, Africa, the Middle East, and Asia.
            </p>

            {/* Country Pills Matrix */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 mb-3">
                Key International Export Destinations:
              </div>
              <div className="flex flex-wrap gap-2">
                {exportCountries.map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white transition-colors"
                  >
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>{country}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
