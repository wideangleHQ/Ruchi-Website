"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/Images/Global Buisness/Global Buisness Hero.png";
import { GB_COLORS, HERO } from "./content";

/** Section 01 — Global Business Hero: background image with dark overlay, centered hero text kept minimum size. */
export function GlobalBusinessHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-copy] > *", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 0.1);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-labelledby="gb-hero-heading"
      className="relative isolate flex min-h-[90vh] min-h-[90svh] w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      {/* Background Image: Global Buisness Hero */}
      <Image
        src={heroBg}
        alt="Ruchi Foodline Global Business & Exports"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-center -z-20"
      />

      {/* Dark Overlay for contrast & readability */}
      <div
        className="absolute inset-0 -z-10 bg-black/60 sm:bg-black/65 backdrop-brightness-90"
        aria-hidden="true"
      />

      {/* Centered Hero Text Container */}
      <div
        data-hero-copy
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        <p
          className="font-sans text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]"
          style={{ color: GB_COLORS.greenLight }}
        >
          {HERO.eyebrow}
        </p>

        <h1
          id="gb-hero-heading"
          className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold uppercase leading-tight tracking-tight text-white max-w-2xl"
        >
          {HERO.headlineLead}{" "}
          <span style={{ color: GB_COLORS.greenLight }}>{HERO.headlineAccent}</span>{" "}
          {HERO.headlineTail}
        </h1>

        <p className="mt-4 max-w-xl font-sans text-sm sm:text-base leading-relaxed text-white/90">
          {HERO.support}
        </p>

        <a
          href="#enquiry"
          className="group mt-7 inline-flex min-h-11 sm:min-h-12 items-center gap-2.5 rounded-[6px] px-6 py-2.5 font-sans text-sm sm:text-base font-semibold transition-[background-color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{ backgroundColor: GB_COLORS.green, color: "#fff" }}
        >
          {HERO.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
