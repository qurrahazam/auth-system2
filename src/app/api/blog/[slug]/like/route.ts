import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  await connectDB();

  try {
    await Post.findOneAndUpdate({ slug }, { $inc: { likes: 1 } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
