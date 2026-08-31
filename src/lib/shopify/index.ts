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

export const TAGS = {
  products: "products",
  collections: "collections",
  cart: "cart",
} as const;

function removeEdgesAndNodes<T>(connection: Connection<T>): T[] {
  return connection.edges.map((edge) => edge.node);
}

import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from "./mock-data";

// ---- Products ----

export async function getProduct(handle: string): Promise<Product | null> {
  try {
    const data = await shopifyFetch<ShopifyProductOperation["data"]>({
      query: getProductQuery,
      variables: { handle },
      tags: [TAGS.products],
    });
    return data.product ?? MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.handle === handle) ?? null;
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
    const products = removeEdgesAndNodes(data.products);
    return products.length > 0 ? products : MOCK_PRODUCTS;
  } catch {
    if (query) {
      const q = query.toLowerCase();
      return MOCK_PRODUCTS.filter(
        (p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))
      );
    }
    return MOCK_PRODUCTS;
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
    return data.collection ?? MOCK_COLLECTIONS.find((c) => c.handle === handle) ?? null;
  } catch {
    return MOCK_COLLECTIONS.find((c) => c.handle === handle) ?? null;
  }
}

export async function getCollections(): Promise<Collection[]> {
  try {
    const data = await shopifyFetch<ShopifyCollectionsOperation["data"]>({
      query: getCollectionsQuery,
      variables: { first: 100 },
      tags: [TAGS.collections],
    });
    const collections = removeEdgesAndNodes(data.collections);
    return collections.length > 0 ? collections : MOCK_COLLECTIONS;
  } catch {
    return MOCK_COLLECTIONS;
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

    if (data.collection) {
      const prods = removeEdgesAndNodes(data.collection.products);
      if (prods.length > 0) return prods;
    }
    return MOCK_PRODUCTS.filter((p) => p.tags.includes(handle));
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.tags.includes(handle));
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
