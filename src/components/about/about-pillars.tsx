import React from "react";
import Image, { type StaticImageData } from "next/image";
import craftedImg1 from "@/assets/Images/CRAFTED WITH CARE/1.png";
import craftedImg2 from "@/assets/Images/CRAFTED WITH CARE/2.png";
import craftedImg3 from "@/assets/Images/CRAFTED WITH CARE/3.png";
import craftedImg4 from "@/assets/Images/CRAFTED WITH CARE/4.png";

interface Pillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: StaticImageData;
  alt: string;
}

const PILLARS: Pillar[] = [
  {
    number: "01",
    title: "Quality",
    subtitle: "100% Pure & Farm-Sourced",
    description:
      "Delivering 100% pure, farm-sourced ingredients processed under strict ISO 22000 & AGMARK food safety standards with zero maida and no artificial additives.",
    image: craftedImg1,
    alt: "Ruchi raw spices quality inspection and purity standard",
  },
  {
    number: "02",
    title: "Labour & Devotion",
    subtitle: "Perseverance Over Shortcuts",
    description:
      "Believing in relentless hard work, perseverance, and genuine dedication rather than shortcuts or reliance on external subsidies.",
    image: craftedImg2,
    alt: "Dedicated Ruchi artisans and factory workforce with craft and devotion",
  },
  {
    number: "03",
    title: "Honesty & Integrity",
    subtitle: "Transparent Supply Chain",
    description:
      "Upholding transparent business practices across our supply chain and building lifelong consumer trust under '50 Saal Aapke Sehat Ke Saath'.",
    image: craftedImg3,
    alt: "Ruchi hygienic processing facility with integrity standards",
  },
  {
    number: "04",
    title: "Advanced Technology",
    subtitle: "Italian & South Korean Systems",
    description:
      "Utilizing cutting-edge processing technology (imported from Italy and South Korea) to lock in natural aromas, essential oils, and nutritional value.",
    image: craftedImg4,
    alt: "Automated zero-touch packaging technology and pasta extruders",
  },
];

export function AboutPillars() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Four Foundational Pillars">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
            Core Values
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            The Four Foundational Pillars
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            The enduring principles instituted by our founders that guide every formulation, factory line, and customer relationship.
          </p>
        </div>

        {/* 4 Large Visual Story Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((p) => (
            <div
              key={p.number}
              className="group relative h-[360px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden border border-gray-200/90 shadow-2xs hover:shadow-xl transition-all duration-500 bg-stone-900 flex flex-col justify-end p-6"
            >
              {/* Background Canvas Image */}
              <Image
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 group-hover:from-black/95 group-hover:via-black/70 transition-colors" />

              {/* Pillar Number Tag */}
              <div className="relative z-10 font-mono text-xs font-bold text-emerald-400 mb-2">
                Pillar {p.number}
              </div>

              {/* Title & Subtitle */}
              <div className="relative z-10">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1 leading-snug">
                  {p.title}
                </h3>
                <div className="text-xs font-semibold text-emerald-200/90 mb-3">
                  {p.subtitle}
                </div>

                {/* Supporting Text — Always clear on mobile, enhanced on desktop */}
                <p className="text-xs text-stone-200 leading-relaxed font-medium line-clamp-4 lg:line-clamp-none">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
