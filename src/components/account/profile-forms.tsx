"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveAddressAction, updateDeliveryPhoneAction, updateNameAction, type ProfileActionState } from "@/app/account/actions";
import { IN_STATES } from "@/utils/customer-profile";
import type { SavedAddress } from "@/lib/shopify/customer-account";

const IDLE: ProfileActionState = { status: "idle" };
const input =
  "mt-1 block w-full min-h-11 rounded-brand border border-border bg-white px-3 text-[15px] font-medium text-text focus:border-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/25";
const label = "block text-sm font-medium text-muted-text";
const btn =
  "inline-flex min-h-11 items-center justify-center rounded-brand bg-primary-green px-5 text-[15px] font-medium text-white transition-colors hover:bg-deep-green disabled:cursor-not-allowed disabled:opacity-60";
const ghost = "inline-flex min-h-11 items-center justify-center rounded-brand px-4 text-[15px] font-medium text-primary-green hover:bg-soft-green";

function Status({ state }: { state: ProfileActionState }) {
  if (state.status === "idle" || !state.message) return null;
  return (
    <p role={state.status === "error" ? "alert" : "status"} className={`mt-3 text-sm font-medium ${state.status === "error" ? "text-brand-red" : "text-primary-green"}`}>
      {state.message}
    </p>
  );
}

function FieldError({ state, name }: { state: ProfileActionState; name: string }) {
  const msg = state.fieldErrors?.[name];
  return msg ? <p id={`${name}-error`} className="mt-1 text-xs font-medium text-brand-red">{msg}</p> : null;
}

/** Closes the form and refreshes server data once Shopify confirms the save. */
function useCloseOnSuccess(state: ProfileActionState, close: () => void) {
  const router = useRouter();
  const closeRef = useRef(close);
  const handled = useRef<ProfileActionState | null>(null);
  useEffect(() => {
    closeRef.current = close;
  });
  useEffect(() => {
    // Act once per save result (the state object changes only when the action returns), never on later re-renders.
    if (state.status !== "success" || handled.current === state) return;
    handled.current = state;
    router.refresh();
    const id = setTimeout(() => closeRef.current(), 1200); // leave the confirmation visible briefly
    return () => clearTimeout(id);
  }, [state, router]);
}

// ---------------- Profile details ----------------

