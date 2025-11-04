import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query"); 

  if (!query) {
    return NextResponse.json({ posts: [] });
  }

  await connectDB();

  const posts = await Post.find({
    status: "published",
    $or: [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ],
     
  })
    .select("title slug category coverImage") 
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const plainPosts = JSON.parse(JSON.stringify(posts));

  return NextResponse.json({ posts: plainPosts });
}
