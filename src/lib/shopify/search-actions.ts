"use server";

import { getProducts } from "./index";
import type { Product } from "./types";

/**
 * Live search-suggestion lookup for the header search bar. Thin wrapper around
 * the existing getProducts() query — no separate search integration.
 */
export async function searchProductsPreview(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];
  return getProducts({ query: trimmed, first: 5 });
}
