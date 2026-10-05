import React from "react";
import { Compass, Target, Quote } from "lucide-react";

export function AboutVisionMission() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-b border-gray-200/80" aria-label="Vision and Mission">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
            Purpose &amp; Guiding Light
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Our Vision &amp; Mission
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
            Preserving culinary heritage while pioneering modern food technology to protect the health of every family.
          </p>
        </div>

        {/* Two Large Editorial Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          
          {/* OUR VISION PANEL */}
          <div className="relative rounded-2xl bg-[#0a4626] text-white p-8 sm:p-10 lg:p-12 shadow-sm flex flex-col justify-between overflow-hidden group">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs text-emerald-300 text-xs font-bold uppercase tracking-wider border border-white/10">
                  <Compass className="w-3.5 h-3.5" /> Our Vision
                </div>
                <Quote className="w-8 h-8 text-emerald-400/30" />
              </div>

              <blockquote className="font-serif text-lg sm:text-xl md:text-2xl font-normal text-stone-100 leading-relaxed">
                &ldquo;To be a globally cherished food brand that seamlessly bridges authentic Indian culinary heritage with world-class food technology—delivering 100% pure, healthy, and delightful food products to every kitchen across the globe.&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200/80">
              <span className="font-semibold text-white">Global Reach &amp; Authentic Roots</span>
              <span>1976 – 2026</span>
            </div>
          </div>

          {/* OUR MISSION PANEL */}
          <div className="relative rounded-2xl bg-[#f7f6f2] border border-gray-200 p-8 sm:p-10 lg:p-12 shadow-sm flex flex-col justify-between overflow-hidden group">
            {/* Subtle background texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef6ec] text-[#0e6337] text-xs font-bold uppercase tracking-wider border border-[#c4d7c0]">
                  <Target className="w-3.5 h-3.5 text-[#168a4a]" /> Our Mission
                </div>
                <Quote className="w-8 h-8 text-gray-300" />
              </div>

              <blockquote className="font-serif text-base sm:text-lg md:text-xl font-normal text-gray-900 leading-relaxed">
                &ldquo;Driven by unwavering devotion, honesty, and innovation, our mission is to enrich everyday lives by providing pure, hygienic, and convenient food products. We commit to upholding the health of our consumers as our highest motto, empowering local farming communities, and honoring 50 years of trust in every packet we produce.&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span className="font-semibold text-gray-900">Farmer Prosperity &amp; Consumer Health</span>
              <span className="text-[#168a4a] font-bold">50 Saal Aapke Sehat Ke Saath</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
