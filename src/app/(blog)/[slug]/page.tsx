import { notFound } from "next/navigation";
import { CalendarDays, User } from "lucide-react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Paragraph from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";

import LikeAndViewButtons from "@/components/posts/LikeAndViewButtons";
import ShareButtons from "@/components/posts/ShareButtons";
import RelatedPosts from "@/components/posts/RelatedPost";
import type { Post as PostType } from "@/types/Post";
import { getAbsoluteUrl } from "@/lib/utils";

// ✅ Revalidate every 5 minutes
export const revalidate = 300;

// ✅ Type definition for Next.js 15 page props
type PageProps = {
  params: Promise<{ slug: string }>;
};

// ✅ Fixed: params is now a Promise in Next.js 15
export default async function BlogPostPage({ params }: PageProps) {
  // ✅ Await the params
  const { slug } = await params;

  // ✅ Fetch from API (server-side)
  const apiUrl = getAbsoluteUrl(`/api/blog/${slug}`);
  const res = await fetch(apiUrl, {
    next: { revalidate: 300 }, // ISR caching
  });

  if (!res.ok) return notFound();

  const data = await res.json();
  const post: PostType = data.post;
  const relatedPosts: PostType[] = data.relatedPosts || [];

  const { title, content, coverImage, author, createdAt, views, likes, tags } = post;

  // ✅ Convert TipTap JSON -> HTML
  let html = "";
  try {
    if (typeof content === "object") {
      html = generateHTML(content, [
        StarterKit,
        Image,
        Link,
        Paragraph,
        Heading,
        Blockquote,
        ListItem,
        BulletList,
        OrderedList,
        Bold,
        Italic,
        Underline,
      ]);
    } else {
      html = `<p>${content}</p>`;
    }
  } catch (err) {
  
    html = `<p>Unable to render post content.</p>`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {coverImage && (
          <div className="w-full aspect-video mb-8 rounded-2xl overflow-hidden shadow-xl">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-2 font-medium">
              <User size={18} className="text-emerald-600" />
              {author || "Unknown"}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={18} className="text-emerald-600" />
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>

            <LikeAndViewButtons
              slug={slug}
              initialLikes={likes || 0}
              initialViews={views || 0}
            />
          </div>

          <ShareButtons title={title} slug={slug} />
        </div>

        <div
          className="prose prose-lg max-w-none text-gray-800 mb-12
                     prose-headings:text-gray-900 prose-headings:font-bold
                     prose-p:text-gray-700 prose-p:leading-relaxed
                     prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                     prose-img:rounded-xl prose-img:shadow-lg
                     prose-blockquote:border-l-4 prose-blockquote:border-emerald-500
                     prose-blockquote:bg-emerald-50 prose-blockquote:py-2 prose-blockquote:px-4
                     prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-gray-900 prose-pre:text-gray-100
                     prose-strong:text-gray-900
                     prose-ul:list-disc prose-ol:list-decimal"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 mb-12 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-gray-600 mb-6">Share it with your network!</p>
          <ShareButtons title={title} slug={slug} large />
        </div>

        {relatedPosts && relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
      </article>
    </div>
  );
}