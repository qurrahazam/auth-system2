"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedPost from "@/components/posts/FeaturedPost";
import PostGrid from "@/components/posts/PostGrid";
import Pagination from "@/components/Pagination";
import type { Post } from "@/types/Post";

interface PaginationData {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export default function HomePage() {
  const [paginationData, setPaginationData] = useState<PaginationData>({
    posts: [],
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasMore: false,
  });
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [postsRes, featuredRes] = await Promise.all([
          fetch(`/api/posts?page=${currentPage}&limit=${postsPerPage}`),
          fetch("/api/posts/featured"),
        ]);

        const postsData = await postsRes.json();
        const featuredData = await featuredRes.json();

        setPaginationData(postsData);
        setFeaturedPosts(featuredData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (featuredPosts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 === featuredPosts.length ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredPosts]);

  const currentFeatured = featuredPosts[currentIndex];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-gray-800 overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto"
      >
        {loading && currentPage === 1 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading posts...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="relative">
              <AnimatePresence mode="wait">
                {currentFeatured && (
                  <motion.div
                    key={currentFeatured._id}
                    initial={{ x: 150, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -150, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <FeaturedPost post={currentFeatured} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {featuredPosts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentIndex
                        ? "bg-emerald-600 scale-125"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <>
                <PostGrid posts={paginationData.posts} />
                <Pagination
                  currentPage={paginationData.currentPage}
                  totalPages={paginationData.totalPages}
                  totalItems={paginationData.totalPosts}
                  itemsPerPage={postsPerPage}
                  onPageChange={setCurrentPage}
                  itemName="posts"
                />
              </>
            )}
          </>
        )}
      </motion.section>
    </main>
  );
}

