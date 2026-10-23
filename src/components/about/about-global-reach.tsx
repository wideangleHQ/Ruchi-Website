"use client";

import React, { useEffect, useRef } from "react";

const EXPORT_REGIONS: Array<{ region: string; countries: string[]; span: string; cols?: string }> = [
  { region: "North America", countries: ["United States of America", "Canada"], span: "lg:col-span-2" },
  { region: "Europe", countries: ["United Kingdom", "Italy", "Germany"], span: "lg:col-span-2" },
  { region: "Middle East", countries: ["Dubai (UAE)", "Muscat (Oman)", "Kuwait"], span: "lg:col-span-2" },
  { region: "Africa", countries: ["Tanzania"], span: "lg:col-span-2" },
  {
    region: "Asia-Pacific",
    countries: ["Australia", "Singapore", "Taiwan", "Hong Kong", "Nepal", "Bangladesh"],
    span: "sm:col-span-2 lg:col-span-4",
    cols: "sm:columns-2 lg:columns-3",
  },
];

const NUM = "font-sans font-extrabold leading-none tracking-tight text-[clamp(2.5rem,4.6vw,4.5rem)]";
const STAT_LABEL = "mt-2 font-sans text-[clamp(0.8rem,0.95vw,0.95rem)] font-bold leading-snug";
const STAT_TEXT = "mt-1 font-sans text-[clamp(0.75rem,0.85vw,0.875rem)] font-semibold leading-relaxed";

// Large figure: digits + suffix ("+" / "%"). "light" = on solid green, "dark" = on white.
function Figure({ value, tone }: { value: string; tone: "light" | "dark" }) {
  const digits = value.replace(/[^0-9]/g, "");
  const suffix = value.slice(digits.length);
  return (
    <p className={`${NUM} ${tone === "light" ? "text-white" : "text-[#0e6337]"}`}>
      {digits}
      <span className={tone === "light" ? "text-[#bfe8cc]" : "text-[#168a4a]"}>{suffix}</span>
    </p>
  );
}

export function AboutGlobalReach() {
  const rootRef = useRef<HTMLElement | null>(null);

  // Subtle staggered reveal when the section scrolls into view. Content stays visible without JS / with reduced motion.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const inView = (el: HTMLElement) => el.getBoundingClientRect().top < window.innerHeight;
    const pending = items.filter((el) => !inView(el));
    pending.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = Number(el.dataset.reveal) * 80;
          el.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 450, delay, easing: "ease-out", fill: "backwards" }
          );
          el.style.opacity = "";
          el.style.transform = "";
          io.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative py-10 sm:py-14 lg:py-16 bg-[#F8F5F0]"
      aria-labelledby="reach-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8 lg:mb-10 max-w-3xl">
          <h2
            id="reach-heading"
            className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-tight tracking-tight text-[#1A1A1A]"
          >
            Our Reach — Across India &amp; Across the Globe
          </h2>
          <p className="mt-2 font-sans text-[clamp(0.85rem,1vw,1rem)] font-semibold leading-relaxed text-[#0b3d22]/90">
            From the heart of Odisha to household kitchens in North America, Europe, Asia-Pacific, and the Middle East.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
          {/* ---------------- Domestic distribution ---------------- */}
          <div className="min-w-0 lg:col-span-5">
            <h3 className="font-serif text-[clamp(1.125rem,1.6vw,1.5rem)] font-extrabold leading-snug text-[#0e6337]">
              Deep Roots in Odisha, Strong Presence Nationwide
            </h3>

            <div
              className="mt-4 grid gap-3 [grid-template-areas:'a'_'b'_'c'] sm:grid-cols-2 sm:[grid-template-areas:'a_a'_'b_c'] lg:grid-cols-[1.4fr_1fr] lg:gap-4 lg:[grid-template-areas:'a_b'_'a_c']"
            >
              <article
                data-reveal="0"
                className="flex min-w-0 flex-col justify-end rounded-xl bg-[#0e6337] text-white p-[clamp(1.25rem,2vw,2rem)] [grid-area:a] lg:min-h-[17rem]"
              >
                <Figure value="200+" tone="light" />
                <h4 className={STAT_LABEL}>Authorized Dealers in Odisha</h4>
                <p className={`${STAT_TEXT} text-white/90`}>Covering urban centers &amp; rural districts</p>
              </article>

              <article
                data-reveal="1"
                className="flex min-w-0 flex-col justify-end rounded-xl border border-[#168a4a]/40 bg-white text-[#0e6337] p-[clamp(1rem,1.5vw,1.5rem)] [grid-area:b]"
              >
                <Figure value="40+" tone="dark" />
                <h4 className={STAT_LABEL}>Super Stockists Nationwide</h4>
                <p className={`${STAT_TEXT} text-[#1A1A1A]/75`}>Supplying GT, MT &amp; quick commerce</p>
              </article>

              <article
                data-reveal="2"
                className="flex min-w-0 flex-col justify-end rounded-xl bg-[#168a4a] text-white p-[clamp(1rem,1.5vw,1.5rem)] [grid-area:c]"
              >
                <Figure value="100%" tone="light" />
                <h4 className={STAT_LABEL}>ERP-Enabled Logistics</h4>
                <p className={`${STAT_TEXT} text-white/95`}>Real-time inventory tracking &amp; fulfillment</p>
              </article>
            </div>
          </div>

          {/* ---------------- Global export network ---------------- */}
          <div
            data-reveal="3"
            className="min-w-0 rounded-xl border border-[#168a4a]/40 bg-white p-[clamp(1.25rem,2.2vw,2.25rem)] text-[#1A1A1A] lg:col-span-7"
          >
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              <div>
                <Figure value="10+" tone="dark" />
                <p className="mt-2 font-sans text-[clamp(0.8rem,0.95vw,0.95rem)] font-bold uppercase tracking-[0.14em] text-[#0e6337]">
                  Global Markets
                </p>
              </div>
              <h3 className="min-w-[14rem] flex-1 font-serif text-[clamp(1.125rem,1.6vw,1.5rem)] font-extrabold leading-snug text-[#0e6337]">
                Delivering Pure Indian Taste to the Diaspora &amp; Global Food Lovers
              </h3>
            </div>

            <p className="mt-3 max-w-3xl font-sans text-[clamp(0.8rem,0.9vw,0.9375rem)] font-semibold leading-relaxed text-[#1A1A1A]/85">
              Ruchi Foodline exports pure spices, blended masalas, pasta, and specialty foods to compliant international retail
              partners across North America, Europe, Africa, the Middle East, and Asia.
            </p>

            <h4 className="mt-5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-[#0e6337]">
              Key International Export Destinations
            </h4>

            <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-6">
              {EXPORT_REGIONS.map((r, i) => (
                <div
                  key={r.region}
                  data-reveal={String(4 + i)}
                  className={`min-w-0 border-t border-[#168a4a]/40 pt-3 ${r.span}`}
                >
                  <h5 className="font-sans text-[clamp(0.85rem,0.95vw,1rem)] font-bold text-[#0e6337]">{r.region}</h5>
                  <ul className={`mt-1.5 font-sans text-[clamp(0.8rem,0.9vw,0.9375rem)] font-semibold leading-relaxed text-[#1A1A1A]/85 ${r.cols ?? ""}`}>
                    {r.countries.map((c) => (
                      <li key={c} className="break-inside-avoid">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
