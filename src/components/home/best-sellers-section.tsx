import { getProducts } from "@/lib/shopify";
import { BestSellersSlider } from "./best-sellers-slider";

export async function BestSellersSection() {
  const products = await getProducts({ sortKey: "BEST_SELLING", first: 10 });

  if (products.length === 0) return null;

  return (
    <section className="py-5 sm:py-7 lg:py-9 bg-transparent" aria-label="Best sellers">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <BestSellersSlider products={products} />
      </div>
    </section>
  );
}

