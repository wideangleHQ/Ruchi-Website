"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skyImg from "@/assets/Images/Tea/Sky.png";
import leftMountainImg from "@/assets/Images/Tea/Left.png";
import rightMountainImg from "@/assets/Images/Tea/Right.png";
import packetsImg from "@/assets/Images/Tea/Tea Packets.png";
import { whenTeaIntroDone } from "./tea-intro";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Editable copy — the layout does not depend on line lengths.
const COPY = {
  eyebrow: "RUCHI Tea",
  headline: "Some moments are meant to be brewed slowly.",
  support: "Discover the tea that brings everyday moments closer.",
};

/**
 * Layered tea-valley hero: sky → left / right mountain cutouts → the three RUCHI packets → copy.
 * Every layer is bottom-anchored (the cutouts and the packet group end flat at their lower edge),
 * so the scene reads as one landscape at any aspect ratio. Motion is entrance-only plus a light
 * scroll drift and desktop pointer parallax; the static state is complete without any of it.
 */
export function TeaHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const packetsRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // On /tea the header overlays the hero; its height sets the copy's top offset. Re-measured on every refresh/resize.
    const measureHeader = () => {
      const h = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      section.style.setProperty("--hdr", `${h}px`);
    };
    measureHeader();
    ScrollTrigger.addEventListener("refreshInit", measureHeader);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          finePointer: "(hover: hover) and (pointer: fine) and (min-width: 1024px)",
        },
        (context) => {
          const { motion, finePointer } = context.conditions as { motion: boolean; finePointer: boolean };
          if (!motion) return; // static, complete composition

          const [left, right, packets, sky] = [leftRef.current, rightRef.current, packetsRef.current, skyRef.current];
          const mountainImgs = [left, right].map((el) => el?.querySelector("img"));

          // Entrance — layers settle into place from the edges; nothing bounces or overshoots.
          // Held while the Tea intro curtain is up, and started as the curtain begins to lift.
          const entrance = gsap
            .timeline({ paused: true, defaults: { ease: "power3.out" } })
            .from(sky, { scale: 1.06, duration: 1.8, ease: "power2.out" }, 0)
            .from(mountainImgs[0] ?? [], { xPercent: -8, autoAlpha: 0, duration: 1.4 }, 0.1)
            .from(mountainImgs[1] ?? [], { xPercent: 8, autoAlpha: 0, duration: 1.4 }, 0.1)
            .from(packets?.querySelector("img") ?? [], { yPercent: 12, autoAlpha: 0, duration: 1.1 }, 0.45)
            .from(copyRef.current?.children ?? [], { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.3);
          const stopWaiting = whenTeaIntroDone(() => entrance.play());

          // Scroll — the far mountain recedes left, the near mountain advances right, the packets settle back slightly.
          // The sky and the bottom gradient are deliberately left out: they stay fixed to the hero.
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.4, invalidateOnRefresh: true },
            })
            .to(left, { xPercent: -6, scale: 0.97, transformOrigin: "0% 100%" }, 0)
            .to(right, { xPercent: 9, scale: 1.03, transformOrigin: "100% 100%" }, 0)
            .to(packets, { scale: 0.95, transformOrigin: "50% 100%" }, 0)
            .to(copyRef.current, { autoAlpha: 0, y: -24 }, 0);

          if (!finePointer) return stopWaiting;

          // Pointer parallax — layered 3D depth between far mountain, product packets, and near mountain.
          const moves = [
            { el: left, depthX: 28, depthY: 16 },
            { el: right, depthX: 42, depthY: 22 },
            { el: packets, depthX: 12, depthY: 8 },
          ].map(({ el, depthX, depthY }) => ({
            depthX,
            depthY,
            x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
            y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }),
          }));
          const onMove = (e: PointerEvent) => {
            const rect = section.getBoundingClientRect();
            const nx = (e.clientX - rect.left) / rect.width - 0.5;
            const ny = (e.clientY - rect.top) / rect.height - 0.5;
            moves.forEach((m) => {
              m.x(-nx * m.depthX);
              m.y(-ny * m.depthY);
            });
          };
          const onLeave = () => moves.forEach((m) => (m.x(0), m.y(0)));
          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerleave", onLeave);
          return () => {
            stopWaiting();
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerleave", onLeave);
          };
        }
      );
    }, section);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", measureHeader);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="tea-hero-heading"
      // On /tea the site header is a transparent overlay, so the hero is a full screen tall.
      // The light sky colour is the fallback while (or if) the sky image fails to load.
      className="relative isolate h-[var(--hero-h)] w-full overflow-hidden bg-[#cfe6f5] [--hero-h:max(560px,100svh)]"
    >
      {/* Layer order (back → front): sky 0 · left mountain 10 · packets 20 · right mountain 30 · gradient 40 · copy 50.
          Phones: near mountain in front (z 30), lowered so the names stay clear. Tablet (sm–lg): behind the packets (z 15). */}

      {/* Sky */}
      <div ref={skyRef} className="absolute inset-0 z-0 will-change-transform">
        <Image src={skyImg} alt="" fill priority placeholder="blur" sizes="(max-aspect-ratio: 16/9) 178vh, 100vw" className="object-cover object-top" />
      </div>

      {/* Left mountain — the far layer, behind the packets */}
      <div
        ref={leftRef}
        className="pointer-events-none absolute bottom-0 -left-[18%] z-10 w-[260%] max-w-[calc(var(--hero-h)*1.2)] will-change-transform sm:-left-[20%] sm:w-[150%] lg:-left-[8%] lg:w-[80%] lg:max-w-[calc(var(--hero-h)*1.35)]"
      >
        <Image src={leftMountainImg} alt="" priority sizes="(min-width: 1024px) 80vw, (min-width: 640px) 150vw, 260vw" className="h-auto w-full" />
      </div>

      {/* Product group — its artwork ends flat at the base, so it sits on the hero's lower edge */}
      <div
        ref={packetsRef}
        className="absolute bottom-0 left-1/2 z-20 w-[min(104vw,calc(var(--hero-h)*0.9),60rem)] -translate-x-1/2 will-change-transform sm:w-[min(92vw,calc(var(--hero-h)*0.9),60rem)] lg:w-[min(94vw,var(--hero-h),72rem)]"
      >
        <Image
          src={packetsImg}
          alt="RUCHI Elaichi Chai, RUCHI Utkarsh Premium Kadak Chai and RUCHI Utkal Dust tea packets"
          priority
          sizes="(min-width: 1024px) 72rem, (min-width: 640px) 92vw, 104vw"
          className="h-auto w-full drop-shadow-[0_18px_24px_rgba(20,40,20,0.22)]"
        />
      </div>

      {/* Right mountain — the near layer with the tea pickers; dropped below the bottom edge on desktop so its
          cliff overlaps only the lower, outer part of the Utkal packet and the names stay clear */}
      <div
        ref={rightRef}
        className="pointer-events-none absolute -bottom-[83vw] -right-[10%] z-30 w-[170%] max-w-[calc(var(--hero-h)*1.12)] will-change-transform sm:bottom-0 sm:z-[15] sm:-right-[12%] sm:w-[140%] lg:-right-[6%] lg:-bottom-[16%] lg:z-30 lg:w-[66%]"
      >
        <Image src={rightMountainImg} alt="" priority sizes="(min-width: 1024px) 66vw, (min-width: 640px) 140vw, 170vw" className="h-auto w-full" />
      </div>

      {/* Bottom gradient — its own static layer: never animated, never attached to a moving element */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[26%] bg-gradient-to-t from-black/60 via-black/20 to-transparent"
      />

      {/* Copy — over the calm upper sky, clear of the transparent header. No CTA by design. */}
      <div
        ref={copyRef}
        className="relative z-50 mx-auto flex max-w-3xl flex-col items-center px-5 pt-[calc(var(--hdr,4rem)+clamp(1rem,4svh,3rem))] text-center"
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#0e6337]">{COPY.eyebrow}</p>
        <h1
          id="tea-hero-heading"
          className="mt-3 font-serif text-[clamp(1.85rem,4.6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#10331f]"
        >
          {COPY.headline}
        </h1>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-[#10331f]/80 sm:text-base">{COPY.support}</p>
      </div>
    </section>
  );
}
