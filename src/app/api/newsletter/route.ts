import { NextRequest, NextResponse } from "next/server";
import { createNewsletterSubscriber } from "@/lib/shopify/contact-submissions";

// Simple rate limiting: per-IP, max 5 signups per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 600_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email;
    const consent = body.consent;

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

    await createNewsletterSubscriber(
      email.trim(),
      "footer",
      consent !== undefined ? Boolean(consent) : true
    );

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your request was received.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[api/newsletter] POST failed:", error);
    return NextResponse.json(
      { error: "We couldn't submit your request. Please try again." },
      { status: 500 }
    );
  }
}
