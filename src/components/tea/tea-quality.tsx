import { BadgeCheck, Coffee, Leaf, type LucideIcon } from "lucide-react";
import { TEA_BEIGE } from "./tea-story";

// Client-supplied wording (Website Design Brief, Tea page, section 3). Titles and descriptions are verbatim.
// The Assam origin claim was confirmed as approved by the client contact before publishing.
const COPY = {
  heading: "The Quality Behind Every Cup",
  pillars: [
    {
      title: "100% Original Assam Tea",
      text: "Carefully sourced from Assam tea gardens, known for rich, strong and aromatic leaves.",
      Icon: Leaf,
    },
    {
      title: "Rich Aroma & Strong Taste",
      text: "Deep colour, refreshing aroma and bold chai flavour.",
      Icon: Coffee, // cup with steam
    },
    {
      title: "Freshness You Can Feel",
      text: "Hygienic packing designed to preserve freshness, flavour and consistency.",
      Icon: BadgeCheck, // quality seal
    },
  ] satisfies Array<{ title: string; text: string; Icon: LucideIcon }>,
};

/**
 * Three quality pillars — same card language as "The craft behind the cup":
 * 1 column on phones, 2 on tablets (third card centred), 3 on desktop. Reveals with the page's CSS fade-and-rise.
 */
export function TeaQuality() {
  return (
    <section
      data-tea-reveal
      aria-labelledby="tea-quality-heading"
      className="relative isolate z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      style={{ backgroundColor: TEA_BEIGE }}
    >
      <div className="mx-auto max-w-[1100px]">
        <h2
          id="tea-quality-heading"
          data-reveal="0"
          className="mx-auto max-w-2xl text-center font-serif text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#10331f]"
        >
          {COPY.heading}
        </h2>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {COPY.pillars.map(({ title, text, Icon }, i) => (
            <li key={title} data-reveal={i + 1} className={i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:mx-0 lg:w-auto" : ""}>
              <article className="group flex h-full flex-col rounded-[14px] border border-[#10331f]/12 bg-[#fffcf6] p-6 text-[#10331f] transition-[background-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_28px_-20px_rgba(16,51,31,0.45)] focus-within:-translate-y-0.5 sm:p-7 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6ec] text-[#0e6337] transition-colors duration-300 group-hover:bg-[#0e6337] group-hover:text-white">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-serif text-xl font-bold leading-snug sm:text-[1.4rem]">{title}</h3>
                <p className="mt-2 font-sans text-base leading-relaxed text-[#10331f]/85">{text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
