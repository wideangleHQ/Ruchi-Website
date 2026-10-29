"use client";

import React, { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 4000;
const FADE_START_MS = 2600;

interface AnimationInstance {
  destroy: () => void;
}

/**
 * Diwali Fireworks Full-Screen Overlay
 * 
 * Uses the festive fireworks assets from `src/assets/Diwali`
 * (served as vector Lottie animations from `/animations/diwali/`):
 * - Primary Layer: Full-screen celebration fireworks (`fireworks-widescreen.json` from `Fireworks.lottie`)
 * - Golden Accent Layer: Warm amber/gold bursts (`fire-works-golden.json` from `Fire works.lottie`)
 * 
 * Features:
 * - Plays automatically on page entrance and every page refresh.
 * - Non-blocking: `pointer-events: none` ensures complete usability of navigation, CTAs, and shopping.
 * - Respects `prefers-reduced-motion: reduce`.
 * - Seamless ~3.8-second sequence: Initial spark -> festive bursts -> elegant fade out -> complete DOM cleanup.
 */
export function DiwaliFireworks() {
  const [isActive, setIsActive] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const primaryContainerRef = useRef<HTMLDivElement>(null);
  const goldenContainerRef = useRef<HTMLDivElement>(null);
  const animInstancesRef = useRef<AnimationInstance[]>([]);

  useEffect(() => {
    // Guard against non-browser environments
    if (typeof window === "undefined") return;

    // 1. Accessibility: Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    setIsActive(true);

    let fadeTimer: NodeJS.Timeout;
    let cleanupTimer: NodeJS.Timeout;
    let goldenStartTimer: NodeJS.Timeout;

    // Asynchronously import lottie-web on the client
    import("lottie-web").then((lottieModule) => {
      const lottie = lottieModule.default || lottieModule;

      // Primary Widescreen Fireworks (Celebration bursts across full screen)
      if (primaryContainerRef.current) {
        try {
          const anim1 = lottie.loadAnimation({
            container: primaryContainerRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "/animations/diwali/fireworks-widescreen.json",
            rendererSettings: {
              preserveAspectRatio: "xMidYMid slice",
              progressiveLoad: true,
              hideOnTransparent: true,
            },
          });
          animInstancesRef.current.push(anim1);
        } catch (e) {
          console.warn("Could not load primary fireworks animation", e);
        }
      }

      // Secondary Warm Golden Bursts (Staggered by 250ms for natural depth)
      goldenStartTimer = setTimeout(() => {
        if (goldenContainerRef.current) {
          try {
            const anim2 = lottie.loadAnimation({
              container: goldenContainerRef.current,
              renderer: "svg",
              loop: false,
              autoplay: true,
              path: "/animations/diwali/fire-works-golden.json",
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
                progressiveLoad: true,
                hideOnTransparent: true,
              },
            });
            animInstancesRef.current.push(anim2);
          } catch (e) {
            console.warn("Could not load golden fireworks animation", e);
          }
        }
      }, 250);

      // Phase C: Begin gentle fade-out at ~2.6s
      fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, FADE_START_MS);

      // Complete cleanup and deactivation at ~4s
      cleanupTimer = setTimeout(() => {
        setIsActive(false);
        animInstancesRef.current.forEach((instance) => {
          try {
            instance.destroy();
          } catch {
            // Safe cleanup
          }
        });
        animInstancesRef.current = [];
      }, ANIMATION_DURATION_MS);
    });

    // Cleanup on unmount or navigation
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(cleanupTimer);
      clearTimeout(goldenStartTimer);
      animInstancesRef.current.forEach((instance) => {
        try {
          instance.destroy();
        } catch {
          // Safe cleanup
        }
      });
      animInstancesRef.current = [];
    };
  }, []);

  if (!isActive) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 pointer-events-none w-screen h-screen overflow-hidden transition-opacity duration-1000 ease-out ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Primary Full-Screen Fireworks Canvas */}
      <div
        ref={primaryContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Secondary Golden Accent Fireworks Canvas */}
      <div
        ref={goldenContainerRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90 mix-blend-screen"
      />

      {/* Shimmering Golden Ambient Sparks (CSS Decorative Particle Field) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        <span
          className="absolute top-[12%] left-[10%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-ping opacity-75"
          style={{ animationDuration: "2.2s" }}
        />
        <span
          className="absolute top-[18%] right-[14%] w-2.5 h-2.5 rounded-full bg-yellow-200 shadow-[0_0_14px_#fef08a] animate-ping opacity-80"
          style={{ animationDuration: "1.8s", animationDelay: "0.3s" }}
        />
        <span
          className="absolute top-[35%] left-[8%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping opacity-60"
          style={{ animationDuration: "2.5s", animationDelay: "0.6s" }}
        />
        <span
          className="absolute top-[28%] right-[8%] w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047] animate-ping opacity-70"
          style={{ animationDuration: "2s", animationDelay: "0.4s" }}
        />
      </div>
    </div>
  );
}

