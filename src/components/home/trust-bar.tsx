const TRUST_ITEMS = [
  {
    value: "50 years",
    label: "of flavour and trust",
  },
  {
    value: "Authentic",
    label: "Indian cooking at heart",
  },
  {
    value: "Honest",
    label: "ingredients in every kitchen",
  },
];

export function TrustBar() {
  return (
    <section
      className="border-y border-[#e3e3de] bg-white/80"
      aria-label="Ruchi Foodline trust highlights"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-[#e3e3de] px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item.value}
            className="flex items-center gap-3 px-1 py-4 sm:justify-center sm:px-4 lg:py-5"
          >
            <strong className="font-serif text-lg font-bold leading-none text-[#0e6337] sm:text-xl">
              {item.value}
            </strong>
            <span className="text-xs font-medium leading-snug text-gray-600 sm:max-w-[130px]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
