"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-gray-800 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]"></div>
      <div className="relative z-10 text-center max-w-md p-10 rounded-3xl backdrop-blur-md bg-white/60 shadow-xl border border-emerald-100 mt-20">
        <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">
          Welcome to the Home Page
        </h1>
        <p className="text-gray-600 mb-8">
          Explore your dashboard, manage your profile, and enjoy a refreshing experience.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-md"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 transition-all duration-300 font-semibold text-emerald-700 shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Blog Posts Section */}
      <section className="relative z-10 mt-16 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
          Latest Posts
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-md border border-emerald-100 hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-emerald-800 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 line-clamp-3 mb-4">{post.content}</p>
                <Link
                  href={`/${post.slug}`}
                  className="text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Read more →
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="absolute bottom-6 text-sm text-emerald-700/70">
        © {new Date().getFullYear()} Your App. All rights reserved.
      </footer>
    </main>
  );
}
