import React from "react";

interface AwardItem {
  year: string;
  title: string;
  conferredBy: string;
}

const AWARDS: AwardItem[] = [
  {
    year: "2024",
    title: "Times Icons of Odisha Award",
    conferredBy: "The Times of India",
  },
  {
    year: "2022",
    title: "Most Promising Brand Award (Ready-to-Eat)",
    conferredBy: "Times Business Awards (presented by actor Sonu Sood)",
  },
  {
    year: "2022",
    title: "Spice Icon Award",
    conferredBy: "Global Spice Summit & Excellence Awards",
  },
  {
    year: "2021",
    title: "FLO Odisha Women's Award",
    conferredBy: "FICCI FLO & Hon'ble CM Sri Naveen Patnaik",
  },
  {
    year: "2019",
    title: "Brands of Odisha – Pride of India",
    conferredBy: "SAMBAD Corporate Excellence Awards",
  },
  {
    year: "2018",
    title: "Honorary Ph.D. in Industrial Management",
    conferredBy: "Ballsbridge University (India Habitat Centre, New Delhi)",
  },
  {
    year: "2018",
    title: "Dadhichi Award",
    conferredBy: "Prof. Ganeshi Lal, Hon'ble Governor of Odisha",
  },
  {
    year: "2017",
    title: "Best Entrepreneur Award",
    conferredBy: "Sri Kalraj Mishra, Hon'ble Minister MSME (India SME Forum)",
  },
  {
    year: "2017",
    title: "MSME Export Achievement Award",
    conferredBy: "World Trade Center & Addl. Chief Secretary, Odisha",
  },
  {
    year: "1998",
    title: "Spices House Certificate",
    conferredBy: "Spices Board, Ministry of Commerce, Govt. of India",
  },
];

export function AboutAwards() {
  return (
    <section className="relative py-10 sm:py-14 lg:py-16 bg-white" aria-label="Awards and Recognitions">
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-6 sm:mb-8 lg:mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Awards &amp; Institutional Recognitions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Recognized by government ministries, trade bodies, and industry summits for leadership, export excellence, and quality.
          </p>
        </div>

        {/* Awards list — year, title, conferring body; newest first */}
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-gray-200">
          {AWARDS.map((award) => (
            <li
              key={`${award.year}-${award.title}`}
              className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[4rem_1fr] gap-x-4 py-4 sm:py-5 border-b border-gray-200"
            >
              <span className="font-mono text-sm sm:text-base font-bold text-[#0e6337] tabular-nums pt-0.5">
                {award.year}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {award.title}
                </h3>
                <p className="mt-1 text-xs sm:text-[13px] text-gray-600 font-medium leading-relaxed">
                  <span className="text-gray-500">Conferred by </span>
                  {award.conferredBy}
                </p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
