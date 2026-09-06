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
  return getCart(cartId);
}

/**
 * Returns the current cart, transparently creating a new one (and persisting
 * its id in an httpOnly cookie) if none exists yet or the stored id is stale
 * (e.g. the cart already converted to an order).
 */
export async function getOrCreateCart(): Promise<Cart> {
  const cartId = await getCartId();

  if (cartId) {
    const existingCart = await getCart(cartId);
    if (existingCart) return existingCart;
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

  redirect(cart.checkoutUrl);
}
