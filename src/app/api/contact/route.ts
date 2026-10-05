import { NextRequest, NextResponse } from "next/server";
import { createContactSubmission, type ContactFormType } from "@/lib/shopify/contact-submissions";

// Simple rate limiting: per-IP, max 5 submissions per 10 minutes
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
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;
const VALID_FORM_TYPES: ContactFormType[] = ["queries", "bulk_order", "partner"];
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const {
      formType,
      fullName,
      email,
      phone,
      message,
      companyName,
      quantity,
      location,
      businessType,
    } = body;

    if (!VALID_FORM_TYPES.includes(formType)) {
      return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
    }
    if (!fullName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
    }
    if (fullName.length > MAX_FIELD_LENGTH || email.length > MAX_FIELD_LENGTH) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    if (phone && !PHONE_REGEX.test(phone.trim())) {
      return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
    }
    if (message && message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 });
    }

    if (formType === "bulk_order" && !quantity?.trim()) {
      return NextResponse.json({ error: "Approximate quantity is required" }, { status: 400 });
    }
    if (formType === "partner" && !businessType?.trim()) {
      return NextResponse.json({ error: "Business type is required" }, { status: 400 });
    }

    await createContactSubmission({
      formType,
      fullName: sanitize(fullName.trim()),
      email: sanitize(email.trim()),
      phone: phone ? sanitize(phone.trim()) : undefined,
      message: message ? sanitize(message.trim()) : undefined,
      companyName: companyName ? sanitize(companyName.trim()) : undefined,
      quantity: quantity ? sanitize(quantity.trim()) : undefined,
      location: location ? sanitize(location.trim()) : undefined,
      businessType: businessType ? sanitize(businessType.trim()) : undefined,
    });

    return NextResponse.json({ message: "Submission received" });
  } catch (error) {
    console.error("[api/contact] POST failed:", error);
    return NextResponse.json({ error: "Failed to submit. Please try again." }, { status: 500 });
  }
}
