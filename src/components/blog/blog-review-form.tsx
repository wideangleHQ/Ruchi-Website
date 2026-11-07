"use client";

import { useState, useRef } from "react";
import { Star, Send, CheckCircle2, AlertCircle } from "lucide-react";

interface BlogReviewFormProps {
  articleId: string;
  onSuccess?: () => void;
  className?: string;
}

export function BlogReviewForm({ articleId, onSuccess, className = "" }: BlogReviewFormProps) {
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState("");
  const [name, setName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const currentArticleId = form.dataset.articleId || articleId;
    if (!currentArticleId) {
      setStatusMessage("This article isn't ready for reviews.");
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("Submitting…");
    setIsSuccess(false);

    try {
      const response = await fetch("/api/blog-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: currentArticleId,
          comments: comments.trim(),
          ratings: Number(rating),
          ...(name.trim() ? { name: name.trim() } : {}),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      setStatusMessage("Thank you. Your review was received.");
      setIsSuccess(true);
      setComments("");
      setRating("");
      setName("");
      form.reset();
      onSuccess?.();
    } catch {
      setStatusMessage("We couldn't submit your review. Please try again.");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      id="blog-review-form"
      data-article-id={articleId}
      onSubmit={handleSubmit}
      className={`card-ruchi p-5 sm:p-7 bg-white dark:bg-card border border-border rounded-[var(--radius-brand)] shadow-sm ${className}`}
    >
      <h3 className="font-serif text-xl font-bold text-text mb-1">Leave a Review</h3>
      <p className="text-xs text-muted-text mb-5">
        Share your thoughts or feedback about this article.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Name (Optional) */}
        <div>
          <label htmlFor="review-name" className="block text-xs font-semibold text-text mb-1.5 uppercase tracking-wider">
            Your Name <span className="text-muted-text font-normal normal-case">(optional)</span>
          </label>
          <input
            id="review-name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priyadarshini M."
            maxLength={100}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-text placeholder:text-muted-text/60 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
          />
        </div>

        {/* Rating Select */}
        <div>
          <label htmlFor="review-rating" className="block text-xs font-semibold text-text mb-1.5 uppercase tracking-wider">
            Rating <span className="text-brand-red">*</span>
          </label>
          <div className="relative">
            <select
              id="review-rating"
              name="ratings"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-text bg-white dark:bg-card focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all appearance-none cursor-pointer pr-10"
            >
              <option value="">Choose a rating</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-muted-text">
              <Star className="w-4 h-4 fill-accent-gold text-accent-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Review Comments */}
      <div className="mb-4">
        <label htmlFor="review-comments" className="block text-xs font-semibold text-text mb-1.5 uppercase tracking-wider">
          Your review <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="review-comments"
          name="comments"
          rows={5}
          maxLength={5000}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
          placeholder="What did you think of this article? Any tips or thoughts to share?"
          className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-text placeholder:text-muted-text/60 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green resize-y transition-all"
        ></textarea>
        <div className="flex justify-between items-center text-[11px] text-muted-text mt-1">
          <span>Keep reviews constructive and helpful</span>
          <span>{comments.length} / 5000</span>
        </div>
      </div>

      {/* Submit Button & Message */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
        >
          <Send className="w-4 h-4" />
          {isSubmitting ? "Submitting…" : "Submit review"}
        </button>

        <p
          id="review-message"
          role="status"
          aria-live="polite"
          className={`text-sm font-medium transition-all flex items-center gap-1.5 ${
            isSuccess
              ? "text-primary-green"
              : statusMessage && statusMessage !== "Submitting…"
              ? "text-brand-red"
              : "text-muted-text"
          }`}
        >
          {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0 text-primary-green" />}
          {!isSuccess && statusMessage && statusMessage !== "Submitting…" && (
            <AlertCircle className="w-4 h-4 shrink-0 text-brand-red" />
          )}
          {statusMessage}
        </p>
      </div>
    </form>
  );
}

