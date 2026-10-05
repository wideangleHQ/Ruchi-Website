import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Collection } from "@/lib/shopify/types";

import basicSpicesImg from "@/assets/Images/Categories/Basic Spices.png";
import blendedSpicesImg from "@/assets/Images/Categories/Blended Spices.png";
import pastaImg from "@/assets/Images/Categories/Pasta.png";
import vermicelliImg from "@/assets/Images/Categories/vermicelli.png";
import noodlesImg from "@/assets/Images/Categories/Noodles.png";
import teaImg from "@/assets/Images/Categories/tea.png";
import wholeSpicesImg from "@/assets/Images/Categories/Whole Spices (2).png";
import flourReadyMixImg from "@/assets/Images/Categories/Flour and Ready Mix.png";

interface CategoryCardsSectionProps {
  collections: Collection[];
}

const CATEGORY_IMAGE_MAP: Record<string, StaticImageData> = {
  "basic-spices": basicSpicesImg,
  "blended-spices": blendedSpicesImg,
  "whole-spices": wholeSpicesImg,
  pasta: pastaImg,
  vermicelli: vermicelliImg,
  noodles: noodlesImg,
  tea: teaImg,
  "flour-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix-spices": flourReadyMixImg,
  "flour-and-ready-mix": flourReadyMixImg,
  "flour-ready-mix": flourReadyMixImg,
  "ready-mix": flourReadyMixImg,
};

// Required category order per the site's approved category list
const ORDERED_CATEGORY_HANDLES = [
  "basic-spices",
  "blended-spices",
  "whole-spices",
  "pasta",
  "vermicelli",
  "noodles",
  "tea",
  "flour-ready-mix-spices",
];

function getCategoryImage(handle: string): StaticImageData | null {
  if (CATEGORY_IMAGE_MAP[handle]) return CATEGORY_IMAGE_MAP[handle];
  const normalized = handle.toLowerCase().replace(/[^a-z0-9]/g, "-");
  for (const [key, img] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) return img;
  }
  return null;
}

export function CategoryCardsSection({ collections }: CategoryCardsSectionProps) {
  const map = new Map(collections.map((c) => [c.handle, c]));
  const orderedCollections: Collection[] = [];
  for (const handle of ORDERED_CATEGORY_HANDLES) {
    const col = map.get(handle);
    if (col) {
      orderedCollections.push(col);
      map.delete(handle);
    }
  }
  for (const col of map.values()) {
    if (col.handle && col.title) orderedCollections.push(col);
  }

  if (orderedCollections.length === 0) return null;

  return (
    <section className="py-4 sm:py-6 lg:py-7 bg-transparent" aria-label="Shop by category">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-text tracking-tight text-center sm:text-left mb-4 sm:mb-5 lg:mb-6">
          Explore the Flavours Behind Every Ruchi Meal
        </h2>

        {/* Mobile: Circular Horizontal Slider */}
        <div className="flex sm:hidden items-start gap-3.5 xs:gap-4 overflow-x-auto scrollbar-none py-1 snap-x snap-mandatory">
          {orderedCollections.map((collection) => {
            const imageSrc = getCategoryImage(collection.handle);
            return (
              <Link
                key={collection.handle}
                href={`/products?category=${collection.handle}`}
                className="group flex flex-col items-center text-center shrink-0 snap-start focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-green rounded-full p-1"
                style={{ width: "clamp(68px, 20vw, 84px)" }}
              >
                <div className="relative aspect-square w-full rounded-full overflow-hidden bg-soft-neutral/80 border border-gray-200/90 shadow-2xs transition-all duration-300 group-hover:border-primary-green/60 group-hover:scale-105">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={collection.title}
                      fill
                      sizes="84px"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-soft-green text-primary-green font-serif font-bold text-base">
                      {collection.title.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="mt-2 text-[11px] font-semibold tracking-tight leading-tight text-gray-800 group-hover:text-primary-green transition-colors line-clamp-2 max-w-[80px]">
                  {collection.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Desktop & Tablet: Rectangular Cards Grid */}
        <div className="hidden sm:grid sm:grid-cols-8 gap-3.5 lg:gap-5">
          {orderedCollections.map((collection) => {
            const imageSrc = getCategoryImage(collection.handle);
            return (
              <Link
                key={collection.handle}
                href={`/products?category=${collection.handle}`}
                className="group flex flex-col items-center text-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-green rounded-[16px] p-0.5"
              >
                <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-soft-neutral/80 border border-gray-200/80 transition-all duration-300 group-hover:border-primary-green/50 group-hover:shadow-md">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={collection.title}
                      fill
                      sizes="(min-width: 1024px) 180px, 150px"
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-soft-green text-primary-green font-serif font-bold text-lg">
                      {collection.title.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="mt-2.5 text-xs md:text-sm font-semibold tracking-tight leading-tight text-gray-800 group-hover:text-primary-green transition-colors line-clamp-2">
                  {collection.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
