"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminShell } from "../../../layout";
import { ArrowLeft, Save, Eye, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = decodeURIComponent(params.id as string);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/articles?id=${encodeURIComponent(articleId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.article) {
          setTitle(data.article.title || "");
          setBody(data.article.body || "");
          setSummary(data.article.summary || "");
          setTags((data.article.tags || []).join(", "));
          setIsPublished(!!data.article.publishedAt);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [articleId]);

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          title: title.trim(),
          body: body.trim(),
          summary: summary.trim() || undefined,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          ...(publish !== undefined && { published: publish }),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return;

    try {
      await fetch("/api/admin/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId }),
      });
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to delete article");
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="max-w-3xl animate-pulse space-y-4">
          <div className="h-8 w-48 bg-soft-neutral rounded" />
          <div className="h-10 w-full bg-soft-neutral rounded" />
          <div className="h-40 w-full bg-soft-neutral rounded" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/blog" className="p-1.5 rounded-lg hover:bg-soft-green text-muted-text">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-serif text-2xl font-bold text-text">Edit Post</h1>
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-muted-text hover:text-brand-red transition-colors"
            title="Delete article"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Excerpt</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Content</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm font-mono focus:outline-none focus:border-primary-green/40 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40"
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {isPublished ? "Update" : "Publish"}
            </button>
            {isPublished && (
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] border border-border text-sm font-semibold text-text hover:bg-soft-neutral transition-colors disabled:opacity-50"
              >
                Unpublish
              </button>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] border border-border text-sm font-semibold text-text hover:bg-soft-neutral transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
