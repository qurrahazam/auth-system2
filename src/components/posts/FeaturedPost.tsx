"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/Post";

interface FeaturedPostsProps {
  featuredPosts: Post[];
}

export default function FeaturedPosts({ featuredPosts }: FeaturedPostsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (featuredPosts.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [featuredPosts]);

  if (!featuredPosts || featuredPosts.length === 0) return null;

  const currentPost = featuredPosts[currentIndex];

  return (
    <div className="relative w-full overflow-hidden mb-20">
      <AnimatePresence mode="wait">
        {currentPost && (
          <motion.div
            key={currentPost._id}
            initial={{ x: 150, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -150, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {currentPost.coverImage && (
              <img
                src={currentPost.coverImage}
                alt={currentPost.title}
                className="w-full h-[400px] md:h-[500px] lg:h-[650px] object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            <div className="absolute bottom-0 p-8 md:p-12 text-white max-w-2xl">
              <span className="px-3 py-1 text-sm bg-emerald-600/80 rounded-full">
                Featured
              </span>

              <h3 className="text-4xl md:text-5xl font-bold mt-4">
                {currentPost.title}
              </h3>

              <p className="text-gray-200 mt-3 line-clamp-3">
                {currentPost.excerpt || currentPost.content.slice(0, 140) + "..."}
              </p>

              <div className="flex items-center justify-between mt-5 text-sm text-gray-300">
                <span>{currentPost.author || "Unknown Author"}</span>
                {currentPost.readTime && (
                  <span>⏱ {currentPost.readTime} min read</span>
                )}
              </div>

              <Button
                asChild
                variant="secondary"
                className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Link href={`/${currentPost.slug}`}>Read More</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {featuredPosts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {featuredPosts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-emerald-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
