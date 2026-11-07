import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/shopify/contact-submissions";

// Rate limiting: per-IP, max 10 submissions per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 600_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s()-]{7,25}$/;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
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

    if (!message) {
      return NextResponse.json(
        { error: "Please tell us about your requirements." },
        { status: 400 }
      );
    }
    if (message.length > 5000) {
      return NextResponse.json(
        { error: "Message must not exceed 5,000 characters." },
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

    // Persist via Shopify metaobject contact submission
    await createContactSubmission({
      formType: "partner",
      fullName: sanitize(fullName),
      email: sanitize(email.toLowerCase()),
      phone: phone ? sanitize(phone) : undefined,
      message: sanitize(message),
      companyName: companyName ? sanitize(companyName) : undefined,
      quantity: quantity ? sanitize(quantity) : undefined,
      location: location ? sanitize(location) : undefined,
      businessType: businessType ? sanitize(businessType) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. Your partnership enquiry was received.",
    });
  } catch (error) {
    console.error("[api/partner-submissions] POST failed:", error);
    return NextResponse.json(
      { error: "We couldn't submit your enquiry. Please try again." },
      { status: 500 }
    );
  }
}

