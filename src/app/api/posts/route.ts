import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  await connectDB();

  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const body = await req.json();

    const newPost = await Post.create({
      title: body.title,
      slug: body.title.toLowerCase().replace(/\s+/g, "-"),
      content: body.content,
      author: decoded.email, 
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
