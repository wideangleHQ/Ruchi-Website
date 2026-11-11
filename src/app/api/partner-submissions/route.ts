import { NextRequest, NextResponse } from "next/server";
import {
  createContactSubmission,
  sanitizeInput,
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

    // Extract fields supporting both snake_case and camelCase
    const fullName = (body.full_name || body.fullName || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const phone = (body.phone || "").toString().trim();
    const companyName = (body.company_name || body.companyName || "").toString().trim();
    const businessType = (
      body.buisness_type ||
      body.business_type ||
      body.businessType ||
      ""
    ).toString().trim();
    const quantity = (body.quantity !== undefined && body.quantity !== null)
      ? String(body.quantity).trim()
      : "";
    const location = (body.location || "").toString().trim();
    const message = (body.message || "").toString().trim();

    // Validations
    if (!fullName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }
    if (fullName.length > 200) {
      return NextResponse.json(
        { error: "Full name must not exceed 200 characters." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }
    if (email.length > 200 || !EMAIL_REGEX.test(email)) {
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

    if (companyName.length > 200) {
      return NextResponse.json(
        { error: "Company name must not exceed 200 characters." },
        { status: 400 }
      );
    }

    if (location.length > 1000) {
      return NextResponse.json(
        { error: "Location must not exceed 1,000 characters." },
        { status: 400 }
      );
    }

    if (quantity && quantity.length > 100) {
      return NextResponse.json(
        { error: "Quantity must not exceed 100 characters." },
        { status: 400 }
      );
    }

    if (businessType.length > 200) {
      return NextResponse.json(
        { error: "Business type must not exceed 200 characters." },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must not exceed 5,000 characters." },
        { status: 400 }
      );
    }

    // Persist via Shopify metaobject contact submission
    const result = await createContactSubmission({
      formType: "partner",
      fullName: sanitizeInput(fullName),
      email: sanitizeInput(email),
      phone: phone ? sanitizeInput(phone) : undefined,
      message: message ? sanitizeInput(message) : "Partnership enquiry",
      companyName: companyName ? sanitizeInput(companyName) : undefined,
      quantity: quantity ? sanitizeInput(quantity) : undefined,
      location: location ? sanitizeInput(location) : undefined,
      businessType: businessType ? sanitizeInput(businessType) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your partnership enquiry was received.",
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
    console.error("[api/partner-submissions] POST failed:", error);

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

    return NextResponse.json(
      { error: "We couldn't submit your enquiry to Shopify. Please try again." },
      { status: 500 }
    );
  }
}
