import React from "react";
import Image from "next/image";
import aboutImg2 from "@/assets/Images/about section/2.png";

export function AboutHeritage() {
  return (
    <section id="heritage-story" className="relative min-h-[100svh] flex flex-col justify-center py-12 sm:py-16 md:py-20 bg-white overflow-hidden border-b border-gray-200/80" aria-label="Our Beginning and Heritage Story">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          
          {/* Visual Column (Left) — Large Archival/Manufacturing Visual & Floating Card */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 shadow-lg aspect-4/3 sm:aspect-16/10 bg-stone-900 group">
              <Image
                src={aboutImg2}
                alt="Ruchi Foodline Heritage and Spice Manufacturing Facility in Cuttack"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 text-white text-xs sm:text-sm">
                <p className="font-serif text-sm sm:text-base font-medium text-stone-200 leading-snug">
                  From a small flour and oil mill to Eastern India&apos;s pioneering food processing icon.
                </p>
              </div>
            </div>

            {/* Secondary Floating Detail Card */}
            <div className="hidden sm:block absolute -bottom-6 -right-4 bg-[#f7f6f2] border border-gray-200/90 p-4 rounded-xl shadow-md max-w-xs">
              <div className="text-xs">
                <div className="font-bold text-gray-900">Om Oil &amp; Flour Mills Ltd.</div>
                <div className="text-gray-500 font-mono text-[11px]">CIN: U15495OR1997PLC004861</div>
              </div>
            </div>
          </div>

          {/* Narrative Story Column (Right) */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Born in Odisha, Grown with Relentless Passion.
              </h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed font-normal">
              <p>
                The story of <strong>Om Oil &amp; Flour Mills Ltd.</strong> began on the industrial landscape of <strong>Cuttack, Odisha, in June 1976</strong>.
                Founded by the visionary late <strong>Dr. Sarat Kumar Sahoo</strong> alongside his father, the late <strong>Banamali Sahoo</strong>,
                the enterprise started as a humble flour and oil mill.
              </p>
              <p>
                Driven by uncompromising perseverance, Dr. Sahoo identified the urgent need for hygienic, unadulterated food staples and introduced packaged pure ground spices under the trademark name <strong>&apos;RUCHI&apos;</strong>. In March 1997, the company incorporated as a private limited entity, progressing to a full Limited Company in 1999.
              </p>
              <p>
                Recognizing evolving global dietary standards, Dr. Sahoo traveled extensively across <strong>Italy, South Korea, the UK, USA, Germany, Australia, and Singapore</strong> to study world-class food processing technology. In <strong>1998</strong>, Ruchi established <strong>Eastern India&apos;s first Italian Pasta manufacturing plant</strong> in Cuttack, importing automated extruders directly from Italy and South Korea.
              </p>
              <p>
                Today, the company continues its expansion with the new state-of-the-art <strong>Ramdaspur Unit</strong>—dedicated to high-capacity spices, suji pasta, spaghetti, and vermicelli production, which commenced commercial operations in <strong>June 2025</strong>.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-6 text-xs font-medium text-gray-600">
              <div>
                <span>Khapuria &amp; Ramdaspur, Cuttack</span>
              </div>
              <div>
                <span>1st Italian Pasta Plant in Eastern India</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
