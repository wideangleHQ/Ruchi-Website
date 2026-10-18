import React from "react";
import Image from "next/image";
import founderImg from "@/assets/Images/founder-sarat-kumar-sahoo.png";

export function AboutLeadership() {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-8 sm:py-12 bg-white border-b border-gray-200/80" aria-label="Founder and Leadership">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Founder&apos;s Philosophy &amp; Leadership
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Rooted in the timeless wisdom of our founders and driven forward by visionary stewardship.
          </p>
        </div>

        {/* 1. FOUNDER MEMORIAL TRIBUTE (Late Dr. Sarat Kumar Sahoo) */}
        <div className="bg-[#f7f6f2] rounded-2xl border border-gray-200/90 p-5 sm:p-7 lg:p-8 mb-4 sm:mb-6 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Founder Portrait Column */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-36 h-44 sm:w-44 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-600/30 shadow-md bg-stone-900 mb-3">
                <Image
                  src={founderImg}
                  alt="Late Dr. Sarat Kumar Sahoo — Founder, Ruchi Foodline (Om Oil & Flour Mills Ltd.)"
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900">
                Late Dr. Sarat Kumar Sahoo
              </h3>
              <p className="text-xs text-gray-600 mt-0.5 font-medium">
                Founder, Om Oil &amp; Flour Mills Ltd. (1976)
              </p>
            </div>

            {/* Founder Philosophy & Quotes Column */}
            <div className="lg:col-span-8 space-y-4">
              <div className="border-l-4 border-[#0e6337] pl-4 sm:pl-6 space-y-1.5">
                <div className="text-xs font-bold text-[#168a4a] uppercase tracking-wider">
                  The Founder&apos;s Creed on Industrial Success
                </div>
                <blockquote className="font-serif text-sm sm:text-base md:text-lg text-gray-900 italic leading-relaxed">
                  &ldquo;Quality, Hard Work, Honesty and Developed Technology are the basic elements for the success of any industrial house. Success depends entirely on wholehearted effort, perseverance and honesty. Industrialists should not run after assistance or subsidies; the only thing required for success is unwavering devotion and relentless work. Health and hygiene are always kept in our mind—the health of our consumers is our wealth and only motto.&rdquo;
                </blockquote>
              </div>

              {/* Hope vs Despair Philosophy */}
              <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs space-y-1.5">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  On Hope vs. Despair
                </div>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic">
                  &ldquo;Life is a constant struggle between two powerful forces: Hope and Despair. If you struggle with despair, negative outcomes will surround you and pull you down so heavily that you cannot rise. But if you struggle with hope, every positive thought will shape your decisions, and success will surely knock at your door.&rdquo;
                </p>
              </div>

              {/* Co-founder tribute */}
              <div className="pt-1 text-xs text-gray-600">
                <p>
                  <strong>Late Banamali Sahoo (Co-Founder):</strong> Partnered with his son Dr. Sarat Kumar Sahoo during the company&apos;s inception in 1976, instilling enduring traditional values, discipline, and moral wisdom into the enterprise.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 2. MANAGING DIRECTOR MESSAGE (Mr. Arbind Sahoo) */}
        <div className="bg-[#0a4626] text-white rounded-2xl p-5 sm:p-7 lg:p-8 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-8 space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                50 Saal Aapke Sehat Ke Saath
              </h3>
              <blockquote className="font-serif text-xs sm:text-sm md:text-base text-emerald-100/90 leading-relaxed">
                &ldquo;As we celebrate 50 years of trust (&apos;50 Saal Aapke Sehat Ke Saath&apos;), our commitment to every kitchen remains unchanged. From pioneering modern pasta manufacturing in Eastern India to bringing authentic heritage spices to global markets, we continue to blend cutting-edge food processing technology with uncompromised purity. We thank our millions of consumers, dealers, and partners for walking this journey with us.&rdquo;
              </blockquote>
              <div>
                <div className="font-bold text-white text-sm sm:text-base">Mr. Arbind Sahoo</div>
                <div className="text-xs text-emerald-300">Managing Director, Om Oil &amp; Flour Mills Ltd. (Ruchi Foodline)</div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 space-y-1.5 text-xs text-emerald-100">
              <div className="font-bold text-white text-sm">Strategic Expansion Pillars</div>
              <p className="leading-relaxed text-[11px] sm:text-xs">
                Leading corporate governance, digital transformation, quick-commerce expansion, and global export strategy for Ruchi Foodline across 10+ nations.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
