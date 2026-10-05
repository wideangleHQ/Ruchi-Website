import "server-only";
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

const METAOBJECT_TYPE = "contact_submission";

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
