import React from "react";

// Every figure below is taken from content already published elsewhere on the site
// (hero, heritage, global reach, certifications). Nothing is derived or estimated.
const PROOF_POINTS = [
  { figure: "1976", label: "Founded in Cuttack, Odisha" },
  { figure: "50+", label: "Years of RUCHI" },
  { figure: "200+", label: "Authorised dealers in Odisha" },
  { figure: "40+", label: "Super stockists nationwide" },
  { figure: "10+", label: "Global export markets" },
];

const CREDENTIALS = [
  {
    title: "Certified food safety",
    description:
      "ISO 22000:2018 and ISO 9002 certified processes, with a CRISIL SME 2 financial rating.",
  },
  {
    title: "100% pure, zero maida",
    description:
      "Farm-sourced pure spices and durum wheat suji pasta made with zero maida.",
  },
];

export function AboutGlance() {
  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-center py-12 sm:py-16 lg:py-20 bg-[#f7f6f2] border-b border-gray-200/80"
      aria-labelledby="glance-heading"
    >
      <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-6 lg:px-8">
        {/* Heading + supporting copy */}
        <div className="max-w-2xl">
          <h2
            id="glance-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-gray-900"
          >
            Ruchi at a Glance
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600">
            Five decades of certified quality, pure ingredients and a distribution network that
            reaches kitchens across India and abroad.
          </p>
        </div>

        {/* Proof points: one figure, one clear label */}
        <dl className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6 sm:gap-x-6 border-t border-gray-300/70 pt-6 sm:pt-8">
          {PROOF_POINTS.map((p) => (
            <div key={p.label} className="flex min-w-0 flex-col">
              <dt className="order-2 mt-1.5 text-xs sm:text-sm font-medium leading-snug text-gray-600">
                {p.label}
              </dt>
              <dd className="order-1 font-serif text-3xl sm:text-4xl font-bold leading-none text-[#0e6337]">
                {p.figure}
              </dd>
            </div>
          ))}
        </dl>

        {/* Credentials */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CREDENTIALS.map((c) => (
            <article
              key={c.title}
              className="flex items-start rounded-xl border border-gray-200/90 bg-white p-5 sm:p-6"
            >
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug text-gray-900">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{c.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
