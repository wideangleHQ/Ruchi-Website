import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { getCartFromCookies } from "@/lib/shopify/cart-actions";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { formatMoney } from "@/utils/format";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  const cart = await getCartFromCookies();
  const lines = cart?.lines.edges.map((edge) => edge.node) ?? [];

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-text mb-8">Shopping Cart</h1>

        {lines.length === 0 || !cart ? (
          <div className="text-center py-16 rounded-[12px] border border-border bg-[#f7f6f2]">
            <ShoppingBag className="w-12 h-12 text-primary-green mx-auto mb-4" />
            <h2 className="font-serif text-xl font-bold text-text">Your cart is empty</h2>
            <p className="text-xs text-muted-text mt-1 max-w-sm mx-auto mb-6">
              Discover authentic Indian spices, royal masalas, and pasta from Ruchi Foodline.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-primary-green text-white font-semibold text-xs hover:bg-deep-green transition-colors"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Items List */}
            <div className="lg:col-span-7">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-[#f7f6f2] p-6 rounded-[12px] border border-border space-y-4 h-fit">
              <h3 className="font-serif text-lg font-bold text-text">Order Summary</h3>

              <div className="space-y-2 text-xs text-muted-text border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.totalQuantity} items)</span>
                  <span className="font-bold text-text">{formatMoney(cart.cost.subtotalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-text pt-1">
                <span>Total</span>
                <span className="text-primary-green">{formatMoney(cart.cost.totalAmount)}</span>
              </div>

              <CheckoutButton />

              <div className="text-[11px] text-muted-text space-y-1 pt-2">
                <div className="flex items-center gap-1 text-primary-green font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout via Shopify
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
