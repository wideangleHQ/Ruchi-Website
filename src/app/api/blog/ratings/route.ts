import { NextRequest, NextResponse } from "next/server";
import { getRatings, addRating } from "@/lib/shopify/admin-blog";

export async function GET(request: NextRequest) {
  const articleId = request.nextUrl.searchParams.get("articleId");
  if (!articleId) return NextResponse.json({ error: "Missing articleId" }, { status: 400 });

  const data = await getRatings(articleId);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, sessionId, score } = body;

    if (!articleId || !sessionId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const data = await addRating(articleId, sessionId, score);
    return NextResponse.json(data);
  } catch (error) {
    console.error("[api/blog/ratings] POST failed:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}
