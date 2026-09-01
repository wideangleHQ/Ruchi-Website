"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import satvikComboImg from "@/assets/Images/SATVIK Combo.png";
import satvikBgImg from "@/assets/Images/SATVIK background.jpg";

export function FeaturedCampaign() {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate restrained 3D tilt rotation (±4deg)
    const rotateX = ((mouseY - height / 2) / (height / 2)) * -4;
    const rotateY = ((mouseX - width / 2) / (width / 2)) * 4;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (!prefersReducedMotion) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#b91c1c] text-white py-12 sm:py-16 lg:py-0 lg:h-[80vh] lg:min-h-[540px] flex items-center justify-center">
      {/* 1. Authentic Satvik Damask Pattern Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={satvikBgImg}
          alt="SATVIK Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full opacity-40"
        />
      </div>

      {/* 2. Main Section Content */}
      <div className="relative z-10 w-full max-w-[1400px] px-6 sm:px-10 lg:px-16 mx-auto h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center w-full my-auto">
          
          {/* Left Column: Horizontally Centered Container with Left-Aligned Text */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5 text-left flex flex-col items-start justify-center mx-auto max-w-lg lg:max-w-xl w-full">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] font-black tracking-tight text-[#FFFF00] uppercase leading-[0.95] drop-shadow-md text-left">
              SATVIK<br />COMBO
            </h2>

            <p className="font-sans text-xs sm:text-sm lg:text-base text-white/95 font-medium leading-relaxed text-left max-w-lg">
              Experience the purity of traditional cooking with the RUCHI Sattvik Festive Kit, featuring 11 premium spices and mixes crafted without Onion or Garlic. Perfect for festivals, pujas, fasting days, and authentic everyday meals.
            </p>

            <div className="pt-2 text-left">
              <Link
                href="/products/ruchi-sattvik-festive-kit-11-in-1-combo-no-onion-no-garlic"
                className="inline-block bg-white text-[#b91c1c] font-bold text-xs sm:text-sm tracking-wider uppercase px-6 sm:px-7 py-2.5 sm:py-3 rounded-full hover:bg-gray-100 transition-all shadow-md active:scale-95"
              >
                Shop Combo
              </Link>
            </div>
          </div>

          {/* Right Column: Horizontally Centered Compact Satvik Kit Product Image Visual */}
          <div className="lg:col-span-6 flex justify-center items-center w-full mx-auto">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: "1200px",
              }}
              className="relative w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[380px] aspect-[4/5] flex items-center justify-center cursor-pointer mx-auto"
            >
              <div
                style={{
                  transform: isHovered && !prefersReducedMotion
                    ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.03)`
                    : "rotateX(0deg) rotateY(0deg) scale(1)",
                  transition: isHovered
                    ? "transform 0.12s ease-out"
                    : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  transformStyle: "preserve-3d",
                }}
                className="relative w-full h-full rounded-xl overflow-hidden shadow-xl"
              >
                <Image
                  src={satvikComboImg}
                  alt="RUCHI Satvik Combo Kit"
                  fill
                  priority
                  sizes="(min-width: 1024px) 35vw, 70vw"
                  className="object-contain object-center w-full h-full p-2"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
