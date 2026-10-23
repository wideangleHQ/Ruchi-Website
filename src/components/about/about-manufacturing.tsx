import React from "react";
import Image from "next/image";
import aboutImg3 from "@/assets/Images/about section/3.png";

export function AboutManufacturing() {
  const techHighlights = [
    {
      title: "RUCHI Pasta Village",
      subtitle: "Italian & South Korean Automated Extruders",
      description:
        "Dedicated industrial pasta processing complex equipped with world-class high-capacity extruders imported from Italy and South Korea.",
    },
    {
      title: "Cryogenic Low-Temp Grinding",
      subtitle: "Essential Oil & Aroma Preservation",
      description:
        "Low-temperature cryogenic spice milling that prevents thermal dissipation, locking in natural volatile essential oils, vibrant color, and rich flavor potency.",
    },
    {
      title: "100% Suji & Zero-Maida Promise",
      subtitle: "100% Durum Wheat Semolina",
      description:
        "All gourmet pasta and vermicelli ranges are crafted strictly from 100% Durum Wheat Semolina (Suji) with zero maida, high protein, fiber, and zero trans fats.",
    },
    {
      title: "Zero-Touch Automated Packaging",
      subtitle: "Hermetic Purity from Farm to Pouch",
      description:
        "End-to-end automated packaging lines ensure untouched hygienic processing, tamper-evident seals, and zero foreign contamination.",
    },
  ];

  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-[#faf9f6]" aria-label="Manufacturing and Technology">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 lg:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Manufacturing &amp; Food Technology
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md font-medium leading-relaxed">
            World-class processing infrastructure across Cuttack (Khapuria) and Ramdaspur industrial estates.
          </p>
        </div>

        {/* Manufacturing Visual Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md h-44 sm:h-56 md:h-64 mb-6 bg-stone-900 group">
          <Image
            src={aboutImg3}
            alt="Ruchi Foodline Automated Manufacturing and Packaging Line"
            fill
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          
          <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="max-w-xl">
              <h3 className="font-serif text-lg sm:text-2xl md:text-3xl font-bold text-white">
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
          {techHighlights.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
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
          ))}
        </div>

      </div>
    </section>
  );
}
