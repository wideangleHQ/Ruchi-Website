import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCollectionProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { SafeImage } from "@/components/ui/safe-image";
import { categoryHref, productsForCategory } from "@/utils/categories";
import { getKeySpecs } from "@/utils/catalogue";
import { formatMoney } from "@/utils/format";
import { TEA_BEIGE } from "./tea-story";

const TEA_COLLECTION = "tea";

// Editable copy.
const COPY = {
  eyebrow: "The RUCHI Collection",
  heading: "Find Your Perfect Cup",
  support: "Every tea has its own character. Find the one that belongs in your daily ritual.",
  cta: "Explore Tea",
};

export type Card = { product: Product; tint: string; image: string };

// The three featured teas, in display order. Each card gets its own tint (drawn from the pack colours)
// and a slightly different image scale/offset, so the row feels composed rather than stamped out.
const FEATURED = [
  { handle: "ruchi-utkarsh-tea", tint: "#f4d9d3", image: "scale-[1.02] translate-y-1" },
  { handle: "ruchi-utkal-dust-tea", tint: "#f7ecb8", image: "scale-[0.94] -translate-y-2" },
  { handle: "ruchi-elaichi-tea", tint: "#dcebc9", image: "scale-100 translate-y-2" },
] as const;
const FALLBACK_TINTS = ["#f4d9d3", "#f7ecb8", "#dcebc9"];

/** The featured handles first (when live), then any other tea products, capped at three. */
function pickProducts(products: Product[]): Card[] {
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const picked: Card[] = [];
  for (const f of FEATURED) {
    const product = byHandle.get(f.handle);
    if (product) picked.push({ product, tint: f.tint, image: f.image });
  }
  const used = new Set(picked.map((p) => p.product.handle));
  for (const product of products) {
    if (picked.length >= 3) break;
    if (used.has(product.handle)) continue;
    picked.push({ product, tint: FALLBACK_TINTS[picked.length % 3], image: "scale-100" });
  }
  return picked.slice(0, 3);
}

function priceLabel(product: Product): string {
  const { minVariantPrice, maxVariantPrice } = product.priceRange;
  const price = formatMoney(minVariantPrice);
  return minVariantPrice.amount === maxVariantPrice.amount ? price : `From ${price}`;
}

function Header() {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[#168a4a]">{COPY.eyebrow}</p>
      <h2 id="tea-range-heading" className="mt-4 font-serif text-[clamp(2rem,4.6vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-[#10331f]">
        {COPY.heading}
      </h2>
      <p className="mt-4 font-sans text-base leading-relaxed text-[#1A1A1A]/70">{COPY.support}</p>
    </div>
  );
}

// `relative isolate z-10` + an opaque background give the section its own stacking context, so anything decorative
// from the Ritual section above (e.g. drifting leaves) can never sit over these interactive cards.
const SECTION = "relative isolate z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28";

