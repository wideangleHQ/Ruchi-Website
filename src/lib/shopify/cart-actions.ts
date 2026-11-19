"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  createCart,
  getCart,
  isShopifyApiError,
  removeFromCart,
  TAGS,
  updateCart,
} from "./index";
import type { Cart } from "./types";
import { shopifyFetch } from "./client";
import { planRecipeKit } from "@/utils/recipe-kit";
import { getCartIssues } from "@/utils/cart-health";

const CART_COOKIE = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value;
}

async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

/**
 * Read-only lookup for use during rendering (Server Components cannot set
 * cookies, so this never creates a cart — only `getOrCreateCart`, called from
 * inside a Server Action, does that).
 */
export async function getCartFromCookies(): Promise<Cart | null> {
  const cartId = await getCartId();
  if (!cartId) return null;
  try {
    return await getCart(cartId);
  } catch (error) {
    console.error(`[shopify] getCartFromCookies("${cartId}") failed:`, error);
    return null;
  }
}

/**
 * Returns the current cart, transparently creating a new one (and persisting
 * its id in an httpOnly cookie) if none exists yet or the stored id is stale
 * (e.g. the cart already converted to an order).
 */
export async function getOrCreateCart(): Promise<Cart> {
  const cartId = await getCartId();

  if (cartId) {
    try {
      const existingCart = await getCart(cartId);
      if (existingCart) return existingCart;
    } catch (error) {
      // A malformed id makes Shopify answer with an error (a merely expired cart returns null). Either way the
      // stored cart is unusable: start a fresh one instead of leaving "Add to cart" broken until the cookie expires.
      console.warn("[shopify] stored cart id unusable, creating a new cart:", error);
    }
  }

  const newCart = await createCart();
  await setCartId(newCart.id);
  return newCart;
}

export type CartActionState = { error?: string } | undefined;

export async function addItemAction(
  _prevState: CartActionState,
  payload: { merchandiseId: string; quantity?: number }
): Promise<CartActionState> {
  if (!payload.merchandiseId) {
    return { error: "Missing product variant." };
  }

  try {
    const cart = await getOrCreateCart();
    await addToCart(cart.id, [
      { merchandiseId: payload.merchandiseId, quantity: payload.quantity ?? 1 },
    ]);
    updateTag(TAGS.cart);
  } catch (error) {
    return {
      error: isShopifyApiError(error) ? error.message : "Could not add item to cart.",
    };
  }
}

export async function updateItemQuantityAction(
  _prevState: CartActionState,
  payload: { lineId: string; quantity: number }
): Promise<CartActionState> {
  try {
    const cartId = await getCartId();
    if (!cartId) return { error: "No active cart." };

    if (payload.quantity <= 0) {
      await removeFromCart(cartId, [payload.lineId]);
    } else {
      await updateCart(cartId, [{ id: payload.lineId, quantity: payload.quantity }]);
    }
    updateTag(TAGS.cart);
  } catch (error) {
    return {
      error: isShopifyApiError(error) ? error.message : "Could not update cart.",
    };
  }
}

export async function updateVariantQuantityAction(
  _prevState: CartActionState,
  payload: { merchandiseId: string; quantity: number }
): Promise<CartActionState> {
  if (!payload.merchandiseId) {
    return { error: "Missing product variant." };
  }

  try {
    const cart = await getOrCreateCart();
    const line = cart.lines.edges.find(
      (e) => e.node.merchandise.id === payload.merchandiseId
    )?.node;

    if (payload.quantity <= 0) {
      if (line) {
        await removeFromCart(cart.id, [line.id]);
      }
    } else if (line) {
      await updateCart(cart.id, [{ id: line.id, quantity: payload.quantity }]);
    } else {
      await addToCart(cart.id, [
        { merchandiseId: payload.merchandiseId, quantity: payload.quantity },
      ]);
    }
    updateTag(TAGS.cart);
    return undefined;
  } catch (error) {
    return {
      error: isShopifyApiError(error) ? error.message : "Could not update cart.",
    };
  }
}

export async function removeItemAction(
  _prevState: CartActionState,
  payload: { lineId: string }
): Promise<CartActionState> {
  try {
    const cartId = await getCartId();
    if (!cartId) return { error: "No active cart." };

    await removeFromCart(cartId, [payload.lineId]);
    updateTag(TAGS.cart);
  } catch (error) {
    return {
      error: isShopifyApiError(error) ? error.message : "Could not remove item.",
    };
  }
}

/**
 * Adds the selected variant to the cart and, on success, redirects straight
 * to Shopify checkout — the "Buy Now" fast path. Reuses the same cart/session
 * as Add to Cart rather than a parallel checkout flow.
 */
export async function buyNowAction(
  _prevState: CartActionState,
  payload: { merchandiseId: string; quantity?: number }
): Promise<CartActionState> {
  if (!payload.merchandiseId) {
    return { error: "Missing product variant." };
  }

  let checkoutUrl: string;
  try {
    const cart = await getOrCreateCart();
    const updatedCart = await addToCart(cart.id, [
      { merchandiseId: payload.merchandiseId, quantity: payload.quantity ?? 1 },
    ]);
    updateTag(TAGS.cart);
    checkoutUrl = updatedCart.checkoutUrl;
  } catch (error) {
    return {
      error: isShopifyApiError(error) ? error.message : "Could not start checkout.",
    };
  }

  redirect(checkoutUrl);
}

export async function redirectToCheckoutAction(): Promise<void> {
  const cartId = await getCartId();
  if (!cartId) redirect("/cart");

  const cart = await getCart(cartId);
  if (!cart) redirect("/cart");

  // Re-validate against live Shopify data: the browser's copy may be stale (item sold out, stock reduced, price changed).
  if (getCartIssues(cart).length > 0) redirect("/cart");

  redirect(cart.checkoutUrl);
}

export type RecipeKitResult = { added: number; unavailable: string[]; error?: string };

/**
 * "Add all spices to cart" for a recipe. The browser only sends variant ids: availability is re-read from Shopify
 * here (never trusted from the page), unavailable items are reported instead of failing the kit, and
 * Shopify merges a variant already in the cart into its existing line.
 */
export async function addRecipeKitAction(variantIds: string[]): Promise<RecipeKitResult> {
  if (!Array.isArray(variantIds) || variantIds.length === 0 || variantIds.length > 20) {
    return { added: 0, unavailable: [], error: "This recipe has no products to add." };
  }
  try {
    const data = await shopifyFetch<{
      nodes: Array<{ id: string; availableForSale: boolean; product: { title: string } } | null>;
    }>({
      query: /* GraphQL */ `
        query RecipeKitVariants($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on ProductVariant {
              id
              availableForSale
              product {
                title
              }
            }
          }
        }
      `,
      variables: { ids: variantIds.filter((id) => typeof id === "string").slice(0, 20) },
      cache: "no-store",
    });
    const plan = planRecipeKit(
      data.nodes.filter((n): n is NonNullable<typeof n> => Boolean(n?.id)).map((n) => ({ variantId: n.id, productTitle: n.product.title, availableForSale: n.availableForSale }))
    );
    if (plan.addable.length === 0) return { added: 0, unavailable: plan.unavailable };

    const cart = await getOrCreateCart();
    await addToCart(
      cart.id,
      plan.addable.map((merchandiseId) => ({ merchandiseId, quantity: 1 }))
    );
    updateTag(TAGS.cart);
    return { added: plan.addable.length, unavailable: plan.unavailable };
  } catch (error) {
    return { added: 0, unavailable: [], error: isShopifyApiError(error) ? error.message : "Could not add the recipe items to your cart." };
  }
}
