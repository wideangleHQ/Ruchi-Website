import React from "react";
import { Trophy } from "lucide-react";

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
    <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-b border-gray-200/80" aria-label="Awards and Recognitions">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="text-xs font-bold text-[#168a4a] uppercase tracking-wider block mb-1.5">
            Eminence &amp; Credentials
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            Awards &amp; Institutional Recognitions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
            Recognized by government ministries, trade bodies, and industry summits for leadership, export excellence, and quality.
          </p>
        </div>

        {/* Refined Awards Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {AWARDS.map((award, idx) => (
            <div
              key={idx}
              className="bg-[#f7f6f2] hover:bg-white rounded-xl p-5 border border-gray-200/80 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition-all duration-300 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-[#eef6ec] text-[#0e6337] flex items-center justify-center shrink-0 mt-0.5">
                <Trophy className="w-5 h-5 text-[#168a4a]" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#168a4a] bg-white px-2 py-0.5 rounded border border-gray-200">
                    {award.year}
                  </span>
                  <span className="text-[11px] font-medium text-gray-500">Conferred by</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {award.title}
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  {award.conferredBy}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
