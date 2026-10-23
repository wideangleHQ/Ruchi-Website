import { getCollectionProducts } from "@/lib/shopify";
import { BestSellersSlider } from "./best-sellers-slider";

export async function BestSellersSection() {
  const products = await getCollectionProducts({ handle: "basic-spices", sortKey: "BEST_SELLING", first: 10 });

  if (products.length === 0) return null;

  return (
    <section className="pt-1.5 sm:pt-3 lg:pt-0 pb-4 sm:pb-6 lg:pb-0 lg:h-[100svh] lg:min-h-[560px] lg:flex lg:flex-col lg:justify-center overflow-hidden bg-transparent" aria-label="Best sellers">
      <div className="w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <BestSellersSlider products={products} />
      </div>
    </section>
  );
}
