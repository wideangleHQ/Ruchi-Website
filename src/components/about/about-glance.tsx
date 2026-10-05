import React from "react";
import { ShieldCheck, Award, Globe2, Sparkles, CheckCircle2 } from "lucide-react";

export function AboutGlance() {
  const credentials = [
    {
      title: "50+ Years of Excellence",
      subtitle: "Five Decades of Trust",
      description: "Built on half a century of culinary heritage, relentless innovation, and beloved household trust across millions of kitchens.",
      icon: Award,
    },
    {
      title: "ISO 22000 & CRISIL SME 2",
      subtitle: "Certified Quality & Governance",
      description: "Rigorous adherence to international food safety management (ISO 22000:2018 & ISO 9002) and highest financial governance benchmarks.",
      icon: ShieldCheck,
    },
    {
      title: "100% Purity Guarantee",
      subtitle: "Farm-Sourced & Zero Maida",
      description: "100% pure farm spices, durum wheat suji pasta with zero maida, non-sticky vermicelli, and strong-bodied tea crafted with zero compromise.",
      icon: Sparkles,
    },
    {
      title: "Global Reach & Pan-India Scale",
      subtitle: "10+ Nations & 240+ Network Points",
      description: "Exporting across USA, UK, Italy, Australia, Dubai, and Singapore; backed domestically by 200+ Odisha dealers and 40+ national super stockists.",
      icon: Globe2,
    },
  ];

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-[#f7f6f2] border-b border-gray-200/80" aria-label="Ruchi at a Glance">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Eyebrow & Intro */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
              Impact &amp; Credentials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Ruchi at a Glance
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed">
            Five decades of benchmark quality standards, certified processes, and pan-Indian distribution.
          </p>
        </div>

        {/* Asymmetric 4-Card Refined Proof Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {credentials.map((cred, idx) => {
            const IconComponent = cred.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl sm:rounded-2xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#eef6ec] text-[#0e6337] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-bold text-[#168a4a] uppercase tracking-wider mb-1">
                    {cred.subtitle}
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
                    {cred.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {cred.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#0e6337]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#168a4a]" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
