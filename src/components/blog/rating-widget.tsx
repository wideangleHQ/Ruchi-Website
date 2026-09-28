"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

export function RatingWidget({ articleId }: { articleId: string }) {
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/ratings?articleId=${encodeURIComponent(articleId)}`)
      .then((r) => r.json())
      .then((data) => {
        setAverage(data.average || 0);
        setCount(data.count || 0);
      })
      .catch(() => {});

    try {
      const stored = localStorage.getItem(`blog_rating_${articleId}`);
      if (stored) setUserRating(parseInt(stored));
    } catch { /* noop */ }
  }, [articleId]);

  const submitRating = async (score: number) => {
    if (submitting) return;
    setSubmitting(true);
    setUserRating(score);

    try {
      localStorage.setItem(`blog_rating_${articleId}`, String(score));
    } catch { /* noop */ }

    let sessionId: string;
    try {
      sessionId = localStorage.getItem("blog_session_id") || crypto.randomUUID();
      localStorage.setItem("blog_session_id", sessionId);
    } catch {
      sessionId = crypto.randomUUID();
    }

    try {
      const res = await fetch("/api/blog/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, sessionId, score }),
      });
      if (res.ok) {
        const data = await res.json();
        setAverage(data.average);
        setCount(data.count);
        setSubmitted(true);
      }
    } catch { /* noop */ } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-sm font-medium text-text">
        {userRating ? "Thanks for rating!" : "How useful was this article?"}
      </p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (hoveredStar || userRating);
          return (
            <button
              key={star}
              onMouseEnter={() => !userRating && setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => submitRating(star)}
              disabled={submitted}
              className="p-0.5 transition-transform hover:scale-110 disabled:cursor-default"
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  filled ? "fill-accent-gold text-accent-gold" : "text-border"
                }`}
              />
            </button>
          );
        })}
      </div>
      {count > 0 && (
        <p className="text-xs text-muted-text">
          {average.toFixed(1)} / 5 · Based on {count} {count === 1 ? "rating" : "ratings"}
        </p>
      )}
    </div>
  );
}
