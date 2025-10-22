"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Post } from "@/types/Post";
import { useState } from "react";

function timeAgo(date: string | Date) {
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

interface PostGridProps {
  posts: Post[];
  renderActions?: (post: Post) => React.ReactNode; 
}

export default function PostGrid({ posts, renderActions }: PostGridProps) {
  const [openPostId, setOpenPostId] = useState<string | null>(null); 

  if (!posts || posts.length === 0)
    return <p className="text-center text-gray-500">No posts yet.</p>;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 ml-9 mr-9">
      {posts.map((post) => (
        <motion.div
          key={post._id}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative"
        >
          <Link href={`/${post.slug}`} className="block h-full">
            <Card className="flex flex-col h-full overflow-hidden bg-white/80 backdrop-blur-md border-emerald-100 hover:shadow-lg transition-all cursor-pointer group">
              {post.coverImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1">
                <CardHeader className="flex-1 p-4">
                  <CardTitle className="text-lg text-emerald-800 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-2">
                    {post.excerpt || post.content.slice(0, 120) + "..."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="mt-auto flex justify-between items-center text-sm text-gray-500 px-4 pb-4">
                  <span>{post.author?.name || "Unknown"}</span>
                  <div className="flex gap-4">
                    {post.createdAt && <span>{timeAgo(post.createdAt)}</span>}
                    {post.readTime && <span>⏱ {post.readTime} min</span>}
                  </div>
                </CardContent>
              </div>
            </Card>

          </Link>

          {renderActions && (
            <div className="absolute top-2 right-2">
              {renderActions(post)}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
