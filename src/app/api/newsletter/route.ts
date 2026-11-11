import { NextRequest, NextResponse } from "next/server";
import { createNewsletterSubscriber } from "@/lib/shopify/contact-submissions";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import {
  ShopifyConfigError,
  ShopifyAuthError,
  ShopifyPermissionError,
  ShopifyRateLimitError,
} from "@/lib/shopify/admin-client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, 30);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many subscription attempts. Please wait a few minutes before trying again." },
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
    const email = body.email;
    const consent = body.consent;
    const source = (body.source || "footer").toString().trim();

    if (
      typeof email !== "string" ||
      !email.trim() ||
      email.length > 200 ||
      !EMAIL_REGEX.test(email.trim())
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Consent validation: must be accepted
    if (consent === false) {
      return NextResponse.json(
        { error: "Please agree to receive email news and offers." },
        { status: 400 }
      );
    }

    const result = await createNewsletterSubscriber(
      email.trim(),
      source,
      consent !== undefined ? Boolean(consent) : true
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your request was received.",
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
    console.error("[api/newsletter] POST failed:", error);

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
      { error: "We couldn't submit your subscription to Shopify. Please try again." },
      { status: 500 }
    );
  }
}
