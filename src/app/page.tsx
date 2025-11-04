
import FeaturedPosts from "@/components/posts/FeaturedPost";
import PostGrid from "@/components/posts/PostGrid";
import Pagination from "@/components/posts/Pagination";
import type { Post } from "@/types/Post";

async function getFeaturedPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/featured`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch featured posts");
  return res.json();
}

async function getPosts(page: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?page=${page}&limit=6`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [featuredPosts, postsData] = await Promise.all([
    getFeaturedPosts(),
    getPosts(page),
  ]);

  const { posts, totalPages } = postsData;

  return (
    <>

      <FeaturedPosts featuredPosts={featuredPosts} />
      <PostGrid posts={posts} />
      <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
    </>
  );
}
