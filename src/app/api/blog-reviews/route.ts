import { NextRequest, NextResponse } from "next/server";
import { getApprovedComments, addComment, addRating, getRatings } from "@/lib/shopify/admin-blog";
import { checkRateLimit, getClientIp } from "@/lib/server/rate-limit";
import { sanitizeInput } from "@/lib/shopify/contact-submissions";
import {
  ShopifyConfigError,
  ShopifyAuthError,
  ShopifyPermissionError,
  ShopifyRateLimitError,
} from "@/lib/shopify/admin-client";

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
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, 30);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait a few minutes before trying again." },
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

    const sanitizedComments = sanitizeInput(comments);
    const sanitizedName = sanitizeInput(authorName.slice(0, 100));

    // 1. Add comment to review queue in Shopify Metaobject
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

    return NextResponse.json(
      {
        success: true,
        message: "Thank you. Your review was received.",
        review: comment,
        ratings: ratingData,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (error) {
    console.error("[api/blog-reviews] POST failed:", error);

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
      { error: "We couldn't submit your review. Please try again." },
      { status: 500 }
    );
  }
}
