"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeaturedPost from "@/components/posts/FeaturedPost";
import PostGrid from "@/components/posts/PostGrid";
import type { Post } from "@/types/Post";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, featuredRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/posts/featured"),
        ]);

        const postsData = await postsRes.json();
        const featuredData = await featuredRes.json();

        setPosts(postsData);
        setFeaturedPosts(featuredData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
        className="relative z-10 mt-10 ml-10 mb-10 mr-10 mx-auto px-8"
      >
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="relative">
              <AnimatePresence mode="wait">
                {currentFeatured && (
                  <motion.div
                    key={currentFeatured._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
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
                      i === currentIndex ? "bg-emerald-600 scale-125" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <PostGrid
              posts={posts}
            />
          </>
        )}
      </motion.section>
    </main>
  );
}
