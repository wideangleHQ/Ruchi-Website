"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import {
  Noto_Serif_Bengali,
  Noto_Serif_Devanagari,
  Noto_Serif_Gujarati,
  Noto_Serif_Gurmukhi,
  Noto_Serif_Kannada,
  Noto_Serif_Malayalam,
  Noto_Serif_Oriya,
  Noto_Serif_Tamil,
  Noto_Serif_Telugu,
} from "next/font/google";
import teaLogo from "@/assets/Images/Tea/Tea Logo.png";

// Native-script faces, self-hosted by next/font and only referenced by this Tea-page component.
// `preload: false` — each script's file is fetched by the browser when (and only if) the intro renders it.
// (next/font needs a literal options object per call — no shared spread.)
const deva = Noto_Serif_Devanagari({ weight: "700", display: "swap", preload: false, subsets: ["devanagari"] });
const oriya = Noto_Serif_Oriya({ weight: "700", display: "swap", preload: false, subsets: ["oriya"] });
const telugu = Noto_Serif_Telugu({ weight: "700", display: "swap", preload: false, subsets: ["telugu"] });
const tamil = Noto_Serif_Tamil({ weight: "700", display: "swap", preload: false, subsets: ["tamil"] });
const malayalam = Noto_Serif_Malayalam({ weight: "700", display: "swap", preload: false, subsets: ["malayalam"] });
const bengali = Noto_Serif_Bengali({ weight: "700", display: "swap", preload: false, subsets: ["bengali"] });
const kannada = Noto_Serif_Kannada({ weight: "700", display: "swap", preload: false, subsets: ["kannada"] });
const gujarati = Noto_Serif_Gujarati({ weight: "700", display: "swap", preload: false, subsets: ["gujarati"] });
const gurmukhi = Noto_Serif_Gurmukhi({ weight: "700", display: "swap", preload: false, subsets: ["gurmukhi"] });

// "RUCHI" stays fixed; only the word for tea changes. `lang` keeps shaping and screen readers correct.
const WORDS: Array<{ text: string; lang: string; font?: { className: string; style: { fontFamily: string } } }> = [
  { text: "TEA", lang: "en" },
  { text: "चाय", lang: "hi", font: deva },
  { text: "ଚା", lang: "or", font: oriya },
  { text: "టీ", lang: "te", font: telugu },
  { text: "தேநீர்", lang: "ta", font: tamil },
  { text: "ചായ", lang: "ml", font: malayalam },
  { text: "চাহ", lang: "as", font: bengali },
  { text: "চা", lang: "bn", font: bengali },
  { text: "ಚಹಾ", lang: "kn", font: kannada },
  { text: "चहा", lang: "mr", font: deva },
  { text: "ચા", lang: "gu", font: gujarati },
  { text: "ਚਾਹ", lang: "pa", font: gurmukhi },
];

const GREEN = "#0e6337";
export const TEA_INTRO_DONE = "tea-intro:done";

/** Lets other Tea-page components (the hero entrance) wait until the curtain has lifted. */
export function whenTeaIntroDone(callback: () => void): () => void {
  if (typeof document === "undefined" || !document.getElementById("tea-intro")) {
    callback();
    return () => {};
  }
  window.addEventListener(TEA_INTRO_DONE, callback, { once: true });
  return () => window.removeEventListener(TEA_INTRO_DONE, callback);
}

/**
 * Tea page preloader: green screen → "RUCHI" + the word for tea written in twelve Indian scripts → the RUCHI Tea
 * badge → the green layer slides up. Plays on every load of the Tea page.
 */
