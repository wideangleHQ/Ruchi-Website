import { getProducts } from "@/lib/shopify";
import type { Collection } from "@/lib/shopify/types";
import { ShopProductsClient } from "@/components/home/shop-products-client";

interface ShopProductsSectionProps {
  collections: Collection[];
}

export async function ShopProductsSection({ collections }: ShopProductsSectionProps) {
  const products = await getProducts({ first: 100 });

  if (products.length === 0) {
    return null;
  }

  return <ShopProductsClient products={products} collections={collections} />;
}
