"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    totalQuantity,
    subtotal,
    checkoutUrl,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 499;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-soft-green/30">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary-green" />
              <h2 className="font-serif text-xl font-semibold text-text">Your Cart</h2>
              <span className="bg-primary-green text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalQuantity}
              </span>
            </div>
            <button
              onClick={closeCart}
              aria-label="Close Cart"
              className="p-2 rounded-lg text-muted-text hover:text-text hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="px-6 py-3 bg-soft-green/50 border-b border-border text-xs text-text">
            {amountToFreeShipping > 0 ? (
              <p className="mb-1.5 font-medium">
                Add <span className="font-bold text-primary-green">₹{amountToFreeShipping.toFixed(0)}</span> more for <span className="font-semibold text-primary-green">FREE Shipping</span>!
              </p>
            ) : (
              <p className="mb-1.5 font-semibold text-primary-green flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> You unlocked FREE Shipping!
              </p>
            )}
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary-green h-full transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-soft-green flex items-center justify-center mb-4 text-primary-green">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-text">Your cart is empty</h3>
                <p className="text-sm text-muted-text mt-1 max-w-xs">
                  Discover authentic Indian spices & pure food products from Ruchi Foodline.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-[12px] bg-primary-green text-white font-medium text-sm hover:bg-deep-green transition-colors shadow-xs"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-[12px] border border-border bg-white hover:border-primary-green/30 transition-colors"
                >
                  <div className="relative w-20 h-20 rounded-[8px] bg-soft-green/30 overflow-hidden flex-shrink-0 border border-border/50">
                    <Image
                      src={item.imageUrl || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=300"}
                      alt={item.productTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.handle}`}
                          onClick={closeCart}
                          className="font-medium text-sm text-text hover:text-primary-green transition-colors line-clamp-1"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="text-muted-text hover:text-accent-terracotta p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-text mt-0.5">{item.variantTitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-[8px] overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-muted-text hover:text-text hover:bg-soft-green transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-text">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-muted-text hover:text-text hover:bg-soft-green transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-semibold text-sm text-text">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-white space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-text">
                  <span>Subtotal</span>
                  <span className="font-semibold text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-text">
                  <span>Estimated Shipping</span>
                  <span>{subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : "₹49.00"}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-text">
                  <span>Total</span>
                  <span className="text-primary-green">
                    ₹{(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 49)).toFixed(2)}
                  </span>
                </div>
              </div>

              <a
                href={checkoutUrl}
                className="w-full py-3.5 rounded-[12px] bg-primary-green text-white font-semibold text-center flex items-center justify-center gap-2 hover:bg-deep-green transition-colors shadow-sm"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </a>

              <p className="text-[11px] text-center text-muted-text">
                🔒 Safe & Secure Checkout powered by Shopify
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
