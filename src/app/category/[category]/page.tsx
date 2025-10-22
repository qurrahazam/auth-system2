import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import PostGrid from "@/components/posts/PostGrid";
import type { Post as PostType } from "@/types/Post";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  await connectDB();

  const posts = await Post.find({ category: category })
    .sort({ createdAt: -1 })
    .lean<PostType[]>();

  const plainPosts = JSON.parse(JSON.stringify(posts));

  return (
    <section className="px-8 py-10">
      <h1 className="text-3xl font-bold capitalize mb-6 text-gray-800">
        {category} Posts
      </h1>

      {plainPosts.length > 0 ? (
        <PostGrid posts={plainPosts} />
      ) : (
        <p className="text-gray-500">No posts found in this category.</p>
      )}
    </section>
  );
}
