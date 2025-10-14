"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, content, author: "You" }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Post created successfully!");
        router.push("/dashboard"); 
      } else {
        setMessage(data.error || "Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-emerald-50 to-emerald-100 py-10 px-4">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-emerald-100">
        <h1 className="text-3xl font-extrabold text-emerald-700 mb-6 text-center">
          ✏️ Create a New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-emerald-700 font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "")
                );
              }}
              required
              placeholder="Enter post title"
              className="w-full border border-emerald-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-emerald-700 font-medium mb-1">
              Slug (auto-generated)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="my-new-post"
              className="w-full border border-emerald-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-emerald-700 font-medium mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              placeholder="Write your post content here..."
              className="w-full border border-emerald-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-md transition-all duration-300 ease-in-out disabled:opacity-60"
          >
            {loading ? "Creating..." : "Publish Post"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-emerald-700 mt-4">{message}</p>
        )}
      </div>
    </main>
  );
}
