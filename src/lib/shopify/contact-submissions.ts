import "server-only";
import { createHash } from "node:crypto";
import { shopifyAdminFetch } from "./admin-client";

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
}

// App-owned metaobject types (defined with the same Admin token the site uses to write).
const METAOBJECT_TYPE = "$app:contact_submission";
const NEWSLETTER_TYPE = "$app:newsletter_subscriber";

export async function createContactSubmission(input: ContactSubmissionInput): Promise<void> {
  const fields = [
    { key: "form_type", value: input.formType },
    { key: "full_name", value: input.fullName },
    { key: "email", value: input.email },
    { key: "phone", value: input.phone ?? "" },
    { key: "message", value: input.message ?? "" },
    { key: "company_name", value: input.companyName ?? "" },
    { key: "quantity", value: input.quantity ?? "" },
    { key: "location", value: input.location ?? "" },
    { key: "business_type", value: input.businessType ?? "" },
    { key: "status", value: "new" },
    { key: "submitted_at", value: new Date().toISOString() },
  ];

  const data = await shopifyAdminFetch<{
    metaobjectCreate: {
      metaobject: { id: string } | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>({
    query: /* GraphQL */ `
      mutation CreateContactSubmission($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject { id }
          userErrors { field message }
        }
      }
    `,
    variables: {
      metaobject: { type: METAOBJECT_TYPE, fields },
    },
  });

  const errors = data.metaobjectCreate.userErrors;
  if (errors.length > 0) {
    throw new Error(`Shopify metaobject error: ${errors.map((e) => e.message).join("; ")}`);
  }
}

/** Stores a newsletter signup; one entry per email (re-subscribing updates the same entry). */
export async function createNewsletterSubscriber(email: string, source = "footer"): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const handle = `sub-${createHash("sha256").update(normalized).digest("hex").slice(0, 16)}`;

  const data = await shopifyAdminFetch<{
    metaobjectUpsert: { metaobject: { id: string } | null; userErrors: { message: string }[] };
  }>({
    query: /* GraphQL */ `
      mutation UpsertSubscriber($handle: MetaobjectHandleInput!, $metaobject: MetaobjectUpsertInput!) {
        metaobjectUpsert(handle: $handle, metaobject: $metaobject) {
          metaobject { id }
          userErrors { message }
        }
      }
    `,
    variables: {
      handle: { type: NEWSLETTER_TYPE, handle },
      metaobject: {
        fields: [
          { key: "email", value: normalized },
          { key: "source", value: source },
          { key: "status", value: "subscribed" },
          { key: "subscribed_at", value: new Date().toISOString() },
        ],
      },
    },
  });

  const errors = data.metaobjectUpsert.userErrors;
  if (errors.length > 0) {
    throw new Error(`Shopify metaobject error: ${errors.map((e) => e.message).join("; ")}`);
  }
}
