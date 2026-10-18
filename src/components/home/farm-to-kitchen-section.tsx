"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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

interface StoryStage {
  id: string;
  stageNumber: string;
  stageLabel: string;
  heading: string;
  paragraph: string;
  image: StaticImageData;
  alt: string;
}

const STORY_STAGES: StoryStage[] = [
  {
    id: "stage-1",
    stageNumber: "01",
    stageLabel: "01 — THE BEGINNING",
    heading: "Every Flavour Begins Somewhere.",
    paragraph:
      "It begins with nature's ingredients—the colours, aromas, and character that make every spice unique.",
    image: farmImg1,
    alt: "Indian woman harvesting chillies in a field surrounded by raw spices and greenery",
  },
  {
    id: "stage-2",
    stageNumber: "02",
    stageLabel: "02 — THE CARE",
    heading: "Goodness Deserves Attention.",
    paragraph:
      "Every ingredient deserves care and attention, because the little details make a meaningful difference.",
    image: farmImg2,
    alt: "Quality inspection and examination of spices in a state-of-the-art laboratory",
  },
  {
    id: "stage-3",
    stageNumber: "03",
    stageLabel: "03 — THE CRAFT",
    heading: "Made With Purpose. Refined With Care.",
    paragraph:
      "Thoughtful processing and dedicated craftsmanship help bring out the character of ingredients in every blend.",
    image: farmImg3,
    alt: "Workers, stainless-steel machinery, and spice processing in a hygienic manufacturing facility",
  },
  {
    id: "stage-4",
    stageNumber: "04",
    stageLabel: "04 — THE PROMISE",
    heading: "Quality in Every Step.",
    paragraph:
      "From preparation to packaging, quality remains an important part of the Ruchi way.",
    image: farmImg4,
    alt: "Hygienic packaging, inspection, and Ruchi products on the production line",
  },
  {
    id: "stage-5",
    stageNumber: "05",
    stageLabel: "05 — THE DESTINATION",
    heading: "And Finally, It Feels Like Home.",
    paragraph:
      "The journey finds its purpose in everyday meals, shared traditions, and the moments that bring us together.",
    image: farmImg5,
    alt: "An Indian family sharing a home-cooked meal with Ruchi spice products on the table",
  },
];

