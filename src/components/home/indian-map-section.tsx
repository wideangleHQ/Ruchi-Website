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
            <IndianMap3D sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 3D Interactive Indian Map with subtle, liquid-smooth mouse follow & tilting.
 * Features:
 * - 60/120fps requestAnimationFrame damped linear interpolation (LERP) for zero jitter.
 * - Dynamic 3D perspective with subtle tilt (rotateX, rotateY) and mouse follow (translateX, translateY).
 * - Depth layering: floating map layer, ambient reactive ground shadow, and cursor-tracking specular light sheen.
 * - Organic idle breathing float when mouse is stationary or outside the section.
 * - Direct style updates (no React re-renders during mouse movement) for butter-smooth performance.
 * - Graceful fallback for prefers-reduced-motion and touch devices.
 */
function IndianMap3D({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Accessibility check: disable continuous motion if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    const shadow = shadowRef.current;
    const sheen = sheenRef.current;
    const container = containerRef.current;
    const section = sectionRef.current;
    if (!card || !container) return;

    // Subtle 3D configuration with conservative limits (±3–5 degrees)
    const MAX_TILT_X = 4.5; // degrees (subtle pitch)
    const MAX_TILT_Y = 5.5; // degrees (subtle yaw)
    const MAX_MOVE_X = 9;   // px (follow translation X)
    const MAX_MOVE_Y = 7;   // px (follow translation Y)
    const DAMPING = 0.09;   // Liquid smooth damping factor

    let isRunning = true;
    let rafId = 0;
    let time = 0;

    // Target values normalized (-1 to 1)
    let targetX = 0;
    let targetY = 0;
    let isHovered = false;
    let isDirectMapHover = false;
    let isTouching = false;

    // Current interpolated values
    let currentX = 0;
    let currentY = 0;

    const renderLoop = () => {
      if (!isRunning) return;

      time += 0.016;

      // Desired targets: if not hovering or touching, apply a very gentle natural breathing float
      let effectiveTargetX = targetX;
      let effectiveTargetY = targetY;

      if (!isHovered) {
        effectiveTargetX = Math.sin(time * 0.75) * 0.10;
        effectiveTargetY = Math.cos(time * 0.6) * 0.12;
      }

      // Smooth damped interpolation (LERP)
      currentX += (effectiveTargetX - currentX) * DAMPING;
      currentY += (effectiveTargetY - currentY) * DAMPING;

      // Rotations & Translations
      const rotateX = -currentY * MAX_TILT_X;
      const rotateY = currentX * MAX_TILT_Y;
      const moveX = currentX * MAX_MOVE_X;
      const moveY = currentY * MAX_MOVE_Y;

      // 3D transform on card
      card.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg) translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0px)`;

      // Reactive ambient ground shadow (moves slightly opposite to tilt)
      if (shadow) {
        const shadowX = -moveX * 0.7;
        const shadowY = -moveY * 0.5;
        const shadowScale = isHovered ? 1.03 : 1.0;
        shadow.style.transform = `translate3d(${shadowX.toFixed(2)}px, ${shadowY.toFixed(2)}px, -30px) scale(${shadowScale})`;
        shadow.style.opacity = (isDirectMapHover ? 0.32 : isHovered ? 0.26 : 0.20).toFixed(3);
      }

      // Specular sheen light gradient tracking the cursor / touch across the 3D surface
      if (sheen) {
        const glareX = ((currentX + 1) / 2) * 100;
        const glareY = ((currentY + 1) / 2) * 100;
        const glareIntensity = isDirectMapHover ? 0.20 : isHovered ? 0.10 : 0.04;
        sheen.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, 0.03) 40%, transparent 70%)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    // Compute normalized coordinates (-1 to 1) relative to the map container
    const updateTargetFromPoint = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const spanX = Math.max(rect.width * 0.55, 120);
      const spanY = Math.max(rect.height * 0.55, 140);

      const rawX = (clientX - centerX) / spanX;
      const rawY = (clientY - centerY) / spanY;

      targetX = Math.max(-1, Math.min(1, rawX));
      targetY = Math.max(-1, Math.min(1, rawY));
    };

    // Desktop mouse pointer interaction
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // Handled by touch events for mobile thumb dragging

      const rect = container.getBoundingClientRect();
      const isInsideMap =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      isDirectMapHover = isInsideMap;
      isHovered = true;
      updateTargetFromPoint(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      if (isTouching) return;
      targetX = 0;
      targetY = 0;
      isHovered = false;
      isDirectMapHover = false;
    };

    // Mobile touch interaction: drag or move thumb across the map
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      isTouching = true;
      isHovered = true;
      isDirectMapHover = true;
      updateTargetFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouching || e.touches.length === 0) return;
      isHovered = true;
      isDirectMapHover = true;
      updateTargetFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
      isTouching = false;
      targetX = 0;
      targetY = 0;
      isHovered = false;
      isDirectMapHover = false;
    };

    // Listen on section if available, else container
    const activeListenerTarget = section || container;
    activeListenerTarget.addEventListener("pointermove", handlePointerMove as EventListener, {
      passive: true,
    });
    activeListenerTarget.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });

    // Touch listeners on container and window (with passive: true to guarantee fluid page scroll)
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      activeListenerTarget.removeEventListener("pointermove", handlePointerMove as EventListener);
      activeListenerTarget.removeEventListener("pointerleave", handlePointerLeave);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [sectionRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[440px] md:max-w-[500px] lg:max-w-[560px] xl:max-w-[620px] aspect-[4/5] max-h-[55vh] sm:max-h-[62vh] lg:max-h-[76vh] flex items-center justify-center cursor-default select-none"
      style={{ perspective: "1200px", touchAction: "pan-y" }}
    >
      {/* 3D Floating Stage with preserve-3d */}
      <div
        ref={cardRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Soft Ambient Ground Shadow reacting inversely to tilt */}
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 bottom-6 h-20 rounded-full bg-emerald-950/25 blur-2xl transition-opacity duration-300 motion-reduce:hidden"
          style={{
            transform: "translate3d(0, 0, -30px)",
          }}
        />

        {/* Golden Warm Hub Glow radiating from Odisha hub */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[26%] top-[48%] h-36 w-36 -translate-y-1/2 rounded-full bg-amber-400/20 blur-3xl motion-reduce:hidden"
          style={{
            transform: "translate3d(0, 0, 10px)",
          }}
        />

        {/* Elevated 3D Map Image */}
        <div
          className="relative w-full h-full"
          style={{
            transform: "translate3d(0, 0, 25px)",
            transformStyle: "preserve-3d",
          }}
        >
          <Image
            src={indianMapImg}
            alt="Three-dimensional map silhouette of India in green"
            fill
            sizes="(min-width: 1400px) 620px, (min-width: 1024px) 50vw, (min-width: 640px) 440px, 85vw"
            priority
            className="object-contain object-center select-none filter drop-shadow-[0_14px_28px_rgba(14,99,55,0.12)] pointer-events-none"
          />
        </div>

        {/* Dynamic Specular Sheen Overlay tracking mouse across 3D map */}
        <div
          ref={sheenRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl mix-blend-overlay transition-opacity duration-500 motion-reduce:hidden"
          style={{
            transform: "translate3d(0, 0, 32px)",
          }}
        />
      </div>
    </div>
  );
}