export function ProfileDetails({
  firstName,
  lastName,
  email,
  phone,
  hasDefaultAddress,
}: {
  firstName: string | null;
  lastName: string | null;
  email?: string;
  phone: { value: string; source: "account" | "checkout" } | null;
  hasDefaultAddress: boolean;
}) {
  const [editing, setEditing] = useState<"name" | "phone" | null>(null);
  const [nameState, nameAction, namePending] = useActionState(updateNameAction, IDLE);
  const [phoneState, phoneAction, phonePending] = useActionState(updateDeliveryPhoneAction, IDLE);
  useCloseOnSuccess(nameState, () => setEditing(null));
  useCloseOnSuccess(phoneState, () => setEditing(null));

  const row = "flex flex-col gap-0.5 px-4 py-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:gap-4";
  const dt = "text-sm font-medium text-muted-text min-[420px]:w-28 min-[420px]:shrink-0 min-[420px]:pt-0.5";
  const editBtn = "ml-auto shrink-0 text-sm font-semibold text-primary-green hover:underline min-h-11 min-[420px]:min-h-0";

  return (
    <dl className="max-w-xl divide-y divide-border rounded-brand border border-border">
      {/* Name */}
      <div className={row}>
        <dt className={dt}>Name</dt>
        <dd className="min-w-0 flex-1">
          {editing === "name" ? (
            <form action={nameAction} noValidate>
              <div className="grid gap-3 min-[480px]:grid-cols-2">
                <label className={label}>
                  First name
                  <input name="firstName" defaultValue={firstName ?? ""} required autoComplete="given-name" className={input} aria-invalid={!!nameState.fieldErrors?.firstName} aria-describedby="firstName-error" />
                  <FieldError state={nameState} name="firstName" />
                </label>
                <label className={label}>
                  Last name
                  <input name="lastName" defaultValue={lastName ?? ""} autoComplete="family-name" className={input} aria-invalid={!!nameState.fieldErrors?.lastName} aria-describedby="lastName-error" />
                  <FieldError state={nameState} name="lastName" />
                </label>
              </div>
              <div className="mt-3 flex gap-2">
                <button type="submit" disabled={namePending} className={btn}>{namePending ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setEditing(null)} className={ghost}>Cancel</button>
              </div>
              <Status state={nameState} />
            </form>
          ) : (
            <div className="flex items-start gap-3">
              <span className="break-words text-[15px] font-medium text-text">{[firstName, lastName].filter(Boolean).join(" ") || "Not added yet"}</span>
              <button type="button" onClick={() => setEditing("name")} className={editBtn}>{firstName ? "Edit" : "Add"}</button>
            </div>
          )}
        </dd>
      </div>

      {/* Email (sign-in identity, managed by Shopify) */}
      <div className={row}>
        <dt className={dt}>Email</dt>
        <dd className="break-words text-[15px] font-medium text-text">
          {email || "—"}
          <span className="mt-0.5 block text-xs font-medium text-muted-text">Used to sign in; managed by Shopify.</span>
        </dd>
      </div>

      {/* Phone */}
      <div className={row}>
        <dt className={dt}>Phone</dt>
        <dd className="min-w-0 flex-1">
          {editing === "phone" ? (
            <form action={phoneAction} noValidate>
              <label className={label}>
                Delivery phone (10-digit mobile)
                <input name="phoneNumber" type="tel" inputMode="tel" autoComplete="tel" defaultValue={phone?.source === "checkout" ? phone.value : ""} className={input} aria-invalid={!!phoneState.fieldErrors?.phoneNumber} aria-describedby="phoneNumber-error" />
                <FieldError state={phoneState} name="phoneNumber" />
              </label>
              <div className="mt-3 flex gap-2">
                <button type="submit" disabled={phonePending} className={btn}>{phonePending ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setEditing(null)} className={ghost}>Cancel</button>
              </div>
              <Status state={phoneState} />
            </form>
          ) : (
            <div className="flex items-start gap-3">
              <span className="break-words text-[15px] font-medium text-text">
                {phone?.value ?? "Not added yet"}
                {phone?.source === "checkout" && <span className="mt-0.5 block text-xs font-medium text-muted-text">From your checkout delivery address</span>}
                {phone?.source === "account" && <span className="mt-0.5 block text-xs font-medium text-muted-text">Sign-in phone; managed by Shopify</span>}
              </span>
              {phone?.source !== "account" && (
                hasDefaultAddress ? (
                  <button type="button" onClick={() => setEditing("phone")} className={editBtn}>{phone ? "Edit" : "Add"}</button>
                ) : (
                  <a href="/account?tab=addresses" className={editBtn}>Add with an address</a>
                )
              )}
            </div>
          )}
        </dd>
      </div>
    </dl>
  );
}

// ---------------- Addresses ----------------

