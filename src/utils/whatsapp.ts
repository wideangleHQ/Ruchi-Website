/** Single source of truth for WhatsApp contact links. Universal HTTPS (wa.me) works on mobile, desktop and web. */
export const WHATSAPP_NUMBER = "919124754082"; // country code + number, digits only

export const DEFAULT_WHATSAPP_MESSAGE = "Hello Ruchi Foodline! I would like to inquire about your products and offers.";

/** Keeps digits only, so "+91 91247-54082" and "919124754082" give the same link. */
export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** https://wa.me/<number>?text=<fully URL-encoded message>. Unicode, emoji, newlines, & and # are all safely encoded. */
export function buildWhatsAppUrl(message: string = DEFAULT_WHATSAPP_MESSAGE, phone: string = WHATSAPP_NUMBER): string {
  const number = digitsOnly(phone);
  if (!number) throw new Error("WhatsApp number is not configured");
  return message ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : `https://wa.me/${number}`;
}

/** Plain-text summary of an enquiry — used for the WhatsApp message and the "Copy Inquiry Details" fallback. Skips empty fields. */
export function buildInquiryText(title: string, fields: Record<string, string | undefined>): string {
  const lines = Object.entries(fields)
    .map(([label, value]) => [label, (value ?? "").trim()] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`);
  return [`Ruchi Foodline — ${title}`, ...lines].join("\n");
}
