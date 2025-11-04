import React from "react";
import { cookies } from "next/headers";
import AnalyticsDashboardClient from "./AnalysisDashboardClient";

interface Post {
  _id: string;
  title: string;
  views: number;
  likes: number;
  createdAt: string;
  category?: string;
}

async function getPosts(): Promise<{ posts: Post[] | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/analysis`, {
      headers: {
        Cookie: `token=${token}`, 
      },
    });

    if (!res.ok) {
      return { posts: null, error: "Failed to fetch posts" };
    }

    const data = await res.json();
    return { posts: Array.isArray(data) ? data : [], error: null };
  } catch (error) {
    return { posts: null, error: "Something went wrong while fetching posts." };
  }
}

export default async function AnalysisDashboard() {
  const { posts, error } = await getPosts();

  if (error) {
    return (
      <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center text-red-700">
        {error}
      </div>
    );
  }

  if (!posts || !posts.length) {
    return (
      <div className="p-8 rounded-2xl bg-white border text-center text-gray-600">
        You haven't posted anything yet.
      </div>
    );
  }

  return <AnalyticsDashboardClient posts={posts} />;
}