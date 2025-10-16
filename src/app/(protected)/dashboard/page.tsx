"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PostGrid from "@/components/posts/PostGrid";


export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts/user");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) router.push("/login");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((p) => p._id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "Failed to delete post");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-emerald-50 to-emerald-100 py-10 px-4">
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-emerald-100 text-center mb-10">
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-3">
          Welcome to Your Dashboard 🌿
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your posts and account settings with ease.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleLogout}
            className="bg-emerald-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-600 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Logout
          </button>

          <button
            onClick={handleChangePassword}
            className="bg-white text-emerald-600 border border-emerald-400 py-3 px-6 rounded-xl font-semibold hover:bg-emerald-50 hover:shadow-md transition-all duration-300 ease-in-out"
          >
            Change Password
          </button>

          <Link
            href="/dashboard/new-post"
            className="bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-emerald-600 hover:to-green-700 hover:shadow-md transition-all duration-300 ease-in-out"
          >
            + New Post
          </Link>
        </div>
      </div>

      <section className="w-full mt-10 px-6">

        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">
          Your Posts
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Fetching your posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">
            You haven’t written any posts yet.{" "}
            <Link href="/dashboard/new-post" className="text-emerald-600 font-semibold">
              Create one now.
            </Link>
          </div>
        ) : (
          <PostGrid posts={posts} />
        )}
      </section>

    </main>
  );
}