export function FarmToKitchenSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const markerPulseRef = useRef<SVGCircleElement>(null);
  const markerGlowRef = useRef<SVGCircleElement>(null);

  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [trackWidth, setTrackWidth] = useState(1400);

  // Measure container width to ensure tracker spans 100% of the screen width in 1:1 SVG coordinate space
  useEffect(() => {
    const updateWidth = () => {
      const width = containerRef.current
        ? containerRef.current.clientWidth
        : typeof window !== "undefined"
        ? window.innerWidth
        : 1400;
      if (width > 0) {
        setTrackWidth(width);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Compute exact 1:1 Bézier path and node positions matching trackWidth
  const { pathD, nodes } = useMemo(() => {
    const w = Math.max(320, trackWidth);
    const n1x = w * 0.08;
    const n1y = 55;

    const n2x = w * 0.29;
    const n2y = 22;

    const n3x = w * 0.50;
    const n3y = 72;

    const n4x = w * 0.71;
    const n4y = 22;

    const n5x = w * 0.92;
    const n5y = 55;

    const startX = Math.max(0, w * 0.02);
    const endX = Math.min(w, w * 0.98);

    // Continuous smooth undulating Bézier path guaranteeing all 5 nodes lie exactly on the curve
    const d = [
      `M ${startX} 55`,
      `L ${n1x} 55`,
      `C ${n1x + (n2x - n1x) * 0.42} 55, ${n2x - (n2x - n1x) * 0.42} 22, ${n2x} 22`,
      `C ${n2x + (n3x - n2x) * 0.42} 22, ${n3x - (n3x - n2x) * 0.42} 72, ${n3x} 72`,
      `C ${n3x + (n4x - n3x) * 0.42} 72, ${n4x - (n4x - n3x) * 0.42} 22, ${n4x} 22`,
      `C ${n4x + (n5x - n4x) * 0.42} 22, ${n5x - (n5x - n4x) * 0.42} 55, ${n5x} 55`,
      `L ${endX} 55`,
    ].join(" ");

    const nodeList = [
      { ...STORY_STAGES[0], x: n1x, y: 55, labelY: 84 },
      { ...STORY_STAGES[1], x: n2x, y: 22, labelY: 10 },
      { ...STORY_STAGES[2], x: n3x, y: 72, labelY: 98 },
      { ...STORY_STAGES[3], x: n4x, y: 22, labelY: 10 },
      { ...STORY_STAGES[4], x: n5x, y: 55, labelY: 84 },
    ];

    return { pathD: d, nodes: nodeList };
  }, [trackWidth]);

  useEffect(() => {
    if (!containerRef.current || !pinWrapperRef.current) return;

    const ctx = gsap.context(() => {
      const path = pathRef.current;
      const progressPath = progressPathRef.current;
      if (!path || !progressPath) return;

      const pathLength = path.getTotalLength();

      // Initialize progress stroke with exact pathLength
      gsap.set(progressPath, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Initialize starting marker position at 0%
      const startPt = path.getPointAtLength(0);
      if (markerRef.current) {
        markerRef.current.setAttribute("cx", startPt.x.toString());
        markerRef.current.setAttribute("cy", startPt.y.toString());
      }
      if (markerPulseRef.current) {
        markerPulseRef.current.setAttribute("cx", startPt.x.toString());
        markerPulseRef.current.setAttribute("cy", startPt.y.toString());
      }
      if (markerGlowRef.current) {
        markerGlowRef.current.setAttribute("cx", startPt.x.toString());
        markerGlowRef.current.setAttribute("cy", startPt.y.toString());
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions as {
            reduceMotion: boolean;
            isMobile: boolean;
          };

          const setHeaderVisibility = (hidden: boolean) => {
            const header = document.getElementById("site-header");
            if (!header) return;
            if (hidden) {
              header.setAttribute("data-hidden", "true");
            } else {
              header.removeAttribute("data-hidden");
            }
          };

          if (reduceMotion) {
            ScrollTrigger.create({
              trigger: containerRef.current,
              start: "top 80px",
              end: "bottom top",
              onToggle: (self) => setHeaderVisibility(self.isActive),
              onRefresh: (self) => {
                if (self.isActive) setHeaderVisibility(true);
              },
            });
            return;
          }

          // Master ScrollTrigger timeline pinned across ~2 viewport heights
          const scrollDistance = isMobile ? "+=1800" : "+=2400";

          // Dedicated ScrollTrigger to cleanly hide the header when entering Farm to Kitchen
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 80px",
            end: () => `+=${isMobile ? 1800 : 2400}`,
            onToggle: (self) => setHeaderVisibility(self.isActive),
            onRefresh: (self) => {
              if (self.isActive) setHeaderVisibility(true);
            },
          });

          const masterTl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              pin: pinWrapperRef.current,
              start: "top top",
              end: scrollDistance,
              scrub: 0.5,
              anticipatePin: 1,
              onToggle: (self) => {
                setHeaderVisibility(self.isActive);
              },
              onRefresh: (self) => {
                if (self.isActive) setHeaderVisibility(true);
              },
              onUpdate: (self) => {
                if (self.isActive) {
                  setHeaderVisibility(true);
                }

                const progress = self.progress;

                // Move marker and strokeDashoffset in exact lockstep along the curve
                const currentDist = progress * pathLength;
                const pt = path.getPointAtLength(Math.min(currentDist, pathLength));

                if (markerRef.current) {
                  markerRef.current.setAttribute("cx", pt.x.toString());
                  markerRef.current.setAttribute("cy", pt.y.toString());
                }
                if (markerPulseRef.current) {
                  markerPulseRef.current.setAttribute("cx", pt.x.toString());
                  markerPulseRef.current.setAttribute("cy", pt.y.toString());
                }
                if (markerGlowRef.current) {
                  markerGlowRef.current.setAttribute("cx", pt.x.toString());
                  markerGlowRef.current.setAttribute("cy", pt.y.toString());
                }

                // Update stroke offset directly to guarantee 0-pixel latency with the marker
                if (progressPath) {
                  progressPath.style.strokeDashoffset = (pathLength - currentDist).toString();
                }

                // Update active stage index for responsive label highlights
                const stageIndex = Math.min(
                  4,
                  Math.floor(progress * 4.999)
                );
                setActiveStageIndex(stageIndex);
              },
            },
          });

          // 2. Crossfade between the 5 stages across the master timeline
          const transitions = [
            { from: 0, to: 1, start: 0.18, dur: 0.08 },
            { from: 1, to: 2, start: 0.38, dur: 0.08 },
            { from: 2, to: 3, start: 0.58, dur: 0.08 },
            { from: 3, to: 4, start: 0.78, dur: 0.08 },
          ];

          transitions.forEach(({ from, to, start, dur }) => {
            // Fade out previous image
            if (imagesRef.current[from]) {
              masterTl.to(
                imagesRef.current[from],
                { opacity: 0, ease: "power1.inOut", duration: dur },
                start
              );
            }

            // Fade in next image with subtle scale transition
            if (imagesRef.current[to]) {
              masterTl.fromTo(
                imagesRef.current[to],
                { opacity: 0, scale: 1.03 },
                { opacity: 1, scale: 1, ease: "power1.inOut", duration: dur },
                start
              );
            }

            // Fade out previous text
            if (textsRef.current[from]) {
              masterTl.to(
                textsRef.current[from],
                { opacity: 0, y: -16, ease: "power1.in", duration: dur * 0.7 },
                start
              );
            }

            // Fade in next text
            if (textsRef.current[to]) {
              masterTl.fromTo(
                textsRef.current[to],
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, ease: "power1.out", duration: dur * 0.8 },
                start + dur * 0.2
              );
            }
          });
        }
      );
    }, containerRef);

    return () => {
      const header = document.getElementById("site-header");
      if (header) header.removeAttribute("data-hidden");
      ctx.revert();
    };
  }, [trackWidth, pathD]);

  return (
    <section
      ref={containerRef}
      id="farm-to-kitchen"
      className="relative w-full bg-stone-950 text-white overflow-clip"
      aria-label="Farm to Kitchen Story"
    >
      {/* Pinned Viewport Container (100svh edge-to-edge) */}
      <div
        ref={pinWrapperRef}
        className="relative w-full h-[100svh] min-h-[100vh] overflow-hidden flex flex-col justify-end"
      >
        {/* 1. Full-Screen Image Canvas Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {STORY_STAGES.map((stage, idx) => (
            <div
              key={stage.id}
              ref={(el) => {
                imagesRef.current[idx] = el;
              }}
              className="absolute inset-0 w-full h-full will-change-transform"
              style={{
                opacity: idx === 0 ? 1 : 0,
                zIndex: idx + 1,
              }}
            >
              <Image
                src={stage.image}
                alt={stage.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover object-center w-full h-full"
              />
            </div>
          ))}

          {/* 2. Cinematic Readability Gradients */}
          {/* Bottom rich black gradient for text and tracker readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-[75vh] sm:h-[70vh] z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.78) 32%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0) 88%)",
            }}
            aria-hidden="true"
          />
        </div>

        {/* 3. Combined Bottom Story Content & Tracker Layer (100% Screen Width) */}
        <div className="relative z-30 w-full pb-20 md:pb-8 lg:pb-10 flex flex-col justify-end items-center gap-4 sm:gap-6">
          {/* Story Text Layer (Centered horizontally in the section) */}
          <div className="relative w-full max-w-3xl px-4 sm:px-6 mx-auto min-h-[140px] sm:min-h-[160px] lg:min-h-[175px] text-center flex flex-col items-center">
            {STORY_STAGES.map((stage, idx) => (
              <div
                key={stage.id}
                ref={(el) => {
                  textsRef.current[idx] = el;
                }}
                className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center will-change-transform"
                style={{
                  opacity: idx === 0 ? 1 : 0,
                  pointerEvents: idx === activeStageIndex ? "auto" : "none",
                }}
              >
                {/* Eyebrow & Stage Badge (Centered) */}
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-amber-300 tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-black/50 border border-amber-400/40 backdrop-blur-xs">
                    FARM TO KITCHEN
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-semibold text-white/80 tracking-wider">
                    {stage.stageLabel}
                  </span>
                </div>

                {/* Main Editorial Heading (Centered) */}
                <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.18] mb-2 sm:mb-2.5 drop-shadow-md text-center max-w-2xl mx-auto">
                  {stage.heading}
                </h3>

                {/* Supporting Story Paragraph (Centered) */}
                <p className="font-sans text-xs xs:text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-xl mx-auto drop-shadow-sm text-center">
                  {stage.paragraph}
                </p>
              </div>
            ))}
          </div>

          {/* Persistent Curved Timeline Tracker (100% Width of Screen) */}
          <div className="w-full px-2 sm:px-6 md:px-10 lg:px-16 pt-3 border-t border-white/10 relative">
            <div className="w-full h-18 sm:h-22 lg:h-26 relative overflow-visible">
              <svg
                viewBox={`0 0 ${trackWidth} 110`}
                className="w-full h-full overflow-visible"
                aria-hidden="true"
              >
                <defs>
                  {/* Subtle drop shadow for line contrast */}
                  <filter id="timeline-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
                  </filter>
                  <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Base Path (Warm Soft White Translucent) */}
                <path
                  ref={pathRef}
                  d={pathD}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#timeline-shadow)"
                />

                {/* Progress / Completed Path (Turmeric Gold Accent) */}
                <path
                  ref={progressPathRef}
                  d={pathD}
                  fill="none"
                  stroke="#d4a359"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#timeline-shadow)"
                />

                {/* 5 Stage Nodes along the 100% width screen */}
                {nodes.map((node, i) => {
                  const isReached = i <= activeStageIndex;

                  return (
                    <g key={node.id} className="transition-all duration-300">
                      {/* Outer Ring */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isReached ? 7.5 : 5.5}
                        fill={isReached ? "#d4a359" : "rgba(15,15,15,0.7)"}
                        stroke={isReached ? "#ffffff" : "rgba(255, 255, 255, 0.65)"}
                        strokeWidth="2"
                        className="transition-all duration-300"
                      />

                      {/* Inner Anchor Dot */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={isReached ? 3 : 2}
                        fill={isReached ? "#ffffff" : "rgba(255, 255, 255, 0.85)"}
                        className="transition-all duration-300"
                      />

                      {/* Stage Label Text */}
                      <text
                        x={node.x}
                        y={node.labelY}
                        textAnchor="middle"
                        className={`font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider select-none transition-all duration-300 hidden xs:inline ${
                          isReached ? "fill-amber-300 opacity-100" : "fill-white/70 opacity-60"
                        }`}
                        style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.95))" }}
                      >
                        {node.stageLabel.replace(/^0\d — /, "")}
                      </text>
                    </g>
                  );
                })}

                {/* Active Gliding Progress Marker (Tracks Path with 100% Precision) */}
                <circle
                  ref={markerPulseRef}
                  cx={nodes[0]?.x ?? 0}
                  cy={nodes[0]?.y ?? 55}
                  r="13"
                  fill="none"
                  stroke="#d4a359"
                  strokeWidth="2"
                  opacity="0.75"
                  filter="url(#marker-glow)"
                />
                <circle
                  ref={markerGlowRef}
                  cx={nodes[0]?.x ?? 0}
                  cy={nodes[0]?.y ?? 55}
                  r="8"
                  fill="rgba(212, 163, 89, 0.45)"
                  filter="url(#marker-glow)"
                />
                <circle
                  ref={markerRef}
                  cx={nodes[0]?.x ?? 0}
                  cy={nodes[0]?.y ?? 55}
                  r="5"
                  fill="#ffffff"
                  stroke="#d4a359"
                  strokeWidth="2.5"
                  filter="url(#timeline-shadow)"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Re-export as AboutLegacySection for backward compatibility
export { FarmToKitchenSection as AboutLegacySection };
