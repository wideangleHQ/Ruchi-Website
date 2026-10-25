"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import farmImg1 from "@/assets/Images/Farm to kitchen/1.png";
import farmImg2 from "@/assets/Images/Farm to kitchen/2.png";
import farmImg3 from "@/assets/Images/Farm to kitchen/3.png";
import farmImg4 from "@/assets/Images/Farm to kitchen/4.png";
import farmImg5 from "@/assets/Images/Farm to kitchen/5.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ============================================================================
 * CENTRALIZED ASSET CONFIGURATION
 * ============================================================================
 */
export const HERITAGE_CHAPTER_IMAGES: Record<string, StaticImageData> = {
  chapter1: farmImg1,
  chapter2: farmImg2,
  chapter3: farmImg3,
  chapter4: farmImg4,
  chapter5: farmImg5,
};

export interface HeritageChapter {
  id: string;
  chapterNumber: string;
  chapterLabel: string;
  year: string;
  heading: string;
  story: string;
  image: StaticImageData;
  alt: string;
  locationTag: string;
}

export const HERITAGE_CHAPTERS: HeritageChapter[] = [
  {
    id: "chapter-1",
    chapterNumber: "01",
    chapterLabel: "CHAPTER 01 · THE BEGINNING",
    year: "1976",
    heading: "A humble beginning. A lasting vision.",
    story:
      "The journey of Om Oil & Flour Mills began in Cuttack, Odisha, in June 1976, founded by the late Dr. Sarat Kumar Sahoo and his father, the late Banamali Sahoo. What began as a humble flour and oil mill grew into a packaged-spice business under the RUCHI trademark.",
    image: HERITAGE_CHAPTER_IMAGES.chapter1,
    alt: "Origins of Ruchi Foodline - spice sourcing and milling foundations in Cuttack, Odisha (1976)",
    locationTag: "Cuttack, Odisha · June 1976",
  },
  {
    id: "chapter-2",
    chapterNumber: "02",
    chapterLabel: "CHAPTER 02 · RECOGNITION",
    year: "1986–1996",
    heading: "Trust earned through the years.",
    story:
      "RUCHI received the Best Successful Enterprise and Industrial Peace Award from OASME on three consecutive occasions, marking an important period of growing recognition.",
    image: HERITAGE_CHAPTER_IMAGES.chapter2,
    alt: "Care, inspection, and growing consumer trust across Eastern India (1986–1996)",
    locationTag: "Regional Expansion · 1986–1996",
  },
  {
    id: "chapter-3",
    chapterNumber: "03",
    chapterLabel: "CHAPTER 03 · INNOVATION",
    year: "1997–2005",
    heading: "A vision that changed the scale.",
    story:
      "Om Oil & Flour Mills Ltd. was incorporated in March 1997 and became a Limited Company in 1999. In 1998, RUCHI established Eastern India's first Italian pasta manufacturing plant in Cuttack, using automated machinery imported from Italy and South Korea. The period also brought the Spices House Certificate from the Spices Board of India, AGMARK, ISO 9002 certification, and industry recognition.",
    image: HERITAGE_CHAPTER_IMAGES.chapter3,
    alt: "Automated manufacturing facility and Eastern India first Italian pasta processing plant",
    locationTag: "Modern Processing Unit · Cuttack",
  },
  {
    id: "chapter-4",
    chapterNumber: "04",
    chapterLabel: "CHAPTER 04 · EXPANSION",
    year: "2008–2019",
    heading: "Growing beyond expectations.",
    story:
      "RUCHI received recognition for leadership, entrepreneurship, exports, and corporate achievement, including the Times of India Think Odisha Leadership Award, ACRUX Showcase Odisha Global Leadership Award, India SME Forum Best Entrepreneur Award, WTC MSME Export Achievement Award, and Brands of Odisha – Pride of India.",
    image: HERITAGE_CHAPTER_IMAGES.chapter4,
    alt: "Quality packaging, distribution, and global export reach across 10+ nations",
    locationTag: "Global Reach · 10+ Nations",
  },
  {
    id: "chapter-5",
    chapterNumber: "05",
    chapterLabel: "CHAPTER 05 · THE NEXT CHAPTER",
    year: "2021–2026",
    heading: "Fifty years of trust. Built for tomorrow.",
    story:
      "RUCHI continued to receive industry recognition, including the FICCI FLO Odisha Women's Award, Spice Icon Award, and Times Icons of Odisha. The company celebrated its 50-year milestone with the message “50 Saal Aapke Sehat Ke Saath.” Commercial production at the Ramdaspur Unit, dedicated to spices, vermicelli, pasta, and spaghetti, commenced in June 2025.",
    image: HERITAGE_CHAPTER_IMAGES.chapter5,
    alt: "State-of-the-art Ramdaspur high-capacity manufacturing facility and 50-year golden jubilee",
    locationTag: "Ramdaspur Modern Unit · 2025–2026",
  },
];

