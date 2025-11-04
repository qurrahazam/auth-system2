import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import PostGrid from "@/components/posts/PostGrid";
import type { Post as PostType } from "@/types/Post";
import { notFound } from "next/navigation";

export const revalidate = 3600; 
export const dynamic = 'force-static'; 
export const dynamicParams = true; 

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const categories = await Post.distinct("category");
    
    return categories.map((category) => ({
      category: category.toLowerCase(),
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  
  return {
    title: `${decodedCategory} Posts | Insightly`,
    description: `Browse all ${decodedCategory} posts on Insightly`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  try {
    
    await connectDB();

    const posts = await Post.find({ 
      category: { $regex: new RegExp(`^${decodedCategory}$`, 'i') }
    })
      .sort({ createdAt: -1 })
      .lean<PostType[]>();

    if (posts.length === 0) {
      const validCategories = await Post.distinct("category");
      const categoryExists = validCategories.some(
        cat => cat.toLowerCase() === decodedCategory.toLowerCase()
      );
      
      if (!categoryExists) {
        notFound();
      }
    }

    const plainPosts = JSON.parse(JSON.stringify(posts));

    return (
      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold capitalize mb-6 text-gray-800">
          {decodedCategory} Posts
        </h1>

        {plainPosts.length > 0 ? (
          <PostGrid posts={plainPosts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No posts found in this category yet.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Check back soon for new content!
            </p>
          </div>
        )}
      </section>
    );
  } catch (error) {
    
    return (
      <section className="px-8 py-10">
        <h1 className="text-3xl font-bold capitalize mb-6 text-gray-800">
          {decodedCategory} Posts
        </h1>
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load posts. Please try again later.</p>
        </div>
      </section>
    );
  }
}