export function TeaIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  // Layout effect: decides before the first client paint, so client-side navigation never flashes the curtain.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Each run of this effect owns its timeline. Strict Mode (dev) and client-side navigation can tear the effect
    // down and run it again; without this flag the first run's pending font promise would later play its reverted,
    // now-empty timeline, which completes instantly and calls finish() — removing the curtain at once.
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setActive(false);
    };

    // A client-side navigation lands wherever the previous page was scrolled, and the router's own (smooth) scroll
    // to the top stalls while the curtain locks scrolling. The curtain always opens onto the hero, so pin the top.
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    const raf = requestAnimationFrame(toTop); // again after the router's post-commit scroll handling

    // Keep keyboard focus inside the curtain while it is up; Escape skips straight to the reveal.
    root.focus({ preventScroll: true });
    let tl: gsap.core.Timeline | null = null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") e.preventDefault();
      if (e.key === "Escape" && tl) tl.progress(1);
    };
    document.addEventListener("keydown", onKey);

    const ctx = gsap.context(() => {
      const ruchi = root.querySelector<HTMLElement>("[data-ruchi]");
      const words = gsap.utils.toArray<HTMLElement>("[data-word]", root);
      const lettering = root.querySelector<HTMLElement>("[data-lettering]");
      const logo = root.querySelector<HTMLElement>("[data-logo]");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Simplified: badge on green, then a plain fade — no lettering sequence, no slide.
        gsap.set(lettering, { autoAlpha: 0 });
        tl = gsap
          .timeline({ onComplete: finish })
          .fromTo(logo, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
          .call(() => (toTop(), window.dispatchEvent(new Event(TEA_INTRO_DONE))), [], "+=0.3")
          .to(root, { autoAlpha: 0, duration: 0.3 });
        return;
      }

      // Whole intro ≤ 4 s: RUCHI + TEA written in (≈0.8 s) → the other 11 words, each written left-to-right through
      // a soft-edged mask and briefly held (0.2 s each, ≈2.2 s) → badge (≈0.55 s) → curtain lifts (0.35 s).
      gsap.set(words, { autoAlpha: 0, "--write": "-20%" });
      tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" }, onComplete: finish });
      tl.fromTo(ruchi, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 }, 0)
        .set(words[0], { autoAlpha: 1 }, 0.1)
        .fromTo(words[0], { "--write": "-20%" }, { "--write": "120%", duration: 0.5, ease: "power1.inOut" }, 0.1)
        .to({}, { duration: 0.2 });
      words.slice(1).forEach((word, i) => {
        tl!
          .set(words[i], { autoAlpha: 0 })
          .set(word, { autoAlpha: 1 })
          .fromTo(word, { "--write": "-20%" }, { "--write": "120%", duration: 0.12, ease: "power1.out" })
          .to({}, { duration: 0.08 });
      });
      tl.to(lettering, { autoAlpha: 0, duration: 0.15, ease: "power1.in" })
        .fromTo(logo, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, "<0.05")
        .to({}, { duration: 0.2 }) // hold the badge
        // The hero's own entrance starts as the curtain begins to lift (always onto the top of the page)
        .call(() => {
          toTop();
          window.dispatchEvent(new Event(TEA_INTRO_DONE));
        })
        .to(root, { yPercent: -100, duration: 0.35, ease: "power3.inOut" });

      // Fonts are usually cached after the first visit; never hold the 4 s budget for more than 100 ms.
      const faces = WORDS.filter((w) => w.font).map((w) => document.fonts.load(`700 64px ${w.font!.style.fontFamily}`, w.text));
      Promise.race([Promise.allSettled(faces), new Promise((r) => setTimeout(r, 100))]).then(() => {
        if (!cancelled) tl?.play();
      });
    }, root);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      ctx.revert();
    };
  }, []);

  if (!active) return null;

  return (
    <div
      id="tea-intro"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="RUCHI Tea"
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden outline-none will-change-transform"
      style={{ backgroundColor: GREEN }}
    >
      {/* Locks page scroll from the very first paint (before hydration); goes away with the curtain */}
      <style>{"html{overflow:hidden}"}</style>

      {/* "RUCHI word", centred as one group. Words share one baseline-aligned grid cell sized to the widest word,
          so the group stays centred and RUCHI never jumps as the scripts change. */}
      <div
        data-lettering
        className="flex items-baseline justify-center gap-[0.3em] px-4 text-[clamp(2.25rem,8.5vw,6rem)] leading-[1.5] text-[#fbf6ea]"
        aria-hidden="true"
      >
        <span data-ruchi className="font-serif font-bold tracking-[0.02em] opacity-0">
          RUCHI
        </span>
        <span className="grid items-baseline justify-items-center">
          {WORDS.map((w) => (
            <span
              key={w.lang}
              data-word
              lang={w.lang}
              className={`whitespace-nowrap font-bold opacity-0 [grid-area:1/1] ${w.font ? w.font.className : "font-serif tracking-[0.02em]"}`}
              style={{
                maskImage: "linear-gradient(90deg, #000 calc(var(--write, 120%) - 18%), transparent var(--write, 120%))",
                WebkitMaskImage: "linear-gradient(90deg, #000 calc(var(--write, 120%) - 18%), transparent var(--write, 120%))",
              }}
            >
              {w.text}
            </span>
          ))}
        </span>
      </div>

      <div data-logo className="absolute inset-0 flex items-center justify-center opacity-0">
        <Image src={teaLogo} alt="RUCHI Tea" priority sizes="(min-width: 640px) 18rem, 60vw" className="h-auto w-[min(60vw,18rem)]" />
      </div>
    </div>
  );
}
