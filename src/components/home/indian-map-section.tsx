"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import indianMapImg from "@/assets/Images/Indian Map.png";

export function IndianMapSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15, // Trigger when 15% visible in viewport
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brand-heritage-map"
      className="relative w-full overflow-hidden bg-transparent py-12 sm:py-16 lg:py-0 lg:h-[100svh] lg:min-h-[100svh] lg:max-h-[100svh] flex items-center justify-center"
      aria-label="About Ruchi Foodline - Indian Roots and Heritage"
    >
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          {/* Left Column — Editorial Story (approx 40-45% width) */}
          <div
            className={`w-full lg:w-[44%] xl:w-[42%] flex flex-col justify-center text-left transition-all duration-700 ease-out motion-reduce:transition-none ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 motion-reduce:opacity-100 motion-reduce:translate-y-0"
            }`}
          >
            {/* Editorial Heading */}
            <h2 className="font-serif font-bold text-stone-900 tracking-tight leading-[1.16] text-3xl sm:text-4xl md:text-[2.75rem] lg:text-[clamp(2.35rem,3.4vw,3.6rem)]">
              Rooted in India.
              <br />
              <span className="text-stone-900">
                Trusted Across Generations.
              </span>
            </h2>

            {/* Editorial Paragraph */}
            <p className="mt-5 sm:mt-6 lg:mt-8 font-sans text-stone-700 text-sm sm:text-base lg:text-[1.0625rem] font-normal leading-relaxed lg:leading-[1.75] max-w-xl">
              Born in Cuttack, Odisha, in 1976, Ruchi Foodline has grown from
              its humble beginnings into a trusted name in Indian kitchens.
              Built on a foundation of quality, dedication, and honest
              craftsmanship, our journey reflects a lasting commitment to
              bringing dependable flavours and food products to families. With a
              heritage shaped by generations of care and a continued focus on
              manufacturing standards, we remain rooted in our origins while
              serving an expanding community across India and beyond.
            </p>
          </div>

          {/* Right Column — 3D Indian Map (approx 55-60% width) */}
          <div
            className={`w-full lg:w-[56%] xl:w-[58%] flex items-center justify-center lg:justify-end transition-all duration-800 delay-150 ease-out motion-reduce:transition-none ${
              isVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 motion-reduce:opacity-100 motion-reduce:scale-100"
            }`}
          >
            <div className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[620px] aspect-[4/5] max-h-[55vh] sm:max-h-[62vh] lg:max-h-[76vh] flex items-center justify-center">
              <Image
                src={indianMapImg}
                alt="Three-dimensional map silhouette of India in green"
                fill
                sizes="(min-width: 1400px) 620px, (min-width: 1024px) 50vw, (min-width: 640px) 440px, 85vw"
                priority
                className="object-contain object-center select-none drop-shadow-sm filter"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
