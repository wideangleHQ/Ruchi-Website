import { getCollectionProducts } from "@/lib/shopify";
import { BestSellersSlider } from "./best-sellers-slider";

export async function BestSellersSection() {
  const products = await getCollectionProducts({ handle: "basic-spices", sortKey: "BEST_SELLING", first: 10 });

  if (products.length === 0) return null;

  return (
    <section className="h-[100svh] min-h-[560px] overflow-hidden flex flex-col justify-center py-3 sm:py-4 lg:py-5 bg-transparent" aria-label="Best sellers">
      <div className="w-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <BestSellersSlider products={products} />
      </div>
    </section>
  );
}
