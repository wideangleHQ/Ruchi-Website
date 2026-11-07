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

export async function GET(request: NextRequest) {
  const articleId =
    request.nextUrl.searchParams.get("articleId") ||
    request.nextUrl.searchParams.get("article_id");
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });

  const comments = await getApprovedComments(articleId);
  return NextResponse.json({ comments, reviews: comments });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many comments. Please try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const articleId = body.articleId || body.article_id;
    const rawName = body.name || "Verified Reader";
    const rawContent = body.content || body.comments;
    const rawRating = body.rating ?? body.ratings;
    const rating = rawRating !== null && rawRating !== undefined ? Number(rawRating) : null;

    if (!articleId || !rawContent?.trim()) {
      return NextResponse.json({ error: "Article ID and comment are required" }, { status: 400 });
    }
    if (rawName.length > 100 || rawContent.length > 5000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const comment = await addComment(articleId, {
      name: sanitize(rawName.trim()),
      content: sanitize(rawContent.trim()),
      rating: rating || null,
    });

    return NextResponse.json({
      success: true,
      comment,
      message: "Thank you. Your review was received.",
    });
  } catch (error) {
    console.error("[api/blog/comments] POST failed:", error);
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
