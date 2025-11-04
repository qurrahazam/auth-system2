import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import type { Post as PostType } from "@/types/Post";

// ✅ Fixed: params is now a Promise in Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // ✅ Await the params
    const { slug } = await params;
    await connectDB();

    const post = (await Post.findOne({ slug })
      .populate("author", "name")
      .lean()) as PostType | null;

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }
    
    let relatedPosts: PostType[] = [];
    try {
      if (post.tags && post.tags.length > 0) {
        const posts = await Post.find({
          _id: { $ne: post._id },
          status: "published",
          tags: { $in: post.tags },
        })
          .limit(3)
          .select("title slug coverImage excerpt readTime author createdAt")
          .populate("author", "name")
          .lean();
        relatedPosts = JSON.parse(JSON.stringify(posts));
      } else if (post.category) {
        const posts = await Post.find({
          _id: { $ne: post._id },
          status: "published",
          category: post.category,
        })
          .limit(3)
          .select("title slug coverImage excerpt readTime author createdAt")
          .populate("author", "name")
          .lean();
        relatedPosts = JSON.parse(JSON.stringify(posts));
      }

      if (relatedPosts.length === 0) {
        const posts = await Post.find({
          _id: { $ne: post._id },
          status: "published",
        })
          .sort({ createdAt: -1 })
          .limit(3)
          .select("title slug coverImage excerpt readTime author createdAt")
          .populate("author", "name")
          .lean();
        relatedPosts = JSON.parse(JSON.stringify(posts));
      }
    } catch (err) {
    }

    return NextResponse.json({
      post: post,
      relatedPosts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}