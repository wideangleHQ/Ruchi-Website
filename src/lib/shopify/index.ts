import "server-only";
import { shopifyFetch } from "./client";
import {
  addToCartMutation,
  createCartMutation,
  getCartQuery,
  removeFromCartMutation,
  updateCartMutation,
} from "./mutations";
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery,
  getProductQuery,
  getProductsQuery,
} from "./queries";
import type {
  Cart,
  Collection,
  Connection,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCartOperation,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";
import { excludeHampers } from "./product-filters";

export const TAGS = {
  products: "products",
  collections: "collections",
  cart: "cart",
} as const;

function removeEdgesAndNodes<T>(connection: Connection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}

// ---- Products ----
//
// Shopify is the single source of truth. These functions never substitute
// unrelated placeholder/mock data on error or on a genuine zero-result
// response — a real "no products" answer from Shopify must render as empty,
// not silently swap in a different catalog. Failures are logged server-side
// and degrade to empty/null so pages can render their own empty state.

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<ShopifyProductOperation["data"]>({
      query: getProductQuery,
      variables: { handle },
      tags: [TAGS.products],
    });
    return data.product ?? null;
  } catch (error) {
    console.error(`[shopify] getProduct("${handle}") failed:`, error);
    return null;
  }
}

export async function getProducts({
  query,
  sortKey,
  reverse,
  first = 24,
}: {
  query?: string;
  sortKey?: string;
  reverse?: boolean;
  first?: number;
} = {}): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ShopifyProductsOperation["data"]>({
      query: getProductsQuery,
      variables: { first, sortKey, reverse, query },
      tags: [TAGS.products],
    });
    return excludeHampers(removeEdgesAndNodes(data.products));
  } catch (error) {
    console.error("[shopify] getProducts() failed:", error);
    return [];
  }
}

// ---- Collections ----

export async function getCollection(handle: string): Promise<Collection | null> {
  try {
    const data = await shopifyFetch<ShopifyCollectionOperation["data"]>({
      query: getCollectionQuery,
      variables: { handle },
      tags: [TAGS.collections],
    });
    return data.collection ?? null;
  } catch (error) {
    console.error(`[shopify] getCollection("${handle}") failed:`, error);
    return null;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const data = await shopifyFetch<ShopifyCollectionsOperation["data"]>({
      query: getCollectionsQuery,
      variables: { first: 100 },
      tags: [TAGS.collections],
    });
    return removeEdgesAndNodes(data.collections);
  } catch (error) {
    console.error("[shopify] getCollections() failed:", error);
    return [];
  }
}

export async function getCollectionProducts({
  handle,
  sortKey,
  reverse,
  first = 24,
}: {
  handle: string;
  sortKey?: string;
  reverse?: boolean;
  first?: number;
}): Promise<Product[]> {
  try {
    const data = await shopifyFetch<ShopifyCollectionProductsOperation["data"]>({
      query: getCollectionProductsQuery,
      variables: { handle, first, sortKey, reverse },
      tags: [TAGS.products, TAGS.collections],
    });
    return data.collection ? excludeHampers(removeEdgesAndNodes(data.collection.products)) : [];
  } catch (error) {
    console.error(`[shopify] getCollectionProducts("${handle}") failed:`, error);
    return [];
  }
}

// ---- Cart ----

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await shopifyFetch<ShopifyCartOperation["data"]>({
    query: getCartQuery,
    variables: { cartId },
    cache: "no-store",
  });

  return data.cart ?? null;
}

export async function createCart(): Promise<Cart> {
  const data = await shopifyFetch<ShopifyCreateCartOperation["data"]>({
    query: createCartMutation,
    cache: "no-store",
  });

  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<Cart> {
  const data = await shopifyFetch<ShopifyAddToCartOperation["data"]>({
    query: addToCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return data.cartLinesAdd.cart;
}

export async function updateCart(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<Cart> {
  const data = await shopifyFetch<ShopifyUpdateCartOperation["data"]>({
    query: updateCartMutation,
    variables: { cartId, lines },
    cache: "no-store",
  });

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<ShopifyRemoveFromCartOperation["data"]>({
    query: removeFromCartMutation,
    variables: { cartId, lineIds },
    cache: "no-store",
  });

  return data.cartLinesRemove.cart;
}

export { ShopifyApiError, isShopifyApiError } from "./client";
export type * from "./types";
