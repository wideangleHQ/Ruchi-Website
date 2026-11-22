"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { CA_COOKIES } from "@/lib/shopify/customer-account-core";
import {
  createCustomerAddress,
  getCustomer,
  updateCustomerAddress,
  updateCustomerName,
  type MutationResult,
} from "@/lib/shopify/customer-account";
import { isAddressId, normalizeIndianPhone, validateAddress, validateName, type FieldErrors } from "@/utils/customer-profile";

export type ProfileActionState = { status: "idle" | "success" | "error"; message?: string; fieldErrors?: FieldErrors };

const SESSION_EXPIRED: ProfileActionState = { status: "error", message: "Your session has expired. Please sign in again to save changes." };

/** The signed-in customer's access token — from the httpOnly cookie only, never from the form. */
async function token(): Promise<string | null> {
  return (await cookies()).get(CA_COOKIES.access)?.value ?? null;
}

function toState(r: MutationResult, success: string): ProfileActionState {
  if (r.ok) {
    revalidatePath("/account");
    return { status: "success", message: success };
  }
  if (r.reason === "session") return SESSION_EXPIRED;
  if (r.reason === "network") return { status: "error", message: "We couldn't reach Shopify. Please try again." };
  return { status: "error", message: r.message ?? "Shopify couldn't save this change.", fieldErrors: r.field ? { [r.field]: r.message } : undefined };
}

export async function updateNameAction(_prev: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const t = await token();
  if (!t) return SESSION_EXPIRED;
  const v = validateName({ firstName: form.get("firstName"), lastName: form.get("lastName") });
  if (!v.ok) return { status: "error", message: "Please check the highlighted fields.", fieldErrors: v.errors };
  return toState(await updateCustomerName(t, v.data), "Your name has been updated.");
}

/**
 * Delivery phone = the phone on the customer's default address (where checkout stores it). The account's sign-in
 * phone can't be changed through Shopify's Customer Account API, so it is never touched here.
 * The address to update is looked up from the customer's own record, not taken from the form.
 */
export async function updateDeliveryPhoneAction(_prev: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const t = await token();
  if (!t) return SESSION_EXPIRED;
  const phone = normalizeIndianPhone(form.get("phoneNumber"));
  if (!phone) return { status: "error", message: "Please check the highlighted field.", fieldErrors: { phoneNumber: "Enter a valid 10-digit Indian mobile number." } };
  const customer = await getCustomer(t);
  if (!customer) return SESSION_EXPIRED;
  if (!customer.defaultAddress) return { status: "error", message: "Add a delivery address first — the phone number is saved with it." };
  return toState(await updateCustomerAddress(t, customer.defaultAddress.id, { phoneNumber: phone }), "Your delivery phone number has been updated.");
}

export async function saveAddressAction(_prev: ProfileActionState, form: FormData): Promise<ProfileActionState> {
  const t = await token();
  if (!t) return SESSION_EXPIRED;
  const v = validateAddress(Object.fromEntries(form.entries()));
  if (!v.ok) return { status: "error", message: "Please check the highlighted fields.", fieldErrors: v.errors };
  const makeDefault = form.get("defaultAddress") === "on";
  const id = form.get("addressId");

  if (id) {
    // Editing: the id must be one of THIS customer's saved addresses (Shopify also enforces this).
    if (!isAddressId(id)) return { status: "error", message: "That address couldn't be found." };
    const customer = await getCustomer(t);
    if (!customer) return SESSION_EXPIRED;
    if (!customer.addresses.nodes.some((a) => a.id === id)) return { status: "error", message: "That address couldn't be found." };
    return toState(await updateCustomerAddress(t, id, v.data, makeDefault), "Address saved.");
  }
  return toState(await createCustomerAddress(t, v.data, makeDefault), "Address added.");
}
