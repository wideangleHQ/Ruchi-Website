import { NextRequest, NextResponse } from "next/server";
import { createNewsletterSubscriber } from "@/lib/shopify/contact-submissions";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";

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
    return NextResponse.json(
      { error: "We couldn't submit your subscription to Shopify. Please try again." },
      { status: 500 }
    );
  }
}
