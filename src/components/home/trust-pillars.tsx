"use client";

import React from "react";
import { ShieldCheck, Award, HeartHandshake, Sparkles } from "lucide-react";

export function TrustPillars() {
  const pillars = [
    {
      icon: Sparkles,
      title: "Quality Ingredients",
      description: "Sun-dried, select farm-harvested spices sourced from India's finest agricultural belts.",
    },
    {
      icon: HeartHandshake,
      title: "Authentic Taste",
      description: "Masterly crafted spice recipes tested across generations to deliver rich home taste.",
    },
    {
      icon: ShieldCheck,
      title: "100% Purity Assured",
      description: "Free from artificial colors, synthetic flavors, and harmful adulterants.",
    },
    {
      icon: Award,
      title: "Hygienic Packaging",
      description: "Packed in state-of-the-art automated plants with moisture-lock aroma technology.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-green mb-1 block">
          THE RUCHI COMMITMENT
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-2">
          Why Choose Ruchi Foodline
        </h2>
        <div className="w-10 h-0.5 bg-[#c62828] mx-auto mb-14 opacity-80" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-[12px] border border-border bg-[#f7f6f2] hover:bg-white hover:border-primary-green/50 hover:shadow-md transition-all duration-300 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-soft-green text-primary-green flex items-center justify-center mb-5 group-hover:bg-primary-green group-hover:text-white transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs font-medium text-text/80 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