export const STOP_POINTS = [
  { index: 0, year: "1976", label: "The Beginning", stop: "01", progress: 0.0 },
  { index: 1, year: "1986–1996", label: "Recognition", stop: "02", progress: 0.25 },
  { index: 2, year: "1997–2005", label: "Innovation", stop: "03", progress: 0.5 },
  { index: 3, year: "2008–2019", label: "Expansion", stop: "04", progress: 0.75 },
  { index: 4, year: "2021–2026", label: "Golden Jubilee", stop: "05", progress: 1.0 },
];

export function AboutHeritageJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinWrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileChapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTriggerInstance = useRef<ScrollTrigger | null>(null);

  // Progress bars are driven straight from the scroll animation (no React state per frame) so they stay at 60fps.
  const desktopFillRef = useRef<HTMLDivElement | null>(null);
  const desktopBeadRef = useRef<HTMLDivElement | null>(null);
  const mobileFillRef = useRef<HTMLDivElement | null>(null);
  const mobilePercentRef = useRef<HTMLSpanElement | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Jump smoothly to a specific chapter stop point
  const handleChapterClick = (targetIndex: number) => {
    const st = scrollTriggerInstance.current;
    if (st && window.innerWidth >= 1024) {
      const targetProgress = STOP_POINTS[targetIndex].progress;
      const targetScroll = st.start + targetProgress * (st.end - st.start);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    } else {
      const el = mobileChapterRefs.current[targetIndex];
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // The sticky site header sits above the pinned stage: size the stage to what is left of the viewport.
  useEffect(() => {
    const el = sectionRef.current;
    const header = document.querySelector("header");
    if (!el || !header) return;
    const apply = () => el.style.setProperty("--hdr", `${header.getBoundingClientRect().height}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =====================================================================
      // DESKTOP PINNED STORYTELLING TIMELINE (>= 1024px)
      // =====================================================================
      mm.add(
        "(min-width: 1024px)",
        () => {
          if (!pinWrapperRef.current) return;

          const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
          const texts = textRefs.current.filter(Boolean) as HTMLDivElement[];

          if (images.length === 0 || texts.length === 0) return;

          // Set initial resting states for the 5 floating editorial images
          images.forEach((img, idx) => {
            if (idx === 0) {
              gsap.set(img, { y: 0, scale: 1, rotateZ: 0, autoAlpha: 1, zIndex: 10 });
            } else {
              gsap.set(img, { y: 140, scale: 0.94, rotateZ: 3.5, autoAlpha: 0, zIndex: 5 });
            }
          });

          // Set initial resting states for the 5 story text narratives
          texts.forEach((txt, idx) => {
            if (idx === 0) {
              gsap.set(txt, { y: 0, autoAlpha: 1 });
            } else {
              gsap.set(txt, { y: 30, autoAlpha: 0 });
            }
          });

          // Master timeline for Desktop pinned storytelling
          const masterTl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
          });

          // Transition windows centered around stop points (0, 0.25, 0.50, 0.75, 1.00)
          const transitions = [
            { from: 0, to: 1, start: 0.12, duration: 0.13 },
            { from: 1, to: 2, start: 0.37, duration: 0.13 },
            { from: 2, to: 3, start: 0.62, duration: 0.13 },
            { from: 3, to: 4, start: 0.87, duration: 0.13 },
          ];

          transitions.forEach(({ from, to, start, duration }) => {
            const outgoingImg = images[from];
            const incomingImg = images[to];
            const outgoingTxt = texts[from];
            const incomingTxt = texts[to];

            if (!outgoingImg || !incomingImg || !outgoingTxt || !incomingTxt) return;

            // Outgoing image floats up with subtle tilt and fades out
            masterTl.to(
              outgoingImg,
              {
                y: -130,
                rotateZ: -3.5,
                scale: 0.94,
                autoAlpha: 0,
                duration,
              },
              start
            );

            // Incoming image floats up into place
            masterTl.fromTo(
              incomingImg,
              {
                y: 140,
                rotateZ: 3.5,
                scale: 0.94,
                autoAlpha: 0,
                zIndex: 10 + to,
              },
              {
                y: 0,
                rotateZ: 0,
                scale: 1,
                autoAlpha: 1,
                duration,
              },
              start + 0.01
            );

            // Outgoing text fades and lifts slightly
            masterTl.to(
              outgoingTxt,
              {
                y: -24,
                autoAlpha: 0,
                duration: duration * 0.7,
              },
              start
            );

            // Incoming text reveals upward
            masterTl.fromTo(
              incomingTxt,
              { y: 30, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: duration * 0.85 },
              start + duration * 0.2
            );
          });

          // Smoothed timeline progress -> bar fill + bead, written directly to the DOM each frame
          let lastIdx = -1;
          masterTl.eventCallback("onUpdate", () => {
            const p = masterTl.progress();
            if (desktopFillRef.current) desktopFillRef.current.style.transform = `scaleX(${p})`;
            if (desktopBeadRef.current) desktopBeadRef.current.style.left = `${p * 100}%`;
            const idx = p >= 0.875 ? 4 : p >= 0.625 ? 3 : p >= 0.375 ? 2 : p >= 0.125 ? 1 : 0;
            if (idx !== lastIdx) {
              lastIdx = idx;
              setActiveChapterIndex(idx);
            }
          });

          // Single coordinated ScrollTrigger pinning the composition just below the sticky header
          const headerH = () => document.querySelector("header")?.getBoundingClientRect().height ?? 0;
          const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            pin: pinWrapperRef.current,
            start: () => `top top+=${Math.round(headerH())}`,
            invalidateOnRefresh: true,
            end: "+=3200",
            scrub: 0.55,
            anticipatePin: 1,
            animation: masterTl,
            snap: {
              snapTo: [0.0, 0.25, 0.5, 0.75, 1.0],
              duration: { min: 0.18, max: 0.38 },
              delay: 0.1,
              ease: "power2.out",
            },
          });

          scrollTriggerInstance.current = st;
        }
      );

      // =====================================================================
      // MOBILE SCROLL PROGRESS TRACKER (< 1024px)
      // =====================================================================
      mm.add(
        "(max-width: 1023px)",
        () => {
          if (!mobileContainerRef.current) return;

          const stMobile = ScrollTrigger.create({
            trigger: mobileContainerRef.current,
            start: "top 25%",
            end: "bottom 80%",
            onUpdate: (self) => {
              const p = self.progress;
              if (mobileFillRef.current) mobileFillRef.current.style.transform = `scaleX(${p})`;
              if (mobilePercentRef.current) mobilePercentRef.current.textContent = `${Math.round(p * 100)}%`;

              let activeIdx = 0;
              if (p >= 0.8) activeIdx = 4;
              else if (p >= 0.6) activeIdx = 3;
              else if (p >= 0.4) activeIdx = 2;
              else if (p >= 0.2) activeIdx = 1;
              else activeIdx = 0;

              setActiveChapterIndex(activeIdx);
            },
          });

          scrollTriggerInstance.current = stMobile;
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="heritage-journey"
      className="relative w-full bg-white text-[#1A1A1A] font-sans"
      aria-label="Our Heritage & 50-Year Journey"
    >
      {/* =====================================================================
          DESKTOP PINNED CINEMATIC STORYTELLING (lg: 1024px and above)
          ===================================================================== */}
      <div
        ref={pinWrapperRef}
        className="hidden lg:flex w-full h-[calc(100svh-var(--hdr,0px))] flex-col justify-between py-3 lg:py-4 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-hidden select-none"
      >
        {/* Center: Open Editorial Composition (No Cards) */}
        <div className="w-full flex-1 grid grid-cols-12 gap-8 xl:gap-14 items-center min-h-0 my-auto py-2">
          {/* LEFT COLUMN: Open Editorial Typography (No Box / No Card) */}
          <div className="col-span-6 xl:col-span-5 relative h-full flex flex-col justify-center">
            {HERITAGE_CHAPTERS.map((chapter, idx) => (
              <div
                key={chapter.id}
                ref={(el) => {
                  textRefs.current[idx] = el;
                }}
                className={`absolute inset-0 flex flex-col justify-center pr-4 xl:pr-8 pointer-events-none ${
                  idx === 0 ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={idx !== activeChapterIndex}
              >
                {/* Year Header */}
                <div className="mb-2">
                  <span className="font-sans text-[clamp(2.25rem,6.5svh,4.5rem)] font-bold tracking-tight text-[#168a4a] block leading-none">
                    {chapter.year}
                  </span>
                </div>

                {/* Chapter Label */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] xl:text-xs font-bold uppercase tracking-[0.2em] text-[#0e6337]">
                    {chapter.chapterLabel}
                  </span>
                </div>

                {/* Editorial Headline */}
                <div className="mb-3">
                  <h3 className="font-serif text-[clamp(1.375rem,3.4svh,2.25rem)] font-bold text-[#1A1A1A] leading-[1.22] tracking-tight">
                    {chapter.heading}
                  </h3>
                </div>

                {/* Narrative Prose */}
                <p className="font-sans text-xs xl:text-sm 2xl:text-[15px] text-[#1A1A1A]/80 leading-relaxed font-normal max-w-xl">
                  {chapter.story}
                </p>

                {/* Location / Context Tag */}
                <div className="mt-3 pt-2 border-t border-stone-200/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#168a4a]" aria-hidden="true" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    {chapter.locationTag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Seamless Editorial Image Stage (No Card Container) */}
          <div
            ref={imagesContainerRef}
            className="col-span-6 xl:col-span-7 relative h-full flex items-center justify-center [perspective:1400px]"
          >
            {HERITAGE_CHAPTERS.map((chapter, idx) => (
              <div
                key={chapter.id}
                ref={(el) => {
                  imageRefs.current[idx] = el;
                }}
                className={`absolute w-full max-h-full max-w-[500px] xl:max-w-[580px] 2xl:max-w-[640px] aspect-[16/11] rounded-2xl overflow-hidden will-change-transform ${
                  idx === 0 ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={idx !== activeChapterIndex}
              >
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 1280px) 640px, 500px"
                  className="object-cover object-center w-full h-full"
                />

                {/* Subtle Cinematic Vignette & Editorial Location Watermark */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white text-xs">
                  <span className="font-serif tracking-tight font-medium drop-shadow-sm">
                    {chapter.year} · Ruchi Foodline
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================================================================
            BOTTOM: ON-SCROLL PROGRESS BAR (CARDLESS DESIGN)
            =================================================================== */}
        <div className="w-full pt-2 pb-1 border-t border-stone-200/80 shrink-0">
          {/* Status & Navigation Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#168a4a]">
                {STOP_POINTS[activeChapterIndex].year} — {STOP_POINTS[activeChapterIndex].label}
              </span>
            </div>
            <span className="text-[11px] font-medium text-stone-400">
              Scroll or click milestones to explore
            </span>
          </div>

          {/* Continuous On-Scroll Progress Bar with Integrated Milestone Points */}
          <div className="relative w-full px-6">
            {/* Base Continuous Track Line (Centered at 15px matching node center) */}
            <div className="absolute left-6 right-6 top-[15px] -translate-y-1/2 h-1.5 bg-stone-200/90 rounded-full overflow-hidden">
              {/* Scroll progress fill: scaleX only, updated per frame from the scroll animation */}
              <div
                ref={desktopFillRef}
                className="h-full w-full origin-left rounded-full bg-[#168a4a] will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Leading-edge bead */}
            <div className="pointer-events-none absolute left-6 right-6 top-[15px] z-10 h-0">
              <div
                ref={desktopBeadRef}
                className="absolute top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#168a4a] bg-white shadow-[0_0_10px_rgba(22,138,74,0.6)]"
                style={{ left: "0%" }}
              />
            </div>

            {/* Interactive Milestone Points Along the Progress Bar */}
            <div className="relative z-20 flex justify-between w-full">
              {STOP_POINTS.map((sp, idx) => {
                const isPassed = idx < activeChapterIndex;
                const isCurrent = activeChapterIndex === idx;

                return (
                  <button
                    key={sp.year}
                    type="button"
                    onClick={() => handleChapterClick(idx)}
                    className="group flex flex-col items-center focus:outline-hidden cursor-pointer"
                    aria-label={`Jump to ${sp.year} - ${sp.label}`}
                  >
                    {/* Milestone Circular Node */}
                    <div
                      className={`w-[30px] h-[30px] rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? "bg-[#168a4a] text-white ring-4 ring-[#168a4a]/25 scale-110 shadow-md"
                          : isPassed
                          ? "bg-[#168a4a] text-white ring-2 ring-white shadow-xs"
                          : "bg-white border-2 border-stone-300 text-stone-400 group-hover:border-[#168a4a]"
                      }`}
                    >
                      {isPassed || isCurrent ? (
                        <svg
                          className="w-3.5 h-3.5 fill-current"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-stone-300 group-hover:bg-[#168a4a]/60 transition-colors" />
                      )}
                    </div>

                    {/* Milestone Year & Label Details (No Card Box, No Stop labels) */}
                    <div className="mt-2 flex flex-col items-center text-center select-none">
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isCurrent
                            ? "text-[#168a4a]"
                            : isPassed
                            ? "text-[#1A1A1A]"
                            : "text-stone-500 group-hover:text-stone-700"
                        }`}
                      >
                        {sp.year}
                      </span>
                      <span className="text-[10px] font-medium text-stone-500 hidden xl:block mt-0.5">
                        {sp.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          MOBILE & TABLET EDITORIAL EXPERIENCE (below lg: 1024px)
          NO CARDS · STICKY PROGRESS BAR · MILESTONES
          ===================================================================== */}
      <div ref={mobileContainerRef} className="lg:hidden w-full bg-white">
        {/* Sticky Mobile On-Scroll Progress Bar */}
        <div className="sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-y border-stone-200/90 py-3 px-4 shadow-2xs">
          <div className="max-w-xl mx-auto">
            {/* Header Readout */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#0e6337] uppercase tracking-wider text-[11px]">
                {STOP_POINTS[activeChapterIndex].year} · {STOP_POINTS[activeChapterIndex].label}
              </span>
              <span ref={mobilePercentRef} className="font-sans text-[11px] font-bold text-[#168a4a]">
                0%
              </span>
            </div>

            {/* Continuous Progress Bar with Milestone Markers */}
            <div className="relative w-full py-1">
              {/* Background Track */}
              <div className="relative h-1.5 w-full bg-stone-200 rounded-full">
                {/* Active Progress Fill */}
                <div
                  ref={mobileFillRef}
                  className="absolute top-0 left-0 h-full w-full origin-left rounded-full bg-[#168a4a] will-change-transform"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>

              {/* Milestone Point Taps */}
              <div className="absolute top-1 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none">
                {STOP_POINTS.map((sp, idx) => {
                  const isPassed = idx < activeChapterIndex;
                  const isCurrent = activeChapterIndex === idx;

                  return (
                    <button
                      key={sp.year}
                      type="button"
                      onClick={() => handleChapterClick(idx)}
                      className="pointer-events-auto w-4 h-4 rounded-full flex items-center justify-center transition-all duration-200"
                      aria-label={`Jump to ${sp.year} - ${sp.label}`}
                    >
                      <span
                        className={`w-3 h-3 rounded-full transition-all ${
                          isCurrent
                            ? "bg-[#168a4a] ring-3 ring-[#168a4a]/30 scale-125"
                            : isPassed
                            ? "bg-[#168a4a]"
                            : "bg-stone-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Section Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6 max-w-2xl sm:max-w-3xl mx-auto text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#0e6337] bg-[#eef6ec] border border-[#168a4a]/20 mb-3">
            Our Heritage · 1976–2026
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1A1A1A] leading-tight mb-3">
            50 Years. One Legacy.
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/75 leading-relaxed font-normal">
            From a humble beginning in Cuttack to five decades of food manufacturing, innovation, and trust.
          </p>
        </div>

        {/* Cardless Connected Vertical Timeline Story */}
        <div className="px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 max-w-2xl sm:max-w-3xl mx-auto relative">
          {/* Vertical Timeline Spine Line */}
          <div
            className="absolute top-4 bottom-8 left-8 sm:left-10 w-0.5 bg-stone-200 -translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-16">
            {HERITAGE_CHAPTERS.map((chapter, idx) => {
              const isPassed = idx < activeChapterIndex;
              const isCurrent = activeChapterIndex === idx;

              return (
                <div
                  key={chapter.id}
                  ref={(el) => {
                    mobileChapterRefs.current[idx] = el;
                  }}
                  className="relative pl-12 sm:pl-16 space-y-4"
                >
                  {/* Marker Node on Vertical Spine */}
                  <div
                    className={`absolute top-0 left-8 sm:left-10 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? "bg-[#168a4a] text-white ring-4 ring-[#168a4a]/25 scale-110 shadow-sm"
                        : isPassed
                        ? "bg-[#168a4a] text-white"
                        : "bg-white border-2 border-stone-300 text-stone-400"
                    }`}
                  >
                    <span className="text-[10px] font-bold">0{idx + 1}</span>
                  </div>

                  {/* Year & Milestone Tag (No "STOP 01" Tag) */}
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-2xl sm:text-3xl font-bold text-[#168a4a] leading-none">
                      {chapter.year}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      · {chapter.chapterLabel}
                    </span>
                  </div>

                  {/* Heading */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
                    {chapter.heading}
                  </h3>

                  {/* Borderless Editorial Image (No Card Styling) */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-cover object-center w-full h-full"
                    />
                    <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-md">
                      {chapter.locationTag}
                    </div>
                  </div>

                  {/* Narrative Story Prose */}
                  <p className="font-sans text-xs sm:text-sm text-[#1A1A1A]/85 leading-relaxed font-normal">
                    {chapter.story}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
