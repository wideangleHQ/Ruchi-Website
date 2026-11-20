import React from "react";
import Image from "next/image";
import founderImg from "@/assets/Images/Dr. Sarat Kumar Sahoo.png";

export function AboutLeadership() {
  return (
    <section
      className="relative py-8 sm:py-10 lg:py-11 xl:py-13 bg-white"
      aria-labelledby="founder-heading"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Header — Rhythmic, centered, aligned with Vision & Mission / Glance */}
        <div className="mx-auto mb-6 sm:mb-8 lg:mb-10 max-w-3xl text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#0e6337]">
            Our Founder &amp; Leadership
          </p>
          <h2
            id="founder-heading"
            className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold leading-tight tracking-tight text-gray-900"
          >
            Founder&apos;s Philosophy &amp; Leadership
          </h2>
          <p className="mx-auto mt-3 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-gray-600">
            Rooted in the timeless wisdom of our founders and driven forward by visionary stewardship.
          </p>
        </div>

        {/* Founder Feature Card — Refined Editorial Composition */}
        <div className="rounded-3xl border border-stone-200/90 bg-[#faf9f6] p-5 sm:p-7 lg:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12">
            
            {/* Left Column: Founder Portrait in an Intentional Editorial Frame */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none">
                {/* Portrait Canvas with Soft Tonal Backing & Pedestal */}
                <div className="relative h-[290px] sm:h-[350px] md:h-[390px] lg:h-[450px] xl:h-[480px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#f2efe9] via-[#e8e4dc] to-[#ded9ce] border border-stone-200/80 shadow-2xs flex items-end justify-center">
                  <Image
                    src={founderImg}
                    alt="Late Dr. Sarat Kumar Sahoo — Founder, Ruchi Foodline (Om Oil & Flour Mills Ltd.)"
                    fill
                    priority
                    sizes="(min-width: 1024px) 38vw, (min-width: 640px) 70vw, 92vw"
                    className="object-contain object-bottom select-none"
                  />
                  {/* Subtle bottom vignette to smoothly anchor portrait */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-stone-900/10 to-transparent pointer-events-none" />
                </div>

                {/* Elegant Nameplate Plaque */}
                <div className="mt-3.5 rounded-xl border border-stone-200/80 bg-white/95 px-4 py-3 text-center shadow-2xs backdrop-blur-xs">
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-gray-900">
                    Late Dr. Sarat Kumar Sahoo
                  </h3>
                  <p className="mt-0.5 font-sans text-xs sm:text-sm font-medium text-[#0e6337]">
                    Founder, Om Oil &amp; Flour Mills Ltd. (1976)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Founder's Philosophy & Heritage Words */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 lg:space-y-6">
              {/* Primary Quote 1: Purity, Devotion & Consumer Health */}
              <div className="relative pl-4 sm:pl-5 border-l-2 border-[#168a4a]">
                <blockquote className="font-serif text-[15px] sm:text-base lg:text-[17px] xl:text-[18px] leading-relaxed text-gray-800 italic">
                  &ldquo;Quality, Hard Work, Honesty and Developed Technology are the basic elements for the success of any industrial house. Success depends entirely on wholehearted effort, perseverance and honesty. Industrialists should not run after assistance or subsidies; the only thing required for success is unwavering devotion and relentless work. Health and hygiene are always kept in our mind—the health of our consumers is our wealth and only motto.&rdquo;
                </blockquote>
              </div>

              {/* Quote 2: Hope vs Despair */}
              <div className="rounded-2xl bg-white/80 border border-stone-200/70 p-4 sm:p-5 text-gray-700">
                <p className="font-sans text-xs sm:text-sm lg:text-[15px] leading-relaxed text-gray-700">
                  &ldquo;Life is a constant struggle between two powerful forces: <strong className="font-semibold text-gray-900">Hope and Despair</strong>. If you struggle with despair, negative outcomes will surround you and pull you down so heavily that you cannot rise. But if you struggle with hope, every positive thought will shape your decisions, and success will surely knock at your door.&rdquo;
                </p>
              </div>

              {/* Co-Founder Honor Block */}
              <div className="rounded-2xl border border-emerald-900/10 bg-[#eef6ec]/60 p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-sm sm:text-base font-bold text-gray-900">
                    Late Banamali Sahoo
                  </span>
                  <span className="inline-block rounded-full bg-[#0e6337] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                    Co-Founder
                  </span>
                </div>
                <p className="mt-2 font-sans text-xs sm:text-sm leading-relaxed text-gray-700">
                  Partnered with his son Dr. Sarat Kumar Sahoo during the company&apos;s inception in 1976, instilling enduring traditional values, discipline, and moral wisdom into the enterprise.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Contemporary Leadership & Stewardship — Mr. Arbind Sahoo */}
        <div className="mt-6 sm:mt-8 lg:mt-10 rounded-3xl border border-stone-200/90 bg-white p-5 sm:p-7 lg:p-9 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* Left: MD Leadership Details */}
            <div className="lg:col-span-4 flex flex-col justify-center">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0e6337]">
                Continuing the Vision
              </span>
              <h3 className="mt-1 font-serif text-xl sm:text-2xl lg:text-[26px] font-bold leading-tight text-[#0e6337]">
                50 Saal Aapke Sehat Ke Saath
              </h3>
              
              <div className="mt-4 border-t border-stone-200/80 pt-3.5">
                <p className="font-serif text-base sm:text-lg font-bold text-gray-900">
                  Mr. Arbind Sahoo
                </p>
                <p className="font-sans text-xs sm:text-sm font-semibold text-[#0e6337]">
                  Managing Director, Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)
                </p>
                <p className="mt-2 font-sans text-xs sm:text-[13px] leading-relaxed text-gray-600">
                  Leading corporate governance, digital transformation, quick-commerce expansion, and global export strategy for Ruchi Foodline across 10+ nations.
                </p>
              </div>
            </div>

            {/* Right: Managing Director's Message */}
            <div className="lg:col-span-8">
              <div className="relative rounded-2xl border border-stone-200/70 bg-[#faf9f6] p-5 sm:p-6 lg:p-7">
                <blockquote className="font-sans text-sm sm:text-base lg:text-[16px] leading-relaxed text-gray-800 italic">
                  &ldquo;As we celebrate 50 years of trust (&apos;50 Saal Aapke Sehat Ke Saath&apos;), our commitment to every kitchen remains unchanged. From pioneering modern pasta manufacturing in Eastern India to bringing authentic heritage spices to global markets, we continue to blend cutting-edge food processing technology with uncompromised purity. We thank our millions of consumers, dealers, and partners for walking this journey with us.&rdquo;
                </blockquote>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
