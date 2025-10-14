"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      alert(data.error || "Failed to update post");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 py-10 px-4">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-lg border border-emerald-100"
      >
        <h1 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Edit Post
        </h1>
        <input
          type="text"
          className="border border-emerald-200 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-emerald-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="border border-emerald-200 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-emerald-400 outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button
          type="submit"
          className="bg-emerald-500 text-white w-full py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-all"
        >
          Update Post
        </button>
      </form>
    </main>
  );
}
