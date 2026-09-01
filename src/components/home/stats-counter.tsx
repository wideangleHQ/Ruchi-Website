"use client";

import React from "react";

interface StatData {
  displayValue: string;
  label: string;
}

export function StatsCounter() {
  const stats: StatData[] = [
    {
      displayValue: "1M +",
      label: "Happy Customers across the globe",
    },
    {
      displayValue: "50+",
      label: "Years of legacy",
    },
    {
      displayValue: "14+",
      label: "States Connected",
    },
  ];

  return (
    <section className="relative w-full py-12 sm:py-16 bg-white overflow-hidden border-y border-gray-200/60">
      {/* Subtle Light Indian Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(#168a4a 0.6px, transparent 0.6px)`,
          backgroundSize: `24px 24px`,
          opacity: 0.05,
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#168a4a] items-center">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center text-center py-6 md:py-2 px-4"
            >
              <div className="font-sans text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#168a4a] tracking-tight mb-2">
                {stat.displayValue}
              </div>
              <p className="font-sans text-base sm:text-lg text-gray-900 font-semibold max-w-[240px] mx-auto leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

