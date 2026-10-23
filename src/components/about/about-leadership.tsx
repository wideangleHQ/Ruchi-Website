import React from "react";
import Image from "next/image";
import founderImg from "@/assets/Images/Dr. Sarat Kumar Sahoo.png";

export function AboutLeadership() {
  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-white" aria-labelledby="founder-heading">
      {/* Founder — portrait left, philosophy right */}
      <div className="mx-auto flex w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8 mb-10 sm:mb-14 lg:mb-16">
        <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-[clamp(2rem,4vw,5rem)]">
          {/* Portrait */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg lg:h-[min(80svh,52rem)] lg:max-w-none lg:aspect-auto">
            <Image
              src={founderImg}
              alt="Late Dr. Sarat Kumar Sahoo — Founder, Ruchi Foodline (Om Oil & Flour Mills Ltd.)"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-contain object-bottom"
            />
          </div>

          {/* Philosophy */}
          <div className="max-w-[44rem] self-center pb-2 pt-6 lg:-ml-[clamp(0.5rem,1.5vw,2rem)] lg:py-0">
            <p className="font-sans text-[clamp(0.75rem,0.9vw,0.95rem)] font-semibold uppercase tracking-[0.18em] text-[#0e6337]/80">
              Our Founder
            </p>
            <h2
              id="founder-heading"
              className="mt-2 font-serif text-[clamp(1.75rem,3.2vw,3.75rem)] font-bold leading-[1.1] tracking-tight text-[#0e6337]"
            >
              Founder&apos;s Philosophy &amp; Leadership
            </h2>
            <p className="mt-3 font-sans text-[clamp(0.95rem,1.05vw,1.2rem)] leading-relaxed text-[#1A1A1A]/80">
              Rooted in the timeless wisdom of our founders and driven forward by visionary stewardship.
            </p>

            <div className="mt-[clamp(1rem,2vw,2rem)] space-y-4 font-sans text-[clamp(0.95rem,1.05vw,1.2rem)] leading-relaxed text-[#1A1A1A]">
              <p>
                &ldquo;Quality, Hard Work, Honesty and Developed Technology are the basic elements for the success of any industrial house. Success depends entirely on wholehearted effort, perseverance and honesty. Industrialists should not run after assistance or subsidies; the only thing required for success is unwavering devotion and relentless work. Health and hygiene are always kept in our mind—the health of our consumers is our wealth and only motto.&rdquo;
              </p>
              <p>
                &ldquo;Life is a constant struggle between two powerful forces: Hope and Despair. If you struggle with despair, negative outcomes will surround you and pull you down so heavily that you cannot rise. But if you struggle with hope, every positive thought will shape your decisions, and success will surely knock at your door.&rdquo;
              </p>
            </div>

            <div className="mt-[clamp(1rem,2vw,2rem)] border-t border-[#1A1A1A]/10 pt-4">
              <p className="font-serif text-[clamp(1.125rem,1.5vw,1.5rem)] font-bold text-[#1A1A1A]">
                Late Dr. Sarat Kumar Sahoo
              </p>
              <p className="font-sans text-[clamp(0.85rem,0.95vw,1rem)] text-[#1A1A1A]/70">
                Founder, Om Oil &amp; Flour Mills Ltd. (1976)
              </p>
              <p className="mt-3 font-sans text-[clamp(0.8rem,0.9vw,0.95rem)] leading-relaxed text-[#1A1A1A]/70">
                <strong className="font-semibold text-[#1A1A1A]">Late Banamali Sahoo (Co-Founder):</strong> Partnered with his son Dr. Sarat Kumar Sahoo during the company&apos;s inception in 1976, instilling enduring traditional values, discipline, and moral wisdom into the enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Managing Director's message — approved copy retained, presented as plain editorial text */}
      <div>
        <div className="mx-auto grid w-full max-w-[1400px] gap-6 px-4 sm:px-6 lg:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-[clamp(2rem,4vw,5rem)]">
          <h3 className="font-serif text-[clamp(1.25rem,2vw,2rem)] font-bold leading-tight text-[#0e6337]">
            50 Saal Aapke Sehat Ke Saath
          </h3>
          <div className="max-w-[44rem]">
            <p className="font-sans text-[clamp(0.95rem,1.05vw,1.2rem)] leading-relaxed text-[#1A1A1A]">
              &ldquo;As we celebrate 50 years of trust (&apos;50 Saal Aapke Sehat Ke Saath&apos;), our commitment to every kitchen remains unchanged. From pioneering modern pasta manufacturing in Eastern India to bringing authentic heritage spices to global markets, we continue to blend cutting-edge food processing technology with uncompromised purity. We thank our millions of consumers, dealers, and partners for walking this journey with us.&rdquo;
            </p>
            <p className="mt-4 font-sans text-[clamp(0.95rem,1.05vw,1.2rem)] font-semibold text-[#1A1A1A]">Mr. Arbind Sahoo</p>
            <p className="font-sans text-[clamp(0.85rem,0.95vw,1rem)] font-semibold text-[#1A1A1A]/85">
              Managing Director, Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)
            </p>
            <p className="mt-3 font-sans text-[clamp(0.8rem,0.9vw,0.95rem)] leading-relaxed text-[#1A1A1A]/70">
              Leading corporate governance, digital transformation, quick-commerce expansion, and global export strategy for Ruchi Foodline across 10+ nations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
