import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  await connectDB();
  await Post.deleteMany();
  await Post.insertMany([
  {
    "title": "Mastering Next.js Middleware for Smarter Routing",
    "slug": "mastering-nextjs-middleware",
    "excerpt": "Learn how to use Next.js middleware to intercept requests, handle authentication, and build scalable routing logic efficiently.",
    "content": "Next.js middleware allows you to intercept and modify requests before they hit your routes or APIs. This is powerful for authentication, A/B testing, redirects, and more. In this guide, we’ll dive deep into middleware patterns, performance considerations, and best practices for production-ready apps.",
    "coverImage": "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Next.js", "Middleware", "Web Development"],
    "category": "Web Development",
    "author": "6718a3c04a48c2b37e8d50a1",
    "isPublished": true,
    "readTime": 5,
    "views": 132,
    "likes": 14,
    "createdAt": "2025-09-18T10:00:00Z",
    "updatedAt": "2025-09-18T10:00:00Z"
  },
  {
    "title": "10 UI Design Principles Every Developer Should Know",
    "slug": "ui-design-principles-for-developers",
    "excerpt": "Design is not just about looks — it's about usability. Here are 10 essential design principles to help developers create beautiful and functional interfaces.",
    "content": "Good UI design can make or break your application. Developers often underestimate the power of layout, contrast, and typography. In this post, we’ll discuss color theory, visual hierarchy, alignment, and consistency — the secret ingredients that turn code into experience.",
    "coverImage": "https://images.unsplash.com/photo-1603575448366-6be6310e9a51?auto=format&fit=crop&w=1200&q=80",
    "tags": ["UI Design", "Frontend", "Best Practices"],
    "category": "Design",
    "author": "6718a3c04a48c2b37e8d50a1",
    "isPublished": true,
    "readTime": 4,
    "views": 298,
    "likes": 22,
    "createdAt": "2025-09-22T12:30:00Z",
    "updatedAt": "2025-09-22T12:30:00Z"
  },
  {
    "title": "Building Secure Authentication with JWT and Next.js",
    "slug": "nextjs-jwt-authentication",
    "excerpt": "Secure your Next.js applications with JSON Web Tokens (JWT). Learn how to handle login, logout, and token verification safely.",
    "content": "Authentication is a core part of any app. In this guide, we’ll implement JWT-based authentication with Next.js and NextAuth. You’ll learn how to generate tokens, store them securely using cookies, and protect both API routes and client-side pages using middleware.",
    "coverImage": "https://images.unsplash.com/photo-1633356122061-1e7d3d1e3a1a?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Authentication", "Next.js", "Security"],
    "category": "Security",
    "author": "6718a3c04a48c2b37e8d50a1",
    "isPublished": true,
    "readTime": 6,
    "views": 410,
    "likes": 35,
    "createdAt": "2025-09-25T14:00:00Z",
    "updatedAt": "2025-09-25T14:00:00Z"
  },
  {
    "title": "Optimizing Your Next.js App for SEO in 2025",
    "slug": "nextjs-seo-optimization-2025",
    "excerpt": "SEO is evolving fast. Learn how to optimize your Next.js site for search engines using metadata, dynamic sitemaps, and structured data.",
    "content": "Search engine optimization (SEO) is essential for visibility. Next.js 14+ provides tools like the `metadata` API and dynamic routes to make SEO effortless. We’ll explore how to set up meta tags, Open Graph data, sitemaps, and schema.org markup to improve your search ranking.",
    "coverImage": "https://images.unsplash.com/photo-1522202195461-1b1f3b8d1c33?auto=format&fit=crop&w=1200&q=80",
    "tags": ["Next.js", "SEO", "Performance"],
    "category": "Web Development",
    "author": "6718a3c04a48c2b37e8d50a1",
    "isPublished": true,
    "readTime": 7,
    "views": 523,
    "likes": 47,
    "createdAt": "2025-09-30T08:45:00Z",
    "updatedAt": "2025-09-30T08:45:00Z"
  },
  {
    "title": "Why TypeScript Makes You a Better JavaScript Developer",
    "slug": "typescript-for-javascript-developers",
    "excerpt": "TypeScript is more than types — it’s a mindset. Here’s how adopting TypeScript improves your productivity and confidence as a developer.",
    "content": "TypeScript adds static typing to JavaScript, helping you catch errors early and improve maintainability. In this post, we’ll explore type safety, interfaces, generics, and how TypeScript integrates seamlessly with React and Next.js.",
    "coverImage": "https://images.unsplash.com/photo-1590608897129-79da98d159f1?auto=format&fit=crop&w=1200&q=80",
    "tags": ["TypeScript", "JavaScript", "Productivity"],
    "category": "Programming",
    "author": "6718a3c04a48c2b37e8d50a1",
    "isPublished": true,
    "readTime": 5,
    "views": 198,
    "likes": 19,
    "createdAt": "2025-10-05T16:15:00Z",
    "updatedAt": "2025-10-05T16:15:00Z"
  }
]
);
  return NextResponse.json({ message: "Database seeded" });
}
