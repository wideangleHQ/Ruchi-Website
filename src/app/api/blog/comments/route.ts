import { NextRequest, NextResponse } from "next/server";
import { getApprovedComments, addComment } from "@/lib/shopify/admin-blog";

// Simple rate limiting: per-IP, max 5 comments per 10 minutes
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

export async function GET(request: NextRequest) {
  const articleId = request.nextUrl.searchParams.get("articleId");
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });

  const comments = await getApprovedComments(articleId);
  return NextResponse.json({ comments });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many comments. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { articleId, name, content, rating } = body;

    if (!articleId || !name?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "Name and comment are required" }, { status: 400 });
    }
    if (name.length > 100 || content.length > 2000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    if (rating !== null && rating !== undefined && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const comment = await addComment(articleId, {
      name: sanitize(name.trim()),
      content: sanitize(content.trim()),
      rating: rating || null,
    });

    return NextResponse.json({ comment, message: "Comment submitted for review" });
  } catch (error) {
    console.error("[api/blog/comments] POST failed:", error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
