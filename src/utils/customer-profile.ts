/**
 * Validation for the customer's own profile edits (name, delivery phone, addresses), shared by the forms and the
 * server actions. The server re-validates everything: browser values are never trusted.
 */

// Shopify's province codes for India, read from the store's own shipping zones (2026-11-22).
export const IN_STATES: ReadonlyArray<readonly [code: string, name: string]> = [
  ["AN", "Andaman and Nicobar Islands"], ["AP", "Andhra Pradesh"], ["AR", "Arunachal Pradesh"], ["AS", "Assam"],
  ["BR", "Bihar"], ["CH", "Chandigarh"], ["CG", "Chhattisgarh"], ["DN", "Dadra and Nagar Haveli"], ["DD", "Daman and Diu"],
  ["DL", "Delhi"], ["GA", "Goa"], ["GJ", "Gujarat"], ["HR", "Haryana"], ["HP", "Himachal Pradesh"], ["JK", "Jammu and Kashmir"],
  ["JH", "Jharkhand"], ["KA", "Karnataka"], ["KL", "Kerala"], ["LA", "Ladakh"], ["LD", "Lakshadweep"], ["MP", "Madhya Pradesh"],
  ["MH", "Maharashtra"], ["MN", "Manipur"], ["ML", "Meghalaya"], ["MZ", "Mizoram"], ["NL", "Nagaland"], ["OR", "Odisha"],
  ["PY", "Puducherry"], ["PB", "Punjab"], ["RJ", "Rajasthan"], ["SK", "Sikkim"], ["TN", "Tamil Nadu"], ["TS", "Telangana"],
  ["TR", "Tripura"], ["UP", "Uttar Pradesh"], ["UK", "Uttarakhand"], ["WB", "West Bengal"],
];
const STATE_CODES = new Set(IN_STATES.map(([c]) => c));

export type FieldErrors = Partial<Record<string, string>>;
export type Result<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

// Letters (any script), spaces, and . ' - — enough for Indian and international names, nothing that looks like markup.
const NAME = /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u;

/**
 * Indian mobile numbers to E.164 (+91XXXXXXXXXX), the format Shopify requires.
 * Accepts "98765 43210", "+91 98765-43210", "09876543210", "919876543210". Returns null when it isn't a valid mobile.
 */
export function normalizeIndianPhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+91")) d = d.slice(3);
  else if (d.startsWith("+")) return null; // other country codes: the store ships within India only
  else if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  else if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? `+91${d}` : null;
}

export type NameInput = { firstName: string; lastName?: string };

/**
 * First name is required; an empty last name is left out of the update rather than sent as "", so a blank field
 * can never wipe a saved value by accident.
 */
export function validateName(input: { firstName?: unknown; lastName?: unknown }): Result<NameInput> {
  const errors: FieldErrors = {};
  const firstName = clean(input.firstName, 60);
  const lastName = clean(input.lastName, 60);
  if (!firstName) errors.firstName = "Please enter your first name.";
  else if (!NAME.test(firstName)) errors.firstName = "Use letters only (spaces, . ' - are fine).";
  if (lastName && !NAME.test(lastName)) errors.lastName = "Use letters only (spaces, . ' - are fine).";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: lastName ? { firstName, lastName } : { firstName } };
}

export type AddressInput = {
  firstName: string;
  lastName?: string;
  address1: string;
  address2?: string;
  city: string;
  zoneCode: string;
  zip: string;
  countryCode: "IN";
  phoneNumber?: string;
};

export function validateAddress(input: Record<string, unknown>): Result<AddressInput> {
  const errors: FieldErrors = {};
  const firstName = clean(input.firstName, 60);
  const lastName = clean(input.lastName, 60);
  const address1 = clean(input.address1, 200);
  const address2 = clean(input.address2, 200);
  const city = clean(input.city, 80);
  const zoneCode = clean(input.zoneCode, 4).toUpperCase();
  const zip = clean(input.zip, 10).replace(/\s/g, "");
  const phoneRaw = clean(input.phoneNumber, 20);

  if (!firstName) errors.firstName = "Please enter the recipient's first name.";
  else if (!NAME.test(firstName)) errors.firstName = "Use letters only.";
  if (lastName && !NAME.test(lastName)) errors.lastName = "Use letters only.";
  if (address1.length < 3) errors.address1 = "Please enter the house/flat and street.";
  if (city.length < 2) errors.city = "Please enter the city or town.";
  if (!STATE_CODES.has(zoneCode)) errors.zoneCode = "Please choose a state.";
  if (!/^[1-9]\d{5}$/.test(zip)) errors.zip = "Enter a valid 6-digit PIN code.";
  let phoneNumber: string | undefined;
  if (phoneRaw) {
    const p = normalizeIndianPhone(phoneRaw);
    if (!p) errors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";
    else phoneNumber = p;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      firstName,
      ...(lastName ? { lastName } : {}),
      address1,
      ...(address2 ? { address2 } : {}),
      city,
      zoneCode,
      zip,
      countryCode: "IN",
      ...(phoneNumber ? { phoneNumber } : {}),
    },
  };
}

/** Which phone to show on the profile: the account's own, else the one given at checkout (default address). */
export function profilePhone(customer: {
  phoneNumber?: { phoneNumber: string } | null;
  defaultAddress?: { phoneNumber?: string | null } | null;
}): { value: string; source: "account" | "checkout" } | null {
  if (customer.phoneNumber?.phoneNumber) return { value: customer.phoneNumber.phoneNumber, source: "account" };
  if (customer.defaultAddress?.phoneNumber) return { value: customer.defaultAddress.phoneNumber, source: "checkout" };
  return null;
}

/** Shopify GIDs for this customer's own addresses only look like this; anything else is rejected before any API call. */
export const isAddressId = (v: unknown): v is string => typeof v === "string" && /^gid:\/\/shopify\/CustomerAddress\/\d+(\?.*)?$/.test(v);
