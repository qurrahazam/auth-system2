import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  await connectDB();

  const featured = await Post.find({ isPublished: true })
    .sort({ likes: -1 })
    .limit(3)
    .populate("author", "name email");

  return NextResponse.json(featured);
}
