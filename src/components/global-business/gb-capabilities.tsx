import Image, { type StaticImageData } from "next/image";
import { Boxes, Download, Globe2, Package, Wheat, type LucideIcon } from "lucide-react";
import spicesImg from "@/assets/Images/Categories/Blended Spices.png";
import bulkImg from "@/assets/Images/about section/2.png";
import packImg from "@/assets/Images/CRAFTED WITH CARE/3.png";
import distributionImg from "@/assets/Images/about section/1.png";
import { CAPABILITIES, CATALOGUE_PDF, GB_COLORS } from "./content";

type Capability = {
  title: string;
  text: string;
  Icon: LucideIcon;
  img: StaticImageData;
  alt: string;
  accent: string;
  extra?: { label: string; href: string };
};

/** Section 03 — four capability cards; each carries its own image and accent so the row doesn't read as an icon grid. */
export function GlobalBusinessCapabilities({ categories }: { categories: string[] }) {
  const list = categories.length > 0 ? categories : [];
  const CARDS: Capability[] = [
    {
      title: "Product range",
      text:
        list.length > 0
          ? `Our current catalogue spans ${list.length} categories: ${list.join(", ")}.`
          : "Spices, pasta, vermicelli, noodles, tea and ready mixes from our current catalogue.",
      Icon: Wheat,
      img: spicesImg,
      alt: "Blended spices in a wooden bowl with whole chillies",
      accent: GB_COLORS.green,
      extra: { label: "Download the product catalogue (PDF)", href: CATALOGUE_PDF },
    },
    {
      title: "Retail & bulk supply",
      text: "Retail packs for shelves and larger packs for bulk buyers. Share the products and volumes you need, and our team will confirm what we can supply.",
      Icon: Boxes,
      img: bulkImg,
      alt: "A RUCHI team member checking spice packs before dispatch",
      accent: GB_COLORS.green,
    },
    {
      title: "Packaging options",
      text: "Products come in the pouch, box, jar and sachet formats listed in our catalogue. Requirements beyond these are discussed case by case.",
      Icon: Package,
      img: packImg,
      alt: "Packs of RUCHI products being weighed and checked",
      accent: GB_COLORS.green,
    },
    {
      title: "Distribution partnerships",
      text: "We welcome conversations with importers, distributors and retail chains about bringing RUCHI to new markets.",
      Icon: Globe2,
      img: distributionImg,
      alt: "RUCHI products on a production and packing line",
      accent: GB_COLORS.green,
    },
  ];

  return (
    <section data-tea-reveal aria-labelledby="gb-cap-heading" className="flex items-center bg-white px-4 py-14 sm:px-6 sm:py-16 lg:min-h-[85vh] lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mx-auto max-w-4xl text-center">
          <h2
            id="gb-cap-heading"
            data-reveal="0"
            className="font-serif text-[clamp(1.75rem,3vw,2.6rem)] font-bold uppercase leading-[1.05] tracking-tight"
            style={{ color: GB_COLORS.maroon }}
          >
            {CAPABILITIES.heading}
          </h2>
          <p data-reveal="1" className="mt-3 font-sans text-base leading-relaxed sm:text-lg" style={{ color: `${GB_COLORS.charcoal}cc` }}>
            {CAPABILITIES.support}
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 lg:mt-8 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
          {CARDS.map(({ title, text, Icon, img, alt, accent, extra }, i) => (
            <li key={title} data-reveal={i + 2}>
              <article
                className="flex h-full flex-col overflow-hidden rounded-[18px] border"
                style={{ backgroundColor: GB_COLORS.ivory, borderColor: `${GB_COLORS.maroon}1f` }}
              >
                <div className="relative aspect-[2/1] overflow-hidden">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 46vw, 92vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundColor: accent }} aria-hidden="true" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-sm font-semibold tabular-nums" style={{ color: GB_COLORS.green }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="h-5 w-5" strokeWidth={1.6} style={{ color: accent }} aria-hidden="true" />
                  </div>
                  <h3 className="mt-3 font-sans text-lg font-semibold leading-snug" style={{ color: GB_COLORS.charcoal }}>
                    {title}
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed" style={{ color: `${GB_COLORS.charcoal}b3` }}>
                    {text}
                  </p>
                  {extra && (
                    <a
                      href={extra.href}
                      download
                      className="mt-auto inline-flex items-center gap-2 pt-5 font-sans text-sm font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
                      style={{ color: GB_COLORS.green }}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {extra.label}
                    </a>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
