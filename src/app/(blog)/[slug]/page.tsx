import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import ReactMarkdown from "react-markdown";
import { Eye, Heart, CalendarDays, User } from "lucide-react";
import type { Post as PostType } from "@/types/Post";
import LikeAndViewButtons from "@/components/LikeAndViewButtons";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();

  const post = (await Post.findOne({ slug })
    .populate("author", "name")
    .lean()) as PostType | null;

  if (!post) {
    return (
      <h1 className="text-center mt-10 text-red-500 text-xl font-semibold">
        Post not found
      </h1>
    );
  }

  const { title, content, coverImage, author, createdAt, views, likes } = post;

  return (
    <article className="max-w-3xl mx-auto p-6">
      {/* Cover Image */}
      {coverImage && (
        <div className="w-full h-64 md:h-96 mb-6">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover rounded-2xl shadow-md"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-3 text-gray-900">{title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8">
        <span className="flex items-center gap-1">
          <User size={16} /> {author?.name || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays size={16} />{" "}
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      <LikeAndViewButtons
        slug={slug}
        initialLikes={likes || 0}
        initialViews={views || 0}
      />
      <div className="prose prose-lg max-w-none text-gray-800 mt-8 prose-img:rounded-xl">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
