"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type FloatingLeaf = {
  img: StaticImageData;
  sizes: string;
  /** Position + size of the leaf (absolute, relative to the section). */
  className: string;
  /** Scroll travel across the section, px / deg (desktop values; scaled down on smaller screens). */
  scroll: { fromY: number; toY: number; fromX: number; toX: number; fromRot: number; toRot: number };
  /** Pointer response: px of drift and deg of 3D tilt at the section edge. */
  pointer: { depthX: number; depthY: number; tiltX: number; tiltY: number };
};

/**
 * Leaf layer that floats ABOVE its section's content (pointer-events: none, so nothing underneath loses clicks).
 * Each leaf has two wrappers so the transforms never fight: the outer one is scrubbed by scroll,
 * the inner one follows the pointer (desktop with a mouse only). Reduced motion → leaves stay still.
 * Place it as a direct child of a `relative` section; it uses that section as its scroll trigger and pointer area.
 */
export function FloatingLeaves({ leaves }: { leaves: FloatingLeaf[] }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pointerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const layer = layerRef.current;
    const section = layer?.parentElement;
    if (!layer || !section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
          isTablet: "(min-width: 640px) and (max-width: 1023px)",
          isMobile: "(max-width: 639px)",
        },
        (context) => {
          const { motion, finePointer, isMobile, isTablet } = context.conditions as Record<string, boolean>;
          if (!motion) return;

          // Desktop gets the full travel; smaller screens a calmer share so leaves don't leave their area.
          const mult = isMobile ? 0.55 : isTablet ? 0.8 : 1;

          leaves.forEach((leaf, i) => {
            const el = scrollRefs.current[i];
            if (!el) return;
            gsap.fromTo(
              el,
              { y: leaf.scroll.fromY * mult, x: leaf.scroll.fromX * mult, rotation: leaf.scroll.fromRot },
              {
                y: leaf.scroll.toY * mult,
                x: leaf.scroll.toX * mult,
                rotation: leaf.scroll.toRot,
                ease: "none",
                scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.5, invalidateOnRefresh: true },
              }
            );
          });

          if (!finePointer) return;

          const targets = leaves.flatMap((leaf, i) => {
            const el = pointerRefs.current[i];
            if (!el) return [];
            gsap.set(el, { transformPerspective: 600 });
            return [
              {
                ...leaf.pointer,
                x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" }),
                y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" }),
                rx: gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" }),
                ry: gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" }),
              },
            ];
          });
          const onMove = (e: PointerEvent) => {
            const rect = section.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            targets.forEach((t) => {
              t.x(-nx * t.depthX);
              t.y(-ny * t.depthY);
              t.rx(ny * t.tiltX);
              t.ry(-nx * t.tiltY);
            });
          };
          const onLeave = () => targets.forEach((t) => (t.x(0), t.y(0), t.rx(0), t.ry(0)));
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        }
      );
    }, layer);

    return () => ctx.revert();
  }, [leaves]);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40">
      {leaves.map((leaf, i) => (
        <div
          key={i}
          ref={(el) => {
            scrollRefs.current[i] = el;
          }}
          className={`absolute will-change-transform ${leaf.className}`}
        >
          <div
            ref={(el) => {
              pointerRefs.current[i] = el;
            }}
            className="will-change-transform"
          >
            <Image src={leaf.img} alt="" sizes={leaf.sizes} className="h-auto w-full select-none drop-shadow-[0_10px_18px_rgba(16,51,31,0.2)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
