import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { shopifyAdminFetch, ShopifyGraphQLError } from "./admin-client";
import type { Attribution } from "@/utils/attribution";

export type ContactFormType = "queries" | "bulk_order" | "partner";

export interface ContactSubmissionInput {
  formType: ContactFormType;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  companyName?: string;
  quantity?: string;
  location?: string;
  businessType?: string;
  /** Optional client-generated key: the same key always maps to the same Shopify entry (safe against double-submit/retry). */
  idempotencyKey?: string;
  /** Validated lead attribution (campaign tags, landing page, referrer). */
  attribution?: Attribution;
  /** Page the form was on (product or collection path). */
  sourcePage?: string;
}

export interface SubmissionResult {
  id: string;
  handle: string;
}

// App-owned metaobject types (defined under Headless app ID 12875497473)
const METAOBJECT_TYPE = "$app:contact_submission";
const METAOBJECT_TYPE_FALLBACK = "app--12875497473--contact_submission";

const NEWSLETTER_TYPE = "$app:newsletter_subscriber";
const NEWSLETTER_TYPE_FALLBACK = "app--12875497473--newsletter_subscriber";

/**
 * Clean sanitization for Shopify Metaobject text fields.
 * Strips HTML tags and malicious script injection while preserving genuine text,
 * quotes, ampersands, and apostrophes (no destructive entity encoding).
 */
