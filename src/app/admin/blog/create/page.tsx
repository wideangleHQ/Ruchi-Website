"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../layout";
import { ArrowLeft, Save, Eye } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<{ id: string; handle: string; title: string }[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [summary, setSummary] = useState("");
  const [blogId, setBlogId] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/blogs")
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data.blogs || []);
        if (data.blogs?.length > 0) setBlogId(data.blogs[0].id);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (asDraft = true) => {
    if (!title.trim() || !blogId) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          summary: summary.trim() || undefined,
          blogId,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          published: !asDraft,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create article");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Failed to create article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell>
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/blog" className="p-1.5 rounded-lg hover:bg-soft-green text-muted-text">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-text">Create Post</h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Category *</label>
            <select
              value={blogId}
              onChange={(e) => setBlogId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm bg-white focus:outline-none focus:border-primary-green/40"
            >
              {blogs.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
            {blogs.length === 0 && (
              <p className="text-xs text-muted-text mt-1">
                No categories found. <Link href="/admin/blog/categories" className="text-primary-green hover:underline">Create one first.</Link>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Excerpt</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short summary of the article"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Content *</label>
            <p className="text-xs text-muted-text mb-2">HTML content supported. For rich editing, use the Shopify admin panel.</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Article content (HTML supported)"
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
              placeholder="Comma-separated tags (e.g., Turmeric, Recipes, Cooking Tips)"
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40"
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving || !title.trim() || !blogId}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors disabled:opacity-50"
            >
              <Eye className="w-4 h-4" />
              {saving ? "Publishing…" : "Publish"}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving || !title.trim() || !blogId}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-[var(--radius-brand)] border border-border text-sm font-semibold text-text hover:bg-soft-neutral transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
