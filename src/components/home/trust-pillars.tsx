"use client";

import React, { useState } from "react";
import Image, { type StaticImageData } from "next/image";

import craftedImg1 from "@/assets/Images/CRAFTED WITH CARE/1.png";
import craftedImg2 from "@/assets/Images/CRAFTED WITH CARE/2.png";
import craftedImg3 from "@/assets/Images/CRAFTED WITH CARE/3.png";
import craftedImg4 from "@/assets/Images/CRAFTED WITH CARE/4.png";

interface PillarStep {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  imageSrc: StaticImageData;
  alt: string;
}

const PILLAR_STEPS: PillarStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    title: "Quality Ingredients",
    description: "Carefully selected ingredients form the foundation of every Ruchi product.",
    imageSrc: craftedImg1,
    alt: "Ruchi authentic quality ingredients, raw whole spices and sun-dried seeds",
  },
  {
    id: "step-2",
    stepNumber: "02",
    title: "Crafted With Care",
    description: "Every stage is handled with attention to consistency, quality and care.",
    imageSrc: craftedImg2,
    alt: "Ruchi dedicated worker carefully inspecting whole spices in hygienic facility",
  },
  {
    id: "step-3",
    stepNumber: "03",
    title: "Hygiene & Safety",
    description: "A clean and controlled environment supports the quality and safety of every product.",
    imageSrc: craftedImg3,
    alt: "Ruchi hygiene and safety quality assurance facility",
  },
  {
    id: "step-4",
    stepNumber: "04",
    title: "Packed With Care",
    description: "Thoughtful packaging helps protect the product from production to your kitchen.",
    imageSrc: craftedImg4,
    alt: "Ruchi packed with care spice pouches and quality packaging",
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
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
            Where Quality Becomes a Standard
          </h2>
          <p className="mt-1.5 text-sm text-gray-600 max-w-xl leading-relaxed">
            From the ingredients we choose to the care we put into every pack, quality is part of the Ruchi way.
          </p>
        </div>

        {/* 2. Responsive Cards Grid: 2x2 on Mobile, 4-column on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3.5 sm:gap-5 lg:gap-6">
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
                className="group relative w-full h-[270px] xs:h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/80 bg-stone-900 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#168a4a] select-none"
              >
                {/* Background Image Canvas */}
                <Image
                  src={step.imageSrc}
                  alt={step.alt}
                  fill
                  priority={idx < 2}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 50vw"
                  className="object-cover object-center w-full h-full transition-transform duration-700 ease-out motion-reduce:transition-none group-hover:scale-[1.03]"
                />

                {/* Subtle Gradient Overlay Ensuring Readable Text */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-black/95 via-black/60 to-black/10 lg:from-black/85 lg:via-black/40 lg:to-transparent lg:group-hover:from-black/95 lg:group-hover:via-black/60"
                  aria-hidden="true"
                />

                {/* Card Content: Step number, Title, Description (Visible by default on mobile) */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-3 xs:p-4 sm:p-6 flex flex-col justify-end text-left">
                  {/* Step number badge */}
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-400/90 tracking-wider mb-0.5 sm:mb-1 block">
                    {step.stepNumber}
                  </span>

                  {/* Step Title */}
                  <h3 className="font-serif text-sm xs:text-base sm:text-xl font-bold text-white tracking-tight leading-snug">
                    {step.title}
                  </h3>

                  {/* Supporting Story Description — Visible by default on mobile, hover revealed on desktop */}
                  <div className="overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none max-h-24 opacity-100 mt-1 sm:mt-1.5 lg:max-h-0 lg:opacity-0 lg:mt-0 lg:group-hover:max-h-24 lg:group-hover:opacity-100 lg:group-hover:mt-2">
                    <p className="font-sans text-[11px] xs:text-xs sm:text-[13px] text-white/90 font-normal leading-relaxed line-clamp-3">
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