export function sanitizeInput(str: string): string {
  if (!str) return "";
  return str
    .replace(/\0/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Creates a contact inquiry submission inside the Shopify Metaobject definition.
 * Returns the confirmed created Shopify Metaobject ID and handle.
 */
export async function createContactSubmission(
  input: ContactSubmissionInput
): Promise<SubmissionResult> {
  const cleanName = input.fullName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);
  // The handle is fixed ONCE per submission and the write is an upsert, so any retry (network timeout, 429, fallback type)
  // lands on the same entry instead of creating a duplicate when the first attempt actually succeeded.
  const unique = input.idempotencyKey
    ? createHash("sha256").update(input.idempotencyKey).digest("hex").slice(0, 16)
    : `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
  const handle = `${input.formType}-${cleanName || "entry"}-${unique}`;

  const fields = [
    { key: "form_type", value: input.formType },
    { key: "full_name", value: sanitizeInput(input.fullName) },
    { key: "email", value: sanitizeInput(input.email).toLowerCase() },
    { key: "phone", value: input.phone ? sanitizeInput(input.phone) : "" },
    { key: "message", value: input.message ? sanitizeInput(input.message) : "" },
    { key: "company_name", value: input.companyName ? sanitizeInput(input.companyName) : "" },
    { key: "quantity", value: input.quantity ? sanitizeInput(input.quantity) : "" },
    { key: "location", value: input.location ? sanitizeInput(input.location) : "" },
    { key: "business_type", value: input.businessType ? sanitizeInput(input.businessType) : "" },
    { key: "utm_source", value: input.attribution?.utm_source ?? "" },
    { key: "utm_medium", value: input.attribution?.utm_medium ?? "" },
    { key: "utm_campaign", value: input.attribution?.utm_campaign ?? "" },
    { key: "landing_page", value: input.attribution?.landing_page ?? "" },
    { key: "referrer", value: input.attribution?.referrer ?? "" },
    { key: "source_page", value: input.sourcePage ?? "" },
    { key: "status", value: "new" },
    { key: "submitted_at", value: new Date().toISOString() },
  ];

  const mutation = /* GraphQL */ `
    mutation UpsertContactSubmission($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  // Attempt creation with standard $app: prefix first, fallback to explicit handle if needed
  let data;
  try {
    data = await shopifyAdminFetch<{
      metaobjectUpsert: {
        metaobject: { id: string; handle: string } | null;
        userErrors: { field: string[]; message: string; code?: string }[];
      };
    }>({
      query: mutation,
      variables: {
        handle: { type: METAOBJECT_TYPE, handle },
        metaobject: { fields },
      },
    });
  } catch (err) {
    // Only a schema/type problem justifies the alternate type; network/auth/rate-limit errors must surface as-is.
    if (!(err instanceof ShopifyGraphQLError)) throw err;
    console.warn("[createContactSubmission] Attempting fallback metaobject type:", err);
    data = await shopifyAdminFetch<{
      metaobjectUpsert: {
        metaobject: { id: string; handle: string } | null;
        userErrors: { field: string[]; message: string; code?: string }[];
      };
    }>({
      query: mutation,
      variables: {
        handle: { type: METAOBJECT_TYPE_FALLBACK, handle },
        metaobject: { fields },
      },
    });
  }

  const errors = data.metaobjectUpsert?.userErrors ?? [];
  if (errors.length > 0) {
    const errorMsg = errors.map((e) => `${e.field?.join(".") || "field"}: ${e.message}`).join("; ");
    console.error("[createContactSubmission] Shopify userErrors:", errorMsg);
    throw new Error(`Shopify metaobject error: ${errorMsg}`);
  }

  const created = data.metaobjectUpsert?.metaobject;
  if (!created?.id) {
    throw new Error("Shopify did not return a confirmed metaobject ID upon creation.");
  }

  console.log(`[createContactSubmission] Successfully persisted Metaobject: ${created.id} (handle: ${created.handle})`);
  return { id: created.id, handle: created.handle };
}

/** Stores a newsletter signup; one entry per email (re-subscribing updates the same entry). */
export async function createNewsletterSubscriber(
  email: string,
  source = "footer",
  consent = true
): Promise<SubmissionResult> {
  const normalized = sanitizeInput(email).toLowerCase();
  const handle = `sub-${createHash("sha256").update(normalized).digest("hex").slice(0, 16)}`;

  // Best-effort sync to Shopify Customer with Email Marketing Consent
  try {
    await shopifyAdminFetch<{
      customerCreate?: {
        customer?: { id: string } | null;
        userErrors?: { field: string[]; message: string }[];
      };
    }>({
      query: /* GraphQL */ `
        mutation CreateSubscriberCustomer($input: CustomerInput!) {
          customerCreate(input: $input) {
            customer {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          email: normalized,
          emailMarketingConsent: {
            marketingState: consent ? "SUBSCRIBED" : "UNSUBSCRIBED",
            marketingOptInLevel: "SINGLE_OPT_IN",
            consentUpdatedAt: new Date().toISOString(),
          },
          tags: ["newsletter", "headless-subscriber", source],
        },
      },
    }).catch(() => null);
  } catch {
    // Non-blocking: Customer may already exist or customerCreate permissions may differ
  }

  const upsertMutation = /* GraphQL */ `
    mutation UpsertSubscriber($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
      metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          message
        }
      }
    }
  `;

  const fields = [
    { key: "email", value: normalized },
    { key: "source", value: source },
    { key: "status", value: consent ? "subscribed" : "unsubscribed" },
    { key: "subscribed_at", value: new Date().toISOString() },
  ];

  let data;
  try {
    data = await shopifyAdminFetch<{
      metaobjectUpsert: {
        metaobject: { id: string; handle: string } | null;
        userErrors: { message: string }[];
      };
    }>({
      query: upsertMutation,
      variables: {
        handle: { type: NEWSLETTER_TYPE, handle },
        metaobject: { fields },
      },
    });
  } catch (err) {
    console.warn("[createNewsletterSubscriber] Attempting fallback metaobject type:", err);
    data = await shopifyAdminFetch<{
      metaobjectUpsert: {
        metaobject: { id: string; handle: string } | null;
        userErrors: { message: string }[];
      };
    }>({
      query: upsertMutation,
      variables: {
        handle: { type: NEWSLETTER_TYPE_FALLBACK, handle },
        metaobject: { fields },
      },
    });
  }

  const errors = data.metaobjectUpsert?.userErrors ?? [];
  if (errors.length > 0) {
    const errorMsg = errors.map((e) => e.message).join("; ");
    console.error("[createNewsletterSubscriber] Shopify userErrors:", errorMsg);
    throw new Error(`Shopify metaobject error: ${errorMsg}`);
  }

  const upserted = data.metaobjectUpsert?.metaobject;
  if (!upserted?.id) {
    throw new Error("Shopify did not return a confirmed metaobject ID upon subscriber upsert.");
  }

  console.log(`[createNewsletterSubscriber] Successfully persisted Metaobject: ${upserted.id} (handle: ${upserted.handle})`);
  return { id: upserted.id, handle: upserted.handle };
}
