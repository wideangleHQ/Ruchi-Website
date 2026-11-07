import { NextRequest, NextResponse } from "next/server";
import { getApprovedComments, addComment, addRating, getRatings } from "@/lib/shopify/admin-blog";

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

export async function GET(request: NextRequest) {
  const articleId =
    request.nextUrl.searchParams.get("article_id") ||
    request.nextUrl.searchParams.get("articleId");

  if (!articleId) {
    return NextResponse.json({ error: "Missing article_id" }, { status: 400 });
  }

  try {
    const [comments, ratings] = await Promise.all([
      getApprovedComments(articleId),
      getRatings(articleId),
    ]);
    return NextResponse.json({ reviews: comments, ratings });
  } catch (error) {
    console.error("[api/blog-reviews] GET failed:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

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
    const articleId = (body.article_id || body.articleId || "").toString().trim();
    const comments = (body.comments || body.content || body.review || "").toString().trim();
    const rawRating = body.ratings ?? body.rating ?? body.score;
    const rating = Number(rawRating);
    const authorName = (body.name || body.author || "Verified Reader").toString().trim();
    const sessionId = (
      body.sessionId ||
      body.session_id ||
      `session-${ip.replace(/[^a-zA-Z0-9]/g, "")}-${Date.now()}`
    ).toString();

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    if (!comments) {
      return NextResponse.json({ error: "Your review comment is required" }, { status: 400 });
    }

    if (comments.length > 5000) {
      return NextResponse.json(
        { error: "Review comment exceeds 5,000 characters limit" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    const sanitizedComments = sanitize(comments);
    const sanitizedName = sanitize(authorName.slice(0, 100));

    // 1. Add comment to review queue
    const comment = await addComment(articleId, {
      name: sanitizedName,
      content: sanitizedComments,
      rating,
    });

    // 2. Add rating to aggregate score
    let ratingData = null;
    try {
      ratingData = await addRating(articleId, sessionId, rating);
    } catch (ratingErr) {
      console.warn("[api/blog-reviews] Rating aggregation warning:", ratingErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Your review was received.",
      review: comment,
      ratings: ratingData,
    });
  } catch (error) {
    console.error("[api/blog-reviews] POST failed:", error);
    return NextResponse.json(
      { error: "We couldn't submit your review. Please try again." },
      { status: 500 }
    );
  }
}

