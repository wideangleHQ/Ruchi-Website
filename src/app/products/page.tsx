import { expandSearchTerms, toShopifyQuery } from "@/utils/search-synonyms";
import { rankByTitle } from "@/utils/search-rank";
import { formatPackSize, parsePackSize } from "@/utils/pricing";
import type { Metadata } from "next";
import { getProducts, getCollections, getCollectionProducts } from "@/lib/shopify";
import type { Product } from "@/lib/shopify/types";
import { HAMPERS_HANDLE, isHamper, orderCategories, productsForCategory } from "@/utils/categories";
import { ShopPageClient, type SortKey } from "@/components/shop/shop-page-client";

const BASE_TITLE = "Shop All Products";
const BASE_DESCRIPTION = "Browse Ruchi Foodline spices, blended masalas, tea, pasta and food products. Filter by category, price and pack size.";

/**
 * /products is the one canonical shop listing. Any query string (search, filters, sort, pack) makes a view that
 * duplicates it, so those views stay crawlable for link discovery but are kept out of the index (noindex, follow).
 * They must NOT be blocked in robots.txt: a blocked URL can't be fetched, so its noindex would never be seen.
 * A plain ?category=<handle> view canonicalises to the real collection page.
 */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const hasParams = Object.values(params).some((v) => v !== undefined && v !== "");
  if (!hasParams) return { title: BASE_TITLE, description: BASE_DESCRIPTION, alternates: { canonical: "/products" } };

  const onlyCategory = Object.entries(params).every(([k, v]) => k === "category" || !v);
  const handle = typeof params.category === "string" && /^[a-z0-9-]+$/i.test(params.category) ? params.category : null;
  return {
    title: params.query ? `Search results for "${params.query.slice(0, 60)}"` : BASE_TITLE,
    description: BASE_DESCRIPTION,
    robots: { index: false, follow: true },
    alternates: { canonical: onlyCategory && handle ? `/collections/${handle}` : "/products" },
  };
}

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
  // Hampers are fetched with everything else and split out in JS from the real Shopify
  // productType field (see productsForCategory): hidden from "All Products", shown under Hampers.
  const clauses: string[] = [];
  // Regional names and small typos (haldi → turmeric, dalama → dalma) via the shared synonym list.
  const terms = expandSearchTerms((freeText ?? "").slice(0, 80));
  if (terms.length) clauses.push(`(${toShopifyQuery(terms)})`);
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

  const [fetchedProducts, collections] = await Promise.all([
    getProducts({ query: shopifyQuery || undefined, sortKey, reverse, first: 250 }),
    getCollections(),
  ]);

  const activeCategory = category ?? "all";
  // For a text search on the default sort, products that actually name the term come first.
  const ordered = query && (!sort || sort === "featured") ? rankByTitle(fetchedProducts, expandSearchTerms(query)) : fetchedProducts;
  const baseProducts = productsForCategory(ordered, activeCategory);

  // Facet option lists reflect the query/availability-filtered set so counts stay
  // meaningful, but options don't disappear as the customer narrows further.
  // Hampers is listed whenever any hamper matches; every other category needs a non-hamper product.
  const availableCategories = orderCategories(
    collections.filter((c) =>
      c.handle === HAMPERS_HANDLE
        ? fetchedProducts.some(isHamper)
        : fetchedProducts.some((p) => !isHamper(p) && p.collections.edges.some((e) => e.node.handle === c.handle))
    )
  );

  // One entry per real pack size ("250GM" and "250 GM" are the same pack), ordered by weight.
  const packSizes = Array.from(
    new Set(
      baseProducts.flatMap((p) =>
        p.variants.edges
          .map((e) => e.node.selectedOptions.find((o) => o.value.toLowerCase() !== "default title")?.value)
          .filter((v): v is string => Boolean(v))
          .map(formatPackSize)
      )
    )
  ).sort((a, b) => (parsePackSize(a)?.amount ?? Infinity) - (parsePackSize(b)?.amount ?? Infinity) || a.localeCompare(b));

  const allPrices = baseProducts.flatMap(variantPrices);
  const priceBounds = {
    min: allPrices.length ? Math.floor(Math.min(...allPrices)) : 0,
    max: allPrices.length ? Math.ceil(Math.max(...allPrices)) : 1000,
  };

  // Shared/hand-edited URLs can carry junk: anything that isn't a finite, non-negative number is ignored.
  const toPrice = (v?: string) => {
    const n = v === undefined || v === "" ? NaN : Number(v);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };
  const minPrice = toPrice(min);
  const maxPrice = toPrice(max);
  const selectedPacks = pack ? pack.split(",").filter(Boolean) : [];

  const filteredProducts = baseProducts.filter((p) => {
    if (category && category !== "all" && !p.collections.edges.some((e) => e.node.handle === category)) {
      return false;
    }
    if (selectedPacks.length > 0) {
      const productSizes = p.variants.edges.map((e) => {
        const raw = e.node.selectedOptions[0]?.value;
        return raw ? formatPackSize(raw) : undefined;
      });
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

  // Nothing matched: offer real best sellers (Shopify's own BEST_SELLING sort, products with a pack photo only).
  const suggestions =
    filteredProducts.length === 0
      ? (await getCollectionProducts({ handle: "basic-spices", sortKey: "BEST_SELLING", first: 8 })).filter((p) => p.featuredImage).slice(0, 4)
      : [];

  return (
    <ShopPageClient
      suggestions={suggestions}
      allCategories={orderCategories(collections)}
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
