"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PillarStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
}

const PILLAR_STEPS: PillarStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Quality Ingredients",
    description: "Carefully selected ingredients form the foundation of every Ruchi product.",
    imageSrc: "/images/crafted-with-care/1.png",
    alt: "Ruchi authentic quality ingredients, raw whole spices and sun-dried seeds",
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Crafted With Care",
    description: "Every stage is handled with attention to consistency, quality and care.",
    imageSrc: "/images/crafted-with-care/2.png",
    alt: "Ruchi dedicated worker carefully inspecting whole spices in hygienic facility",
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Hygiene & Safety",
    description: "A clean and controlled environment supports the quality and safety of every product.",
    imageSrc: "/images/crafted-with-care/3.png",
    alt: "Ruchi quality assurance and automated sanitary packaging line",
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Packed With Care",
    description: "Thoughtful packaging helps protect the product from production to your kitchen.",
    imageSrc: "/images/crafted-with-care/4.png",
    alt: "Ruchi packaged spice pouches packed in cartons ready for dispatch",
  },
];

export function TrustPillars() {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  const toggleStep = (id: string) => {
    setActiveStepId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      className="py-5 sm:py-7 lg:py-9 bg-transparent"
      aria-label="Manufacturing Standards and Crafted With Care"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* 1. Left-Aligned Section Header */}
        <div className="mb-4 sm:mb-6 lg:mb-7 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#168a4a] mb-1 block">
            CRAFTED WITH CARE
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            Where Quality Becomes a Standard
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-xl leading-relaxed">
            From the ingredients we choose to the care we put into every pack, quality is part of the Ruchi way.
          </p>
        </div>

        {/* 2. 4-Column Editorial Image Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {PILLAR_STEPS.map((step, idx) => {
            const isActive = activeStepId === step.id;

            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleStep(step.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-label={`${step.title} — ${step.description}`}
                className="group relative w-full h-[400px] sm:h-[440px] md:h-[470px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/80 bg-stone-900 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a] select-none"
              >
                {/* Background Image Canvas */}
                <Image
                  src={step.imageSrc}
                  alt={step.alt}
                  fill
                  priority={idx < 2}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover object-center w-full h-full transition-transform duration-700 ease-out motion-reduce:transition-none ${
                    isActive ? "scale-[1.04]" : "group-hover:scale-[1.03]"
                  }`}
                />

                {/* Subtle Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                    isActive
                      ? "bg-gradient-to-t from-black/90 via-black/55 to-transparent"
                      : "bg-gradient-to-t from-black/85 via-black/40 group-hover:from-black/90 group-hover:via-black/55 to-transparent"
                  }`}
                  aria-hidden="true"
                />

                {/* Card Content: Step number, Title, Description */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-6 flex flex-col justify-end text-left">
                  {/* Step number badge */}
                  <span className="text-[11px] font-mono font-bold text-emerald-400/90 tracking-wider mb-1 block">
                    {step.stepNumber}
                  </span>

                  {/* Step Title */}
                  <h3
                    className={`font-serif text-lg sm:text-xl font-bold text-white tracking-tight leading-snug transition-transform duration-300 ease-out motion-reduce:transition-none ${
                      isActive ? "-translate-y-1" : "group-hover:-translate-y-1"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Revealed Supporting Story Description */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "max-h-24 opacity-100 mt-2"
                        : "max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2"
                    }`}
                  >
                    <p className="font-sans text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
