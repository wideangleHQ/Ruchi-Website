import React from "react";
import Image from "next/image";
import { Cpu, Snowflake, Wheat, ShieldCheck, MapPin } from "lucide-react";
import aboutImg3 from "@/assets/Images/about section/3.png";

export function AboutManufacturing() {
  const techHighlights = [
    {
      title: "RUCHI Pasta Village",
      subtitle: "Italian & South Korean Automated Extruders",
      description:
        "Dedicated industrial pasta processing complex equipped with world-class high-capacity extruders imported from Italy and South Korea.",
      icon: Cpu,
    },
    {
      title: "Cryogenic Low-Temp Grinding",
      subtitle: "Essential Oil & Aroma Preservation",
      description:
        "Low-temperature cryogenic spice milling that prevents thermal dissipation, locking in natural volatile essential oils, vibrant color, and rich flavor potency.",
      icon: Snowflake,
    },
    {
      title: "100% Suji & Zero-Maida Promise",
      subtitle: "100% Durum Wheat Semolina",
      description:
        "All gourmet pasta and vermicelli ranges are crafted strictly from 100% Durum Wheat Semolina (Suji) with zero maida, high protein, fiber, and zero trans fats.",
      icon: Wheat,
    },
    {
      title: "Zero-Touch Automated Packaging",
      subtitle: "Hermetic Purity from Farm to Pouch",
      description:
        "End-to-end automated packaging lines ensure untouched hygienic processing, tamper-evident seals, and zero foreign contamination.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Manufacturing and Technology">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
              Production Excellence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Manufacturing &amp; Food Technology
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed">
            World-class processing infrastructure across Cuttack (Khapuria) and Ramdaspur industrial estates.
          </p>
        </div>

        {/* Manufacturing Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md h-64 sm:h-80 md:h-96 mb-8 bg-stone-900 group">
          <Image
            src={aboutImg3}
            alt="Ruchi Foodline Automated Manufacturing and Packaging Line"
            fill
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 font-mono text-xs mb-2">
                <MapPin className="w-3.5 h-3.5" /> Khapuria &amp; Ramdaspur Facilities, Cuttack
              </span>
              <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white">
                RUCHI Pasta Village &amp; Cryogenic Grinding Mills
              </h3>
            </div>
            <div className="text-xs text-stone-300 font-mono">
              ISO 22000:2018 Certified Facility
            </div>
          </div>
        </div>

        {/* 4 Technology Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {techHighlights.map((tech, idx) => {
            const IconComponent = tech.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#eef6ec] text-[#0e6337] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-bold text-[#168a4a] uppercase tracking-wider mb-1">
                    {tech.subtitle}
                  </div>
                  <h4 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {tech.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {tech.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
