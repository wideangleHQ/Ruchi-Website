import React from "react";

export function AboutCSR() {
  const csrPillars = [
    {
      title: "RUCHI Prativa Samman",
      subtitle: "'Born in Odisha, Pride of India'",
      description:
        "Annual national awards honoring outstanding scholars, artists, scientists, innovators, and sports personalities who bring pride to the nation.",
    },
    {
      title: "Educational Advancement",
      subtitle: "Scholarships & Skill Building",
      description:
        "Providing educational aid, scholarships, and academic support to underprivileged students across rural and suburban Odisha.",
    },
    {
      title: "Healthcare & Welfare",
      subtitle: "Community Health Initiatives",
      description:
        "Conducting health camps, emergency medical assistance, and community wellness programs supporting local families and workforce welfare.",
    },
    {
      title: "Social Welfare & Giving",
      subtitle: "Active Since 1997",
      description:
        "Over 28 years of dedicated charitable service, disaster relief support, and socio-economic empowerment across Eastern India.",
    },
  ];

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center py-8 sm:py-12 bg-[#faf9f6] border-b border-gray-200/80" aria-label="Social Responsibility">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 sm:mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            RUCHI Prativa Foundation (Est. 1997)
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Championing social welfare, healthcare, and educational advancement under the ethos &apos;Born in Odisha, Pride of India&apos;.
          </p>
        </div>

        {/* 4 CSR Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {csrPillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
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
          ))}
        </div>

      </div>
    </section>
  );
}
