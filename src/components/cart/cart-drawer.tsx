"use client";

import { useDialog } from "@/lib/use-dialog";
import React from "react";
import Link from "next/link";
import { useCartDrawer } from "@/context/cart-context";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { CheckoutButton } from "@/components/cart/checkout-button";
import { CartHealthNotice } from "@/components/cart/cart-health-notice";
import { getCartIssues } from "@/utils/cart-health";
import { CartRecommendations } from "@/components/cart/cart-recommendations";
import { OffersTimeline } from "@/components/cart/offers-timeline";
import { evaluateOffers, freeDeliveryStatus, inr } from "@/utils/offers";
import { formatMoney } from "@/utils/format";
import type { Cart, Product } from "@/lib/shopify/types";

interface CartDrawerProps {
  cart: Cart | null;
  recommendations?: Product[];
}

export function CartDrawer({ cart, recommendations = [] }: CartDrawerProps) {
  const { isOpen, closeCart } = useCartDrawer();
  const lines = cart?.lines.edges.map((edge) => edge.node) ?? [];
  const totalQuantity = cart?.totalQuantity ?? 0;
  // Integer paise throughout (no float drift around the free-delivery threshold).
  const delivery = freeDeliveryStatus(cart);
  const isFreeDeliveryUnlocked = delivery.eligible;
  const remainingForFreeDelivery = delivery.remaining;
  const offer = evaluateOffers(cart);
  const issues = getCartIssues(cart);
  const deliveryProgress = delivery.progress;

  // Focus trap, Escape, scroll lock, and focus back to the cart button when the drawer closes.
  const { ref: drawerRef } = useDialog(isOpen, closeCart);

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      tabIndex={-1}
      className="fixed inset-0 z-[9999] overflow-hidden select-none focus:outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Your Shopping Bag"
    >
      {/* Dark Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
        onClick={closeCart}
      />

      {/* Slide-in Drawer Panel on the Right */}
      <div
        className="fixed inset-y-0 right-0 w-full max-w-[420px] sm:max-w-[460px] md:max-w-[480px] bg-[#fcfbf9] shadow-2xl flex flex-col justify-between z-10 animate-drawer-in select-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ============================================================
            1. Cart Header — Compact & Crystal Clear
            ============================================================ */}
        <div className="border-b border-gray-200/80 px-4 sm:px-5 py-3.5 bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Your Bag
              </h2>
              {totalQuantity > 0 && (
                <span className="text-xs font-semibold text-gray-500">
                  ({totalQuantity} {totalQuantity === 1 ? "item" : "items"})
                </span>
              )}
            </div>

            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer text-base leading-none font-semibold"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* ============================================================
              2. Free-Delivery Progress Module (Active when items exist)
              ============================================================ */}
          {lines.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <div>
                  {isFreeDeliveryUnlocked ? (
                    <span className="text-[#168a4a] font-bold">
                      You&apos;ve unlocked FREE delivery!
                    </span>
                  ) : (
                    <span className="text-gray-700">
                      Add <strong className="text-gray-900 font-bold">₹{remainingForFreeDelivery}</strong> more for <strong className="text-[#168a4a] font-bold">FREE delivery</strong>
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 tabular-nums">
                  {Math.round(deliveryProgress)}%
                </span>
              </div>
              
              {/* Slim Progress Bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-[#168a4a] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            3. Scrollable Center: Cart Items & Smart Recommendations
            ============================================================ */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 scrollbar-thin scrollbar-thumb-gray-200">
          {lines.length === 0 || !cart ? (
            /* Empty State */
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center py-10 px-4">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                Your bag is empty
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1.5 max-w-xs mb-6 leading-relaxed">
                Discover everyday essentials from Ruchi Foodline.
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="inline-flex items-center px-6 py-2.5 rounded-xl bg-[#168a4a] hover:bg-[#0e6337] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                <span>Explore Products</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Offers timeline */}
              <OffersTimeline cart={cart} compact />

              {/* Cart Line Items */}
              <div className="space-y-2.5">
                {lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>

              {/* Smart Product Recommendations */}
              {recommendations.length > 0 && (
                <CartRecommendations products={recommendations} cartLines={lines} />
              )}
            </div>
          )}
        </div>

        {/* ============================================================
            4. Fixed Bottom Checkout Summary & Primary CTA
            ============================================================ */}
        {lines.length > 0 && cart && (
          <div className="border-t border-gray-200/90 bg-white p-4 sm:p-5 space-y-3 shadow-xl shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {/* Bill Summary Breakdown */}
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                <span>Subtotal</span>
                <span className="text-base text-gray-900 font-bold">
                  {formatMoney(cart.cost.subtotalAmount)}
                </span>
              </div>
              
              {offer.active && offer.saving > 0 && (
                <div className="flex justify-between items-center text-[11px] font-semibold text-[#168a4a]">
                  <span>{offer.active.percent}% offer applied</span>
                  <span>−{inr(offer.saving)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                <span>Delivery</span>
                <span>
                  {isFreeDeliveryUnlocked ? (
                    <span className="text-[#168a4a] font-bold uppercase tracking-wider">FREE</span>
                  ) : (
                    <span>Calculated at checkout</span>
                  )}
                </span>
              </div>
            </div>

            {/* Primary Checkout CTA */}
            <div className="space-y-2">
              <CartHealthNotice issues={issues} />
              <CheckoutButton disabled={issues.length > 0} />
            </div>

            {/* Reassurance Microcopy */}
            <div className="flex items-center justify-between pt-0.5 text-[11px] text-gray-500 font-medium">
              <button
                type="button"
                onClick={closeCart}
                className="text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
              >
                ← Continue Shopping
              </button>
              
              <div className="text-emerald-800 font-semibold text-[11px]">
                <span>Secure checkout powered by Shopify</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
