import Link from "next/link";
import { Clock, User } from "lucide-react";
import type { Post } from "@/types/Post";

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts?.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/${post.slug}`}
            className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            {post.coverImage && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} />
                  {post.author || "Unknown"}
                </span>
                {post.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {post.readTime}m
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
