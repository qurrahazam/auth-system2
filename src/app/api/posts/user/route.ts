import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt"; // your token decoder
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET(req: Request) {
  await connectDB();

  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded: any = verifyToken(token);

    const posts = await Post.find({ author: decoded.email })
      .sort({ createdAt: -1 })
      .select("title slug excerpt coverImage createdAt views likes readTime"); 

    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch user posts" }, { status: 500 });
  }
}
