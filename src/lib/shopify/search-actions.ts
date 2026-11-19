"use server";

import { getProducts } from "./index";
import type { Product } from "./types";
import { expandSearchTerms, toShopifyQuery } from "@/utils/search-synonyms";
import { rankByTitle } from "@/utils/search-rank";

/**
 * Live search suggestions for the header. Shopify stays the only product source:
 * the query is expanded with regional names (haldi → turmeric), then results whose title
 * actually names a term are listed first.
 */
export async function searchProductsPreview(query: string): Promise<Product[]> {
  const terms = expandSearchTerms(query.slice(0, 80));
  if (terms.length === 0 || terms[0].length < 2) return [];
  const products = await getProducts({ query: toShopifyQuery(terms), first: 12 });
  return rankByTitle(products, terms).slice(0, 6);
}
