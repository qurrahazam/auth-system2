"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Post } from "@/types/Post";

interface FeaturedPostProps {
  post: Post;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
  if (!post) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden mb-20">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-[400px] md:h-[500px] lg:h-[650px] object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
      <div className="absolute bottom-0 p-8 md:p-12 text-white max-w-2xl">
        <span className="px-3 py-1 text-sm bg-emerald-600/80 rounded-full">
          Featured
        </span>

        <h3 className="text-4xl md:text-5xl font-bold mt-4">{post.title}</h3>
        <p className="text-gray-200 mt-3 line-clamp-3">
          {post.excerpt || post.content.slice(0, 140) + "..."}
        </p>

        <div className="flex items-center justify-between mt-5 text-sm text-gray-300">
          <span>{post.author?.name || "Unknown Author"}</span>
          {post.readTime && <span>⏱ {post.readTime} min read</span>}
        </div>

        <Button
          asChild
          variant="secondary"
          className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Link href={`/${post.slug}`}>Read More</Link>
        </Button>
      </div>
    </div>
  );
}
