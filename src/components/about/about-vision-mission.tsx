import React from "react";

// Wording below is the existing approved Vision and Mission copy, unchanged.
const VISION =
  "To be a globally cherished food brand that seamlessly bridges authentic Indian culinary heritage with world-class food technology—delivering 100% pure, healthy, and delightful food products to every kitchen across the globe.";
const MISSION =
  "Driven by unwavering devotion, honesty, and innovation, our mission is to enrich everyday lives by providing pure, hygienic, and convenient food products. We commit to upholding the health of our consumers as our highest motto, empowering local farming communities, and honoring 50 years of trust in every packet we produce.";

export function AboutVisionMission() {
  return (
    <section
      className="relative py-10 sm:py-14 lg:py-16 bg-white"
      aria-labelledby="vision-mission-heading"
    >
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-6 sm:mb-8 lg:mb-10 max-w-2xl text-center">
          <h2
            id="vision-mission-heading"
            className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-gray-900"
          >
            Our Vision &amp; Mission
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
            Preserving culinary heritage while pioneering modern food technology to protect the
            health of every family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {/* Vision — dark green panel */}
          <article className="rounded-2xl bg-[#0a4626] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">Our Vision</h3>
            <p className="mt-4 max-w-prose text-base sm:text-[17px] leading-relaxed text-stone-100">
              {VISION}
            </p>
          </article>

          {/* Mission — light panel */}
          <article className="rounded-2xl border border-gray-200 bg-[#f7f6f2] p-6 sm:p-8 lg:p-10 text-gray-900 flex flex-col justify-center">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">Our Mission</h3>
            <p className="mt-4 max-w-prose text-base sm:text-[17px] leading-relaxed text-gray-700">
              {MISSION}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
