"use client";

import React from "react";
import { X, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useCartDrawer } from "@/context/cart-context";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { formatMoney } from "@/utils/format";
import type { Cart } from "@/lib/shopify/types";

interface CartDrawerProps {
  cart: Cart | null;
}

export function CartDrawer({ cart }: CartDrawerProps) {
  const { isOpen, closeCart } = useCartDrawer();
  const lines = cart?.lines.edges.map((edge) => edge.node) ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  const subtotal = cart?.cost.subtotalAmount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const freeShippingThreshold = 499;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer">
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-in Drawer Panel on the Right */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md sm:max-w-lg bg-white shadow-2xl flex flex-col justify-between z-10 animate-drawer-in pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]">
        
        {/* 1. Drawer Header */}
        <div className="border-b border-gray-200 px-5 py-4 bg-[#fcfbf9]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#168a4a] border border-emerald-200/60 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="font-serif text-lg font-bold text-gray-900">
                Your Shopping Bag
              </h2>
              {totalQuantity > 0 && (
                <span className="bg-[#168a4a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                </span>
              )}
            </div>

            <button
              onClick={closeCart}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Goal Bar */}
          <div className="mt-3 pt-2.5 border-t border-gray-200/60">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-gray-700">
                <Truck className="w-3.5 h-3.5 text-[#168a4a]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-[#168a4a] font-bold">You unlocked FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-gray-900">₹{remainingForFreeShipping.toFixed(0)}</strong> more for <strong className="text-[#168a4a]">FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-[10px] text-gray-500 font-bold">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-emerald-500 to-[#168a4a] rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. Drawer Body (Items list or Empty State) */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-gray-100">
          {lines.length === 0 || !cart ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-[#168a4a] mb-4 shadow-2xs">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-gray-900">
                Your cart is empty
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1.5 max-w-xs mb-6 leading-relaxed">
                Discover pure heritage spices, blended masalas, pasta, and tea from Ruchi Foodline.
              </p>
              <button
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#168a4a] hover:bg-[#0e6337] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          )}
        </div>

        {/* 3. Drawer Footer */}
        {lines.length > 0 && cart && (
          <div className="border-t border-gray-200 bg-[#fcfbf9] p-5 space-y-3 shadow-lg">
            {/* Subtotal & Details */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Subtotal</span>
                <span className="text-base text-[#168a4a]">{formatMoney(cart.cost.subtotalAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-gray-500">
                <span>Shipping & Taxes</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="pt-1">
              <CheckoutButton />
            </div>

            {/* Continue Shopping / Secondary Action */}
            <div className="flex items-center justify-between pt-1 text-[11px] font-medium text-gray-500">
              <button
                onClick={closeCart}
                className="text-[#168a4a] hover:text-[#0e6337] font-semibold underline cursor-pointer"
              >
                ← Continue Shopping
              </button>
              <div className="flex items-center gap-1 text-emerald-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#168a4a]" /> Secure Shopify Checkout
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
