import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/jwt";
import * as cookie from "cookie";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const cookies = req.headers.get("cookie");
  const token = cookies ? cookie.parse(cookies).token : null;
  
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded_token = verifyToken(token);
    if (!decoded_token || !decoded_token.id) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const body = await req.json();

    const post = await Post.findById(params.id);
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (post.author.toString() !== decoded_token.id)
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    post.title = body.title;
    post.slug = body.title.toLowerCase().replace(/\s+/g, "-");
    post.content = body.content;

    await post.save();
    return NextResponse.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cookies = req.headers.get("cookie");
    const token = cookies ? cookie.parse(cookies).token : null;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const decoded_token = verifyToken(token);
    if (!decoded_token || !decoded_token.id) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const post = await Post.findById(params.id);

    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.author.toString() !== decoded_token.id)
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });

    await post.deleteOne();
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { params } = await context; // 👈 await the context before using
  try {
    const post = await Post.findById((await params).id).populate("author", "email name");
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
