"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import type { Product } from "@/lib/shopify/types";
import { AddToCartButton } from "./add-to-cart-button";
import { SafeImage } from "../ui/safe-image";

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const variants = product.variants.edges.map((e) => e.node);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in motion-reduce:animate-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.title}`}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[15px] bg-white shadow-2xl grid grid-cols-1 sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-colors shadow-2xs cursor-pointer"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        <div className="relative aspect-square sm:aspect-auto bg-[#f7f6f2] p-6 flex items-center justify-center">
          {product.featuredImage ? (
            <SafeImage
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fallbackTitle={product.title}
              fill
              sizes="(min-width: 640px) 320px, 90vw"
              className="object-contain p-2"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-green font-serif font-bold text-xl">
              Ruchi
            </div>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-text leading-snug">
              {product.title}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-text leading-relaxed line-clamp-3">
              {product.description || "Crafted from handpicked ingredients for authentic taste."}
            </p>
          </div>

          <AddToCartButton variants={variants} />

          <Link
            href={`/products/${product.handle}`}
            className="block text-center text-xs font-bold uppercase tracking-wider text-primary-green hover:text-deep-green transition-colors pt-1"
          >
            View Full Product →
          </Link>
        </div>
      </div>
    </div>
  );
}
