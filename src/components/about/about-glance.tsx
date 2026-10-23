import React from "react";

// Impact & Credentials at a Glance — typography-led cards. Figures are exactly as approved.
const BIG = "font-sans font-semibold leading-none tracking-tight text-[#8B0000] text-[clamp(2rem,3.2vw,3rem)]";
const LABEL = "mt-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1A1A1A]";
const BODY = "mt-2.5 font-sans text-xs leading-relaxed text-[#1A1A1A]/75";

const CARD =
  "flex h-full w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-[#1A1A1A]/10 bg-white p-6 shadow-[0_1px_2px_rgba(26,26,26,0.04)] motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-200 hover:border-[#168a4a] hover:shadow-[0_8px_24px_rgba(26,26,26,0.08)] motion-safe:hover:-translate-y-0.5 sm:w-[280px] lg:w-auto lg:p-5 xl:p-6";

export function AboutGlance() {
  return (
    <section
      className="w-full bg-[#F8F5F0] py-10 sm:py-14 lg:py-16"
      aria-labelledby="glance-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 sm:mb-8 lg:mb-10 max-w-3xl text-center">
          <h2
            id="glance-heading"
            className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-[#1A1A1A]"
          >
            Impact &amp; Credentials at a Glance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[#1A1A1A]/75 sm:text-base">
            Five decades of quality, trust, and culinary expertise — reaching households and markets across the globe.
          </p>
        </div>

        {/* One line of five cards: grid on desktop, swipeable single row on narrower screens */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-[1fr_1.05fr_1fr_1.3fr_1.35fr] lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {/* 1 — Legacy */}
          <article className={`${CARD}`}>
            <p className={BIG}>50+</p>
            <h3 className={LABEL}>Years of Excellence</h3>
            <p className={BODY}>Built on five decades of consumer trust, innovation, and culinary heritage.</p>
          </article>

          {/* 2 — Certifications */}
          <article className={`${CARD}`}>
            <p className="font-sans text-[clamp(1.375rem,2.2vw,1.75rem)] font-semibold leading-tight tracking-tight text-[#8B0000]">
              CRISIL SME 2
            </p>
            <p className="mt-2 font-sans text-[clamp(1rem,1.5vw,1.25rem)] font-semibold leading-tight tracking-tight text-[#1A1A1A] break-words">
              ISO 22000:2018
            </p>
            <h3 className={LABEL}>Rated &amp; Certified</h3>
            <p className={BODY}>Adhering to high food safety and financial governance standards.</p>
          </article>

          {/* 3 — Product Quality */}
          <article className={`${CARD}`}>
            <p className={BIG}>100%</p>
            <h3 className={LABEL}>Purity Guarantee</h3>
            <p className={BODY}>
              Farm-sourced spices, 100% durum wheat suji pasta with zero maida, non-sticky vermicelli, and strong-bodied tea.
            </p>
          </article>

          {/* 4 — Global Reach */}
          <article className={`${CARD}`}>
            <p className={BIG}>10+</p>
            <h3 className={LABEL}>Export Markets</h3>
            <p className={BODY}>
              Supplying international markets across the USA, UK, Canada, Italy, Germany, Australia, Singapore, Dubai, Muscat,
              Kuwait, Tanzania, Nepal, and Bangladesh.
            </p>
          </article>

          {/* 5 — Distribution Network */}
          <article className={`${CARD}`}>
            <dl className="grid grid-cols-2 gap-3 xl:gap-5">
              <div className="flex min-w-0 flex-col-reverse justify-end">
                <dt className="mt-2.5 font-sans text-[10px] font-semibold uppercase leading-snug tracking-[0.1em] text-[#1A1A1A]">
                  Authorized Dealers in Odisha
                </dt>
                <dd className={BIG}>200+</dd>
              </div>
              <div className="flex min-w-0 flex-col-reverse justify-end border-l border-[#1A1A1A]/10 pl-3 xl:pl-5">
                <dt className="mt-2.5 font-sans text-[10px] font-semibold uppercase leading-snug tracking-[0.1em] text-[#1A1A1A]">
                  Super Stockists Nationwide
                </dt>
                <dd className={BIG}>40+</dd>
              </div>
            </dl>
            <h3 className="sr-only">Distribution Network</h3>
            <p className={BODY}>
              Supported by over 200 authorized dealers in Odisha and more than 40 super stockists nationwide.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export const AboutLegacyQuality = AboutGlance;
