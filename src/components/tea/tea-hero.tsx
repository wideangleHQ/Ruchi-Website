"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BEIGE = "#F3EBDD";

export function TeaHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { reduceMotion, isMobile } = context.conditions as {
            reduceMotion: boolean;
            isMobile: boolean;
          };

          if (reduceMotion) {
            sectionRef.current!.style.height = "100vh";
            return;
          }

          sectionRef.current!.style.height = "320vh";

          const rot1 = isMobile ? -1 : -2;
          const rot2 = isMobile ? 1.5 : 3;
          const rot3 = isMobile ? 0.5 : 1;
          const minScale = isMobile ? 0.22 : 0.14;

          const tl = gsap.timeline({ defaults: { ease: "none" } });

          // Phase 1 (0–20%): calm hold, video fills the viewport
          tl.to(videoWrapRef.current, { scaleX: 1, scaleY: 1, duration: 0.2 })
            // Phase 2 (20–50%): begins pinching + rotating, beige starts to show
            .to(
              videoWrapRef.current,
              { scaleX: 0.72, scaleY: 0.68, rotate: rot1, borderRadius: 28, duration: 0.3 },
              0.2
            )
            // Phase 3 (50–75%): becomes a centered editorial object
            .to(
              videoWrapRef.current,
              { scaleX: 0.46, scaleY: 0.44, rotate: rot2, borderRadius: 40, duration: 0.25 },
              0.5
            )
            // Phase 4 (75–95%): compresses toward its center
            .to(
              videoWrapRef.current,
              { scaleX: minScale + 0.08, scaleY: minScale + 0.06, rotate: rot3, borderRadius: 48, duration: 0.2 },
              0.75
            )
            // Phase 5 (95–100%): final vanish
            .to(
              videoWrapRef.current,
              { scaleX: minScale, scaleY: minScale, opacity: 0, duration: 0.05 },
              0.95
            )
            // Scrim fades once the video is no longer full-bleed
            .to(scrimRef.current, { opacity: 0, duration: 0.3 }, 0.35)
            // Headline hands off from "on video" white to "on beige" ink
            .to(headlineRef.current, { color: "var(--color-text)", duration: 0.35 }, 0.55);

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            animation: tl,
            invalidateOnRefresh: true,
          });

          // The trigger's range is measured from the DOM synchronously above,
          // but late-loading fonts/video metadata can still shift layout —
          // re-measure once things settle so the pinned range stays accurate.
          ScrollTrigger.refresh();
        }
      );
    }, sectionRef);

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full" style={{ height: "320vh" }}>
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: BEIGE }}
      >
        <div
          ref={videoWrapRef}
          className="absolute inset-0 origin-center overflow-hidden will-change-transform"
        >
          <video
            className="h-full w-full object-cover"
            src="/videos/tea-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>

        <div
          ref={scrimRef}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/45"
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-accent-gold">
            Ruchi Utkal Tea
          </span>
          <h1
            ref={headlineRef}
            className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.25)" }}
          >
            Some moments
            <br />
            are meant to be slow.
          </h1>
        </div>
      </div>
    </section>
  );
}