/** Presentational: takes already-picked products, so the layout can be exercised without live data. */
export function TeaCards({ cards }: { cards: Card[] }) {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
      {cards.map(({ product, tint, image }, i) => {
        const variants = product.variants.edges.map((e) => e.node);
        const specs = getKeySpecs(product, variants[0] ?? null);
        const packSizes = variants.map((v) => v.title).filter((t) => t && t.toLowerCase() !== "default title");
        const img = product.featuredImage;
        return (
          <li key={product.id} className={i === 2 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.75rem)] lg:col-span-1 lg:mx-0 lg:w-auto" : ""}>
            <article
              className="group relative isolate h-[30rem] overflow-hidden rounded-[22px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 focus-within:-translate-y-1.5 sm:h-[34rem] lg:h-[38rem] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{ backgroundColor: tint }}
            >
              {/* Image — multiply drops the white of the pack photo into the tint */}
              {img && (
                <SafeImage
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fallbackTitle={product.title}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                  className={`object-contain object-[50%_40%] mix-blend-multiply p-6 pb-44 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-5 group-hover:scale-[1.05] group-focus-within:-translate-y-5 group-focus-within:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 ${image}`}
                />
              )}

              {/* Scrim: only as strong as the revealed text needs it to be */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#10331f]/85 via-[#10331f]/45 to-transparent opacity-35 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <h3 className="font-serif text-2xl font-bold leading-tight text-[#10331f] transition-colors duration-500 group-hover:text-white group-focus-within:text-white sm:text-[1.7rem] [@media(hover:none)]:text-white">
                  {product.title}
                </h3>

                {/* Revealed content: fade + rise only; transform/opacity never change the layout */}
                <div className="mt-3 translate-y-3 opacity-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                  {specs.length > 0 && <p className="font-sans text-sm leading-relaxed text-white/90 sm:text-[15px]">{specs.slice(0, 2).join(" · ")}</p>}
                  {packSizes.length > 0 && <p className="mt-1.5 font-sans text-sm leading-relaxed text-white/90 sm:text-[15px]">Pack sizes: {packSizes.join(" · ")}</p>}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-sans text-base font-semibold text-white">{priceLabel(product)}</p>
                    <Link
                      href={`/products/${product.handle}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-[6px] bg-white px-4 font-sans text-sm font-semibold text-[#0e6337] transition-colors hover:bg-[#eef6ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      {COPY.cta}
                      <span className="sr-only"> — {product.title}</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                {/* Hover affordance — only where hover exists */}
                <p
                  aria-hidden="true"
                  className="mt-2 hidden font-sans text-xs font-medium tracking-wide text-[#10331f]/60 transition-opacity duration-300 group-hover:opacity-0 group-focus-within:opacity-0 [@media(hover:hover)]:block"
                >
                  Hover to explore
                </p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/** Three large, image-led cards. Details reveal on hover or keyboard focus; on touch they are always visible. */
export async function TeaRange() {
  // Hampers that include tea belong to the Hampers category, not here.
  const products = productsForCategory(await getCollectionProducts({ handle: TEA_COLLECTION }), TEA_COLLECTION);
  const cards = pickProducts(products);

  return (
    <section id="tea-range" aria-labelledby="tea-range-heading" className={`${SECTION} scroll-mt-28`} style={{ backgroundColor: TEA_BEIGE }}>
      <div className="mx-auto max-w-[1400px]">
        <Header />

        {cards.length > 0 ? (
          <>
            <TeaCards cards={cards} />

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
              <Link
                href={categoryHref(TEA_COLLECTION)}
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#0e6337] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#168a4a]"
              >
                View all tea in the shop <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact/bulk-order"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#0e6337] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#168a4a]"
              >
                Enquire for Bulk Supply <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        ) : (
          // Empty collection or a Shopify outage (getCollectionProducts returns [] on error).
          <div className="mx-auto max-w-md rounded-2xl border border-[#168a4a]/20 bg-white px-6 py-10 text-center">
            <p className="font-serif text-xl font-bold text-[#1A1A1A]">Our tea range is taking a short break.</p>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#1A1A1A]/70">
              We couldn&apos;t load the products right now. Please try again in a little while, or ask us directly.
            </p>
            <Link
              href="/contact/queries"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[#168a4a] px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-[#0e6337] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168a4a]"
            >
              Contact us
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function TeaRangeSkeleton() {
  return (
    <section aria-labelledby="tea-range-heading" aria-busy="true" className={SECTION} style={{ backgroundColor: TEA_BEIGE }}>
      <div className="mx-auto max-w-[1400px]">
        <Header />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {FALLBACK_TINTS.map((tint) => (
            <div key={tint} className="h-[30rem] animate-pulse rounded-[22px] sm:h-[34rem] lg:h-[38rem]" style={{ backgroundColor: tint }} />
          ))}
        </div>
      </div>
    </section>
  );
}
