"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { redirectToCheckoutAction } from "@/lib/shopify/cart-actions";

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full h-12 sm:h-12.5 rounded-xl bg-[#168a4a] hover:bg-[#0e6337] active:scale-[0.99] text-white font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      aria-label="Proceed to Checkout"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Redirecting to Checkout…</span>
        </>
      ) : (
        <>
          <Lock className="w-3.5 h-3.5 opacity-80" />
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

export function CheckoutButton({ disabled }: { disabled?: boolean }) {
  return (
    <form action={redirectToCheckoutAction}>
      <SubmitButton disabled={disabled} />
    </form>
  );
}
