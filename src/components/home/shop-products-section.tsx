import { getProducts } from "@/lib/shopify";
import type { Collection } from "@/lib/shopify/types";
import { ShopProductsClient } from "@/components/home/shop-products-client";

interface ShopProductsSectionProps {
  collections: Collection[];
}

export async function ShopProductsSection({ collections }: ShopProductsSectionProps) {
  // 250 is the Storefront API's max page size and comfortably covers the
  // full catalog (111 products today) in a single request — the category
  // tabs filter client-side from this set, so every product must be present
  // here or it silently disappears from its category.
  const products = await getProducts({ first: 250 });

  if (products.length === 0) {
    return null;
  }

  return <ShopProductsClient products={products} collections={collections} />;
}
