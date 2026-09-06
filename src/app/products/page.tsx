import type { Metadata } from "next";
import { getProducts, getCollections } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { ShopPageClient, type SortKey } from "@/components/shop/shop-page-client";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse the full collection of Ruchi Foodline pure spices, masalas, pasta, and food products.",
};

type Props = {
  searchParams: Promise<{
    query?: string;
    category?: string;
    sort?: string;
    min?: string;
    max?: string;
    avail?: string;
    pack?: string;
  }>;
};

const SORT_MAP: Record<string, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED_AT", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true },
  "name-asc": { sortKey: "TITLE", reverse: false },
  "name-desc": { sortKey: "TITLE", reverse: true },
};

function buildShopifyQuery(freeText: string | undefined, availability: string | undefined): string {
  // Hampers are excluded from the customer-facing Shop catalog at the data
  // layer via the real Shopify productType field (never CSS, never a title guess).
  const clauses = ["-product_type:Hamper"];
  if (freeText?.trim()) clauses.push(freeText.trim());
  if (availability === "in") clauses.push("available_for_sale:true");
  if (availability === "out") clauses.push("available_for_sale:false");
  return clauses.join(" AND ");
}

function variantPrices(product: Product): number[] {
  return product.variants.edges.map((e) => parseFloat(e.node.price.amount));
}

export default async function ProductsCatalogPage({ searchParams }: Props) {
  const { query, category, sort, min, max, avail, pack } = await searchParams;

  const { sortKey, reverse } = SORT_MAP[sort ?? "featured"] ?? SORT_MAP.featured;
  const shopifyQuery = buildShopifyQuery(query, avail);

  const [baseProducts, collections] = await Promise.all([
    getProducts({ query: shopifyQuery, sortKey, reverse, first: 250 }),
    getCollections(),
  ]);

  // Facet option lists reflect the query/availability-filtered set so counts stay
  // meaningful, but options don't disappear as the customer narrows further.
  const availableCategories = collections.filter((c) =>
    baseProducts.some((p) => p.collections.edges.some((e) => e.node.handle === c.handle))
  );

  const packSizes = Array.from(
    new Set(
      baseProducts.flatMap((p) =>
        p.variants.edges
          .map((e) => e.node.selectedOptions.find((o) => o.value.toLowerCase() !== "default title")?.value)
          .filter((v): v is string => Boolean(v))
      )
    )
  ).sort();

  const allPrices = baseProducts.flatMap(variantPrices);
  const priceBounds = {
    min: allPrices.length ? Math.floor(Math.min(...allPrices)) : 0,
    max: allPrices.length ? Math.ceil(Math.max(...allPrices)) : 1000,
  };

  const minPrice = min ? Number(min) : undefined;
  const maxPrice = max ? Number(max) : undefined;
  const selectedPacks = pack ? pack.split(",").filter(Boolean) : [];

  const filteredProducts = baseProducts.filter((p) => {
    if (category && category !== "all" && !p.collections.edges.some((e) => e.node.handle === category)) {
      return false;
    }
    if (selectedPacks.length > 0) {
      const productSizes = p.variants.edges.map((e) => e.node.selectedOptions[0]?.value);
      if (!productSizes.some((size) => size && selectedPacks.includes(size))) return false;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      const prices = variantPrices(p);
      const inRange = prices.some(
        (price) => (minPrice === undefined || price >= minPrice) && (maxPrice === undefined || price <= maxPrice)
      );
      if (!inRange) return false;
    }
    return true;
  });

  return (
    <ShopPageClient
      products={filteredProducts}
      categories={availableCategories}
      packSizes={packSizes}
      priceBounds={priceBounds}
      activeFilters={{
        query,
        category: category ?? "all",
        sort: (sort as SortKey) ?? "featured",
        min: minPrice,
        max: maxPrice,
        avail: avail === "in" || avail === "out" ? avail : undefined,
        packs: selectedPacks,
      }}
    />
  );
}
