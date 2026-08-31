import { redirectToCheckoutAction } from "@/lib/shopify/cart-actions";

export function CheckoutButton() {
  return (
    <form action={redirectToCheckoutAction}>
      <button
        type="submit"
        className="w-full rounded-brand bg-primary-green px-4 py-3 text-sm font-medium text-white"
      >
        Checkout
      </button>
    </form>
  );
}
