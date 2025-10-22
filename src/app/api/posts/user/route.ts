import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt"; // your token decoder
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { errorResponse, successResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function GET(req: Request) {
  await connectDB();

  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];

  if (!token) {
    return errorResponse({ error: "Unauthorized", status: HTTP_STATUS.UNAUTHORIZED, message: 'Unauthorized', });
  }

  try {
    const decoded: any = verifyToken(token);

    const posts = await Post.find({ author: decoded.email })
      .sort({ createdAt: -1 })
      .select("title slug excerpt coverImage createdAt views likes readTime status"); 

    return NextResponse.json(posts);
  } catch (err) {
    return errorResponse({ error: "Failed to fetch user posts" ,message: 'Failed' , status: HTTP_STATUS.SERVER_ERROR });
  }
}
