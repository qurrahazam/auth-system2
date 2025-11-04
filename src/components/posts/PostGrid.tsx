import type { Post } from "@/types/Post";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

function truncateToWords(text: string, wordLimit: number) {
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
}

interface PostGridProps {
  posts: Post[];
  showActions?: boolean;
  onEdit?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostGrid({ posts, showActions = false, onEdit, onDelete }: PostGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-9">
      {posts.map((post) => (
        <div key={post._id} className="relative h-full group">
          <Link href={`/${post.slug}`} className="block h-full">
            <Card className="flex flex-col h-full overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm group-hover:bg-white">
              {post.coverImage && (
                <div className="relative h-52 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              <div className="flex flex-col flex-1 p-5">
                <CardHeader className="flex-1 p-0 mb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors leading-tight">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {truncateToWords(post.excerpt || post.content, 13)}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0 mt-auto pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-medium">{post.author || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {post.createdAt && (
                        <span className="flex items-center gap-1">
                          {timeAgo(post.createdAt)}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime}m
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Card>
          </Link>

          {showActions && (
            <div className="absolute top-3 right-3 flex gap-2 z-20">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit?.(post._id);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 bg-red-500/90 hover:bg-red-600 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete?.(post._id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}