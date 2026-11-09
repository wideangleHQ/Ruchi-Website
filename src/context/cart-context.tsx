"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useTransition,
} from "react";
import { usePathname } from "next/navigation";
import type { Cart } from "@/lib/shopify/types";
import { updateVariantQuantityAction } from "@/lib/shopify/cart-actions";

interface CartContextType {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cart: Cart | null;
  getVariantQuantity: (variantId: string) => number;
  updateVariantQuantity: (
    variantId: string,
    quantity: number
  ) => Promise<{ error?: string } | undefined>;
  isUpdatingVariant: (variantId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
  initialCart = null,
}: {
  children: React.ReactNode;
  initialCart?: Cart | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({});
  const [pendingVariants, setPendingVariants] = useState<Record<string, boolean>>({});
  const [, startTransition] = useTransition();
  const pathname = usePathname();

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  // Synchronize cart whenever initialCart changes from server revalidation
  useEffect(() => {
    setCart(initialCart);
    // Clear optimistic overrides once canonical server state arrives
    setOptimisticQuantities({});
  }, [initialCart]);

  // Close cart drawer when navigating to a new route
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
  }

  // Lock body scroll when cart drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Cross-component sync event listener
  useEffect(() => {
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ variantId: string; quantity: number }>;
      if (customEvent.detail?.variantId) {
        setOptimisticQuantities((prev) => ({
          ...prev,
          [customEvent.detail.variantId]: customEvent.detail.quantity,
        }));
      }
    };
    window.addEventListener("ruchi:cart-sync", handleSync);
    return () => window.removeEventListener("ruchi:cart-sync", handleSync);
  }, []);

  const getVariantQuantity = useCallback(
    (variantId: string): number => {
      if (!variantId) return 0;
      if (optimisticQuantities[variantId] !== undefined) {
        return optimisticQuantities[variantId];
      }
      if (!cart?.lines?.edges) return 0;
      const match = cart.lines.edges.find((e) => e.node.merchandise.id === variantId);
      return match ? match.node.quantity : 0;
    },
    [cart, optimisticQuantities]
  );

  const isUpdatingVariant = useCallback(
    (variantId: string): boolean => {
      return Boolean(pendingVariants[variantId]);
    },
    [pendingVariants]
  );

  const updateVariantQuantity = useCallback(
    async (
      variantId: string,
      targetQuantity: number
    ): Promise<{ error?: string } | undefined> => {
      if (!variantId) return { error: "Missing variant." };

      const safeQuantity = Math.max(0, targetQuantity);

      // 1. Instant optimistic update so UI transitions immediately (Blinkit feel)
      setOptimisticQuantities((prev) => ({
        ...prev,
        [variantId]: safeQuantity,
      }));
      setPendingVariants((prev) => ({ ...prev, [variantId]: true }));

      // 2. Broadcast to any other cards of this same product variant on the page
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("ruchi:cart-sync", {
            detail: { variantId, quantity: safeQuantity },
          })
        );
      }

      // 3. Execute server action
      try {
        let result: { error?: string } | undefined;
        startTransition(async () => {
          result = await updateVariantQuantityAction(undefined, {
            merchandiseId: variantId,
            quantity: safeQuantity,
          });
          if (result?.error) {
            // Revert optimistic override if failed
            setOptimisticQuantities((prev) => {
              const copy = { ...prev };
              delete copy[variantId];
              return copy;
            });
          }
          setPendingVariants((prev) => ({ ...prev, [variantId]: false }));
        });
        return result;
      } catch {
        setOptimisticQuantities((prev) => {
          const copy = { ...prev };
          delete copy[variantId];
          return copy;
        });
        setPendingVariants((prev) => ({ ...prev, [variantId]: false }));
        return { error: "Failed to update cart." };
      }
    },
    []
  );

  return (
    <CartContext.Provider
      value={{
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        cart,
        getVariantQuantity,
        updateVariantQuantity,
        isUpdatingVariant,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartDrawer() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartDrawer must be used within a CartProvider");
  }
  return context;
}

export function useCart() {
  return useContext(CartContext);
}
