import { ArrowRight } from "lucide-react";
import { redirectToCheckoutAction } from "@/lib/shopify/cart-actions";

export function CheckoutButton() {
  return (
    <form action={redirectToCheckoutAction}>
      <button
        type="submit"
        className="w-full py-3.5 rounded-[12px] bg-primary-green hover:bg-deep-green text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors shadow-xs"
      >
        Proceed to Checkout <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
