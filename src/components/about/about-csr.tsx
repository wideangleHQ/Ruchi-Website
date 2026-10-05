import React from "react";
import { Heart, GraduationCap, Stethoscope, Award, Sparkles } from "lucide-react";

export function AboutCSR() {
  const csrPillars = [
    {
      title: "RUCHI Prativa Samman",
      subtitle: "'Born in Odisha, Pride of India'",
      description:
        "Annual national awards honoring outstanding scholars, artists, scientists, innovators, and sports personalities who bring pride to the nation.",
      icon: Award,
    },
    {
      title: "Educational Advancement",
      subtitle: "Scholarships & Skill Building",
      description:
        "Providing educational aid, scholarships, and academic support to underprivileged students across rural and suburban Odisha.",
      icon: GraduationCap,
    },
    {
      title: "Healthcare & Welfare",
      subtitle: "Community Health Initiatives",
      description:
        "Conducting health camps, emergency medical assistance, and community wellness programs supporting local families and workforce welfare.",
      icon: Stethoscope,
    },
    {
      title: "Social Welfare & Giving",
      subtitle: "Active Since 1997",
      description:
        "Over 28 years of dedicated charitable service, disaster relief support, and socio-economic empowerment across Eastern India.",
      icon: Heart,
    },
  ];

  return (
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Social Responsibility">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eef6ec] text-[#0e6337] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#168a4a]" /> Giving Back
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            RUCHI Prativa Foundation (Est. 1997)
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Championing social welfare, healthcare, and educational advancement under the ethos &apos;Born in Odisha, Pride of India&apos;.
          </p>
        </div>

        {/* 4 CSR Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {csrPillars.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#eef6ec] text-[#0e6337] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-bold text-[#168a4a] uppercase tracking-wider mb-1">
                    {item.subtitle}
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
