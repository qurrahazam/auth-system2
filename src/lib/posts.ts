// lib/posts.ts
import type { Post } from "@/types/Post";

interface PaginationData {
  posts: Post[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

// Helper function to get the base URL
function getBaseUrl() {
  // In production, use your actual domain
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // In development
  return 'http://localhost:3000';
}

export async function getFeaturedPosts(): Promise<Post[]> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/posts/featured`, {
      cache: 'no-store',
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      return [];
    }
    
    return res.json();
  } catch (error) {
    return [];
  }
}

export async function getPosts(page: number, limit: number): Promise<PaginationData> {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(
      `${baseUrl}/api/posts?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        next: { revalidate: 60 }
      }
    );
    
    if (!res.ok) {;
      return {
        posts: [],
        currentPage: page,
        totalPages: 0,
        totalPosts: 0,
        hasMore: false
      };
    }
    
    return res.json();
  } catch (error) {
    return {
      posts: [],
      currentPage: page,
      totalPages: 0,
      totalPosts: 0,
      hasMore: false
    };
  }
}