import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function GET(req: Request) {
  await connectDB();

  // ✅ Add await here!
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return errorResponse({ 
      error: "Unauthorized", 
      status: HTTP_STATUS.UNAUTHORIZED, 
      message: 'No token found in cookies', 
    });
  }

  try {
    const decoded: any = verifyToken(token);

    const posts = await Post.find({ author: decoded.email })
      .sort({ createdAt: -1 })
      .select("title slug excerpt coverImage createdAt views likes readTime status"); 

    return NextResponse.json(posts);
  } catch (err) {
    return errorResponse({ 
      error: "Failed to fetch user posts",
      message: err instanceof Error ? err.message : 'Failed',
      status: HTTP_STATUS.SERVER_ERROR 
    });
  }
}