"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PostGrid from "@/components/posts/PostGrid";
import PostActionsMenu from "@/components/posts/PostActionMenu";
import Sidebar from "@/components/dashboard/SideBar";
import AnalysisDashboard from "@/components/dashboard/AnalysisDashboard";
import type { Post } from "@/types/Post";

export default function AuthorDashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("published");
  const [openPostId, setOpenPostId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts/user");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".post-actions")) setOpenPostId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) router.push("/login");
  };

  const filteredPosts =
    activeTab === "all" ? posts : posts.filter((p) => p.status === activeTab);

  const handleDelete = async (postId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((p) => p._id !== postId));

      alert("Post deleted successfully!");
    } catch (error) {
      alert("Error deleting post.");
    }
  };

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-emerald-100">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <section className="flex-1 p-6 md:p-10">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6 capitalize">
          {activeTab.replace(/-/g, " ")}
        </h2>

        {activeTab === "analysis" ? (
          <AnalysisDashboard/>
        ) : loading ? (
          <div className="text-center text-gray-500">Fetching your posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500">
            <div className="text-5xl mb-3">📝</div>
            No posts found under <b>{activeTab.replace(/-/g, " ")}</b>.
          </div>
        ) : (
          <PostGrid
            posts={filteredPosts}
            renderActions={(post) =>
              post.status === "draft" && (
                <div className="relative inline-block text-left post-actions">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenPostId(openPostId === post._id ? null : post._id);
                    }}
                  >
                    ⋮
                  </button>

                  <AnimatePresence>
                    {openPostId === post._id && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10"
                      >
                        <PostActionsMenu
                          postId={post._id}
                          onEdit={() =>
                            router.push(`/dashboard/edit/${post._id}`)
                          }
                          onDelete={() => {
                            console.log("Deleting:", post._id);
                            handleDelete(post._id);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }
          />
        )}
      </section>
    </main>
  );
}
