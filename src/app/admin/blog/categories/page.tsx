"use client";

import { useState, useEffect } from "react";
import { AdminShell } from "../../layout";
import { Plus } from "lucide-react";

export default function CategoriesPage() {
  const [blogs, setBlogs] = useState<{ id: string; handle: string; title: string }[]>([]);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const loadBlogs = () => {
    fetch("/api/admin/blogs")
      .then((r) => r.json())
      .then((data) => setBlogs(data.blogs || []))
      .catch(() => {});
  };

  useEffect(loadBlogs, []);

  const handleCreate = async () => {
    if (!newName.trim() || creating) return;
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newName.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create category");
        return;
      }

      setNewName("");
      loadBlogs();
    } catch {
      setError("Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-bold text-text mb-6">Categories</h1>

      <div className="card-ruchi p-5 mb-6">
        <p className="text-sm font-medium text-text mb-3">Create New Category</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Category name (e.g., Recipes)"
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:border-primary-green/40"
          />
          <button
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-brand)] bg-primary-green text-white text-sm font-semibold hover:bg-deep-green transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
        {error && <p className="text-sm text-brand-red mt-2">{error}</p>}
      </div>

      <div className="card-ruchi overflow-hidden">
        {blogs.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-text">No categories yet. Create one above to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-soft-neutral/50">
                <th className="text-left p-3 font-semibold text-text">Name</th>
                <th className="text-left p-3 font-semibold text-text">Handle</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-text">{blog.title}</td>
                  <td className="p-3 text-muted-text">{blog.handle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted-text mt-4">
        Categories are Shopify blogs. Each article belongs to one category. You can also manage categories from the Shopify admin panel.
      </p>
    </AdminShell>
  );
}
