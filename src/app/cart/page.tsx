"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    totalQuantity,
    subtotal,
    checkoutUrl,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 499;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-text mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 rounded-[12px] border border-border bg-[#FAFBF9]">
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
            <div className="lg:col-span-7 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-[12px] border border-border bg-white"
                >
                  <div className="relative w-24 h-24 rounded-[8px] overflow-hidden bg-soft-green/30 border border-border/60 flex-shrink-0">
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
                          className="font-bold text-sm text-text hover:text-primary-green transition-colors"
                        >
                          {item.productTitle}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-text hover:text-accent-terracotta p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-text">{item.variantTitle}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-[8px] bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-muted-text hover:text-text"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-muted-text hover:text-text"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-text">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 bg-[#FAFBF9] p-6 rounded-[12px] border border-border space-y-4 h-fit">
              <h3 className="font-serif text-lg font-bold text-text">Order Summary</h3>

              <div className="space-y-2 text-xs text-muted-text border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-bold text-text">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{isFreeShipping ? "FREE" : "₹49.00"}</span>
                </div>
              </div>

              <div className="flex justify-between text-base font-bold text-text pt-1">
                <span>Total</span>
                <span className="text-primary-green">
                  ₹{(subtotal + (isFreeShipping ? 0 : 49)).toFixed(2)}
                </span>
              </div>

              <a
                href={checkoutUrl}
                className="w-full py-3.5 rounded-[12px] bg-primary-green hover:bg-deep-green text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </a>

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
