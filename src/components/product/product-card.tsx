"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Check } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { useCart } from "../cart/cart-context";
import { SafeImage } from "../ui/safe-image";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  const variants = product.variants.edges.map((e) => e.node);
  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id || product.id
  );

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const price = selectedVariant ? selectedVariant.price.amount : product.priceRange.minVariantPrice.amount;
  const compareAtPrice = selectedVariant?.compareAtPrice?.amount;
  const currencyCode = selectedVariant ? (selectedVariant.price.currencyCode === "INR" ? "₹" : "$") : "₹";
  const categoryTag = product.tags[0] ? product.tags[0].replace("-", " ") : "Spices";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, selectedVariantId, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-[12px] border border-border bg-white p-3.5 transition-all duration-300 hover:border-primary-green/40 hover:shadow-md">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-5 right-5 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-muted-text hover:text-[#c62828] transition-colors shadow-2xs"
        aria-label="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#c62828] text-[#c62828]" : ""}`} />
      </button>

      <div>
        {/* Product Image Box */}
        <Link href={`/products/${product.handle}`} className="block">
          <div className="relative aspect-square w-full rounded-[8px] overflow-hidden bg-[#f7f6f2] border border-border/40 p-4 mb-3 flex items-center justify-center">
            {product.featuredImage ? (
              <SafeImage
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                fallbackTitle={product.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-106"
              />
            ) : (
              <div className="w-full h-full bg-soft-green flex items-center justify-center text-primary-green font-serif font-bold text-xl">
                Ruchi
              </div>
            )}
          </div>
        </Link>

        {/* Category Tag */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-text/80 mb-1 block">
          {categoryTag}
        </span>

        {/* Product Title */}
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-sm font-semibold text-text line-clamp-1 group-hover:text-primary-green transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] text-muted-text font-medium">(4.9)</span>
        </div>

        {/* Variant Pack Size Selectors */}
        {variants.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedVariantId(v.id);
                }}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-[6px] border transition-all ${
                  selectedVariantId === v.id
                    ? "border-primary-green bg-soft-green text-primary-green font-bold"
                    : "border-border/80 bg-white text-muted-text hover:text-text"
                }`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer: Price & Add to Cart */}
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-text">
            {currencyCode}{parseFloat(price).toFixed(2)}
          </span>
          {compareAtPrice && (
            <span className="text-[10px] text-muted-text line-through">
              {currencyCode}{parseFloat(compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className={`px-3 py-1.5 rounded-[8px] text-xs font-bold transition-all flex items-center gap-1.5 ${
            added
              ? "bg-emerald-700 text-white"
              : "bg-primary-green text-white hover:bg-deep-green shadow-2xs"
          }`}
          aria-label="Add to cart"
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}
