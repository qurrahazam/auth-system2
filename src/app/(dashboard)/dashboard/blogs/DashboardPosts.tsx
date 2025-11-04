"use client";

// DashboardPosts.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import PostGrid from "@/components/posts/PostGrid";
import Pagination from "@/components/posts/Pagination";
import toast from "react-hot-toast";
import type { Post } from "@/types/Post";
import { useDeletePost } from "@/app/hooks/useDeletePost";

export default function DashboardPosts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts/user?page=${currentPage}&limit=${itemsPerPage}&status=${
          filter === "all" ? "" : filter
        }`
      );
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data.posts);
      setTotalPages(Math.ceil(data.totalPosts / itemsPerPage));
    } catch {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const { handleDeletePost, isDeleting } = useDeletePost(fetchPosts);

  const filteredPosts = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.status === filter);
  }, [posts, filter]);

  const handleFilterChange = (option: "all" | "published" | "draft") => {
    setFilter(option);
    router.push(`/dashboard/blogs?filter=${option}&page=1`);
  };

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50 min-h-[calc(100vh-4rem)] transition-all">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Your Posts
        </h2>
        <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-sm p-1">
          {["all", "published", "draft"].map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange(option as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === option
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105"
                  : "text-gray-600 hover:text-emerald-600 hover:bg-emerald-50"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500">
          <div className="text-5xl mb-3">📝</div>
          No {filter === "all" ? "" : filter} posts found.
        </div>
      ) : (
        <>
          <PostGrid
            posts={filteredPosts}
            showActions={true}
            onEdit={(postId) => router.push(`/dashboard/edit/${postId}`)}
            onDelete={(postId) => handleDeletePost(postId)}
          />
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/dashboard/blogs"
            />
          </div>
        </>
      )}
    </section>
  );
}