function AddressForm({
  address,
  defaults,
  isDefault,
  onDone,
}: {
  address?: SavedAddress;
  defaults: { firstName?: string | null; lastName?: string | null; phone?: string | null };
  isDefault: boolean;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(saveAddressAction, IDLE);
  useCloseOnSuccess(state, onDone);
  const v = (k: keyof SavedAddress) => (address?.[k] as string | null | undefined) ?? "";
  const field = (name: string, text: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <label className={label}>
      {text}
      <input name={name} className={input} aria-invalid={!!state.fieldErrors?.[name]} aria-describedby={`${name}-error`} {...props} />
      <FieldError state={state} name={name} />
    </label>
  );

  return (
    <form action={action} noValidate className="rounded-brand border border-border p-4">
      {address && <input type="hidden" name="addressId" value={address.id} />}
      <div className="grid gap-3 min-[480px]:grid-cols-2">
        {field("firstName", "First name", { defaultValue: address ? v("firstName") : defaults.firstName ?? "", autoComplete: "given-name", required: true })}
        {field("lastName", "Last name", { defaultValue: address ? v("lastName") : defaults.lastName ?? "", autoComplete: "family-name" })}
        <div className="min-[480px]:col-span-2">{field("address1", "House / flat, street", { defaultValue: v("address1"), autoComplete: "address-line1", required: true })}</div>
        <div className="min-[480px]:col-span-2">{field("address2", "Area / landmark (optional)", { defaultValue: v("address2"), autoComplete: "address-line2" })}</div>
        {field("city", "City / town", { defaultValue: v("city"), autoComplete: "address-level2", required: true })}
        <label className={label}>
          State
          <select name="zoneCode" defaultValue={v("zoneCode")} required className={input} aria-invalid={!!state.fieldErrors?.zoneCode} aria-describedby="zoneCode-error">
            <option value="" disabled>Choose a state</option>
            {IN_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <FieldError state={state} name="zoneCode" />
        </label>
        {field("zip", "PIN code", { defaultValue: v("zip"), inputMode: "numeric", autoComplete: "postal-code", maxLength: 6, required: true })}
        {field("phoneNumber", "Mobile (for delivery)", { defaultValue: address ? v("phoneNumber") : defaults.phone ?? "", type: "tel", inputMode: "tel", autoComplete: "tel" })}
      </div>
      <p className="mt-2 text-xs font-medium text-muted-text">Country: India (we deliver within India).</p>
      {!isDefault && (
        <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-medium text-text">
          <input type="checkbox" name="defaultAddress" className="h-4 w-4 accent-[#168a4a]" /> Make this my default address
        </label>
      )}
      <div className="mt-3 flex gap-2">
        <button type="submit" disabled={pending} className={btn}>{pending ? "Saving…" : address ? "Save address" : "Add address"}</button>
        <button type="button" onClick={onDone} className={ghost}>Cancel</button>
      </div>
      <Status state={state} />
    </form>
  );
}

export function AddressBook({
  addresses,
  defaultId,
  defaults,
}: {
  addresses: SavedAddress[];
  defaultId: string | null;
  defaults: { firstName?: string | null; lastName?: string | null; phone?: string | null };
}) {
  const [editing, setEditing] = useState<string | "new" | null>(null);

  return (
    <div className="mt-3 space-y-3">
      {addresses.length === 0 && editing !== "new" && (
        <p className="text-sm font-medium text-muted-text">No saved addresses yet. Addresses you use at checkout are saved here automatically.</p>
      )}
      <ul className="grid gap-3 sm:grid-cols-2">
        {addresses.map((a) =>
          editing === a.id ? (
            <li key={a.id} className="sm:col-span-2">
              <AddressForm address={a} defaults={defaults} isDefault={a.id === defaultId} onDone={() => setEditing(null)} />
            </li>
          ) : (
            <li key={a.id} className="rounded-brand border border-border p-4 text-sm font-medium leading-relaxed text-text">
              {a.id === defaultId && <p className="mb-1 text-xs font-medium text-primary-green">Default</p>}
              {a.formatted.map((l, i) => <p key={i} className="break-words">{l}</p>)}
              {a.phoneNumber && <p className="break-words">{a.phoneNumber}</p>}
              <button type="button" onClick={() => setEditing(a.id)} className="mt-2 min-h-11 text-sm font-semibold text-primary-green hover:underline">
                Edit
              </button>
            </li>
          )
        )}
      </ul>
      {editing === "new" ? (
        <AddressForm defaults={defaults} isDefault={addresses.length === 0} onDone={() => setEditing(null)} />
      ) : (
        <button type="button" onClick={() => setEditing("new")} className={ghost + " border border-primary-green/40"}>
          + Add an address
        </button>
      )}
    </div>
  );
}
