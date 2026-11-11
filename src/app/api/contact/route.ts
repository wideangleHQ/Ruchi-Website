import { NextRequest, NextResponse } from "next/server";
import {
  createContactSubmission,
  sanitizeInput,
  type ContactFormType,
} from "@/lib/shopify/contact-submissions";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import {
  ShopifyConfigError,
  ShopifyAuthError,
  ShopifyPermissionError,
  ShopifyRateLimitError,
} from "@/lib/shopify/admin-client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,25}$/;
const VALID_FORM_TYPES: ContactFormType[] = ["queries", "bulk_order", "partner"];
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, 30);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": "600",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // Harmonize camelCase and snake_case inputs
    const formType = (body.formType || body.form_type) as ContactFormType;
    const fullName = (body.fullName || body.full_name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const message = (body.message || "").toString().trim();
    const companyName = (body.companyName || body.company_name || "").toString().trim();
    const quantity = body.quantity !== undefined && body.quantity !== null
      ? String(body.quantity).trim()
      : "";
    const location = (body.location || "").toString().trim();
    const businessType = (
      body.businessType ||
      body.business_type ||
      body.buisness_type ||
      ""
    ).toString().trim();

    // Validation
    if (!VALID_FORM_TYPES.includes(formType)) {
      return NextResponse.json(
        { error: "Invalid form type. Must be queries, bulk_order, or partner." },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }
    if (fullName.length > MAX_FIELD_LENGTH) {
      return NextResponse.json(
        { error: `Full name must not exceed ${MAX_FIELD_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }
    if (email.length > MAX_FIELD_LENGTH || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (phone && (!PHONE_REGEX.test(phone) || phone.length > 50)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (formType === "bulk_order" && !quantity) {
      return NextResponse.json(
        { error: "Approximate quantity is required for bulk order enquiries." },
        { status: 400 }
      );
    }

    if (formType === "partner" && !businessType) {
      return NextResponse.json(
        { error: "Please select your business type." },
        { status: 400 }
      );
    }

    // Persist to Shopify Metaobjects
    const result = await createContactSubmission({
      formType,
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : undefined,
      message: message ? sanitizeInput(message) : undefined,
      companyName: companyName ? sanitizeInput(companyName) : undefined,
      quantity: quantity ? sanitizeInput(quantity) : undefined,
      location: location ? sanitizeInput(location) : undefined,
      businessType: businessType ? sanitizeInput(businessType) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your enquiry was received.",
        id: result.id,
        handle: result.handle,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("[api/contact] POST failed:", error);

    if (error instanceof ShopifyConfigError) {
      return NextResponse.json(
        {
          error: "Shopify integration configuration missing: SHOPIFY_ADMIN_ACCESS_TOKEN is not configured on the server.",
          code: "CONFIGURATION_ERROR",
        },
        { status: 503 }
      );
    }

    if (error instanceof ShopifyAuthError) {
      return NextResponse.json(
        {
          error: "Shopify Admin authentication failed: invalid or expired access token.",
          code: "AUTHENTICATION_ERROR",
        },
        { status: 502 }
      );
    }

    if (error instanceof ShopifyPermissionError) {
      return NextResponse.json(
        {
          error: "Shopify permissions error: token lacks write_metaobjects scope.",
          code: "PERMISSION_ERROR",
        },
        { status: 502 }
      );
    }

    if (error instanceof ShopifyRateLimitError) {
      return NextResponse.json(
        {
          error: "Shopify API is temporarily busy. Please try again in a few moments.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const message = error instanceof Error ? error.message : "Failed to submit enquiry.";
    return NextResponse.json(
      { error: "We couldn't submit your enquiry to Shopify. Please try again." },
      { status: 500 }
    );
  }
}
