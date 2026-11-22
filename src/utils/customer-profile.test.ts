import test from "node:test";
import assert from "node:assert/strict";
import { isAddressId, normalizeIndianPhone, profilePhone, validateAddress, validateName } from "./customer-profile.ts";

test("Indian mobile numbers normalise to E.164; anything else is rejected", () => {
  for (const ok of ["9876543210", "98765 43210", "+91 98765-43210", "09876543210", "919876543210"]) assert.equal(normalizeIndianPhone(ok), "+919876543210", ok);
  for (const bad of ["12345", "5876543210", "+1 6135551111", "98765432101", "abc", "", null]) assert.equal(normalizeIndianPhone(bad), null, String(bad));
});

test("names: first name required; empty last name is omitted so it can't wipe a saved value", () => {
  assert.deepEqual(validateName({ firstName: "  Asha ", lastName: "" }), { ok: true, data: { firstName: "Asha" } });
  assert.deepEqual(validateName({ firstName: "Asha", lastName: "Mohapatra" }), { ok: true, data: { firstName: "Asha", lastName: "Mohapatra" } });
  assert.equal(validateName({ firstName: "" }).ok, false);
  assert.equal(validateName({ firstName: "Asha123" }).ok, false);
  assert.equal(validateName({ firstName: "<b>Asha</b>" }).ok, false); // markup is stripped, and the leftover "/" is rejected
  assert.equal(validateName({ firstName: "अनिता" }).ok, true); // non-Latin scripts are valid names
  assert.equal(validateName({ firstName: "J. D'Souza-Rao" }).ok, true);
});

const good = { firstName: "Asha", address1: "12 Temple Road", city: "Cuttack", zoneCode: "or", zip: "753010", phoneNumber: "98765 43210" };

test("a valid Indian address is normalised (state upper-cased, phone E.164, country fixed to IN)", () => {
  const r = validateAddress(good);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.data.zoneCode, "OR");
    assert.equal(r.data.phoneNumber, "+919876543210");
    assert.equal(r.data.countryCode, "IN");
    assert.equal("address2" in r.data, false); // blank optional fields are omitted, never sent as ""
  }
});

test("address errors are per field", () => {
  const r = validateAddress({ ...good, zip: "12345", zoneCode: "XX", phoneNumber: "123", address1: "", city: "" });
  assert.equal(r.ok, false);
  if (!r.ok) for (const f of ["zip", "zoneCode", "phoneNumber", "address1", "city"]) assert.ok(r.errors[f], f);
  assert.equal(validateAddress({ ...good, phoneNumber: "" }).ok, true); // phone is optional
});

test("profile phone: account phone first, then the checkout (default address) phone", () => {
  assert.deepEqual(profilePhone({ phoneNumber: { phoneNumber: "+911" }, defaultAddress: { phoneNumber: "+912" } }), { value: "+911", source: "account" });
  assert.deepEqual(profilePhone({ phoneNumber: null, defaultAddress: { phoneNumber: "+912" } }), { value: "+912", source: "checkout" });
  assert.equal(profilePhone({ phoneNumber: null, defaultAddress: null }), null);
});

test("only real Shopify address ids are accepted", () => {
  assert.equal(isAddressId("gid://shopify/CustomerAddress/123"), true);
  assert.equal(isAddressId("gid://shopify/CustomerAddress/123?model_name=CustomerAddress"), true);
  for (const bad of ["123", "gid://shopify/Customer/1", "gid://shopify/CustomerAddress/1; drop", null]) assert.equal(isAddressId(bad), false, String(bad));
});
