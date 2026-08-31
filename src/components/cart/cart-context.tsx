"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product } from "@/lib/shopify/types";

interface LocalCartItem {
  id: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  currencyCode: string;
  quantity: number;
  imageUrl?: string;
  handle: string;
}

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  items: LocalCartItem[];
  addItem: (product: Product, variantId?: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  totalQuantity: number;
  subtotal: number;
  checkoutUrl: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<LocalCartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ruchi_cart_items");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("ruchi_cart_items", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (product: Product, variantId?: string, quantity = 1) => {
    const selectedVariant =
      product.variants.edges.find((e) => e.node.id === variantId)?.node ||
      product.variants.edges[0]?.node;

    const vId = selectedVariant ? selectedVariant.id : product.id;
    const price = selectedVariant ? selectedVariant.price.amount : product.priceRange.minVariantPrice.amount;
    const currencyCode = selectedVariant ? selectedVariant.price.currencyCode : product.priceRange.minVariantPrice.currencyCode;
    const variantTitle = selectedVariant ? selectedVariant.title : "Default";

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === vId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: `${vId}-${Date.now()}`,
          variantId: vId,
          productTitle: product.title,
          variantTitle,
          price,
          currencyCode,
          quantity,
          imageUrl: product.featuredImage?.url,
          handle: product.handle,
        },
      ];
    });

    setIsOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  const checkoutUrl = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_URL || "https://ruchi-foodline.myshopify.com/checkout";

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        items,
        addItem,
        updateQuantity,
        removeItem,
        totalQuantity,
        subtotal,
        checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
