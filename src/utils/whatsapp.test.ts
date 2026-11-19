import test from "node:test";
import assert from "node:assert/strict";
import { buildWhatsAppUrl, digitsOnly, WHATSAPP_NUMBER } from "./whatsapp.ts";

test("default link is HTTPS wa.me with the encoded default message", () => {
  const url = buildWhatsAppUrl();
  assert.match(url, /^https:\/\/wa\.me\/919124754082\?text=Hello%20Ruchi%20Foodline!/);
  assert.ok(!url.includes(" "));
});

test("phone formatting is normalised to digits", () => {
  assert.equal(digitsOnly("+91 91247-54082"), WHATSAPP_NUMBER);
  assert.equal(buildWhatsAppUrl("hi", "+91 91247-54082"), "https://wa.me/919124754082?text=hi");
});

test("special characters round-trip safely", () => {
  const msg = "Order #12 & more?\nनमस्ते 🙏 100% 50% off=yes";
  const url = buildWhatsAppUrl(msg);
  assert.equal(new URL(url).searchParams.get("text"), msg);
  assert.ok(!/[&# \n]/.test(url.split("?text=")[1]));
});

test("empty message gives a bare chat link; missing number throws", () => {
  assert.equal(buildWhatsAppUrl("", "919124754082"), "https://wa.me/919124754082");
  assert.throws(() => buildWhatsAppUrl("hi", "abc"));
});

import { buildInquiryText } from "./whatsapp.ts";
test("inquiry text lists only filled fields", () => {
  assert.equal(buildInquiryText("Bulk order", { Name: "Asha", Phone: " ", Quantity: "50 kg" }), "Ruchi Foodline — Bulk order\nName: Asha\nQuantity: 50 kg");
});
