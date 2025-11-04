import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await connectDB();

  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return errorResponse({
      error: "Unauthorized",
      status: HTTP_STATUS.UNAUTHORIZED,
      message: "Unauthorized",
    });
  }

  try {
    const decoded: any = verifyToken(token);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "6");
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ author: decoded.email });

    const posts = await Post.find({ author: decoded.email })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title slug excerpt coverImage createdAt views likes readTime status");

    return NextResponse.json({
      posts,
      currentPage: page,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (err) {
    return errorResponse({
      error: "Failed to fetch user posts",
      message: "Failed",
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}
