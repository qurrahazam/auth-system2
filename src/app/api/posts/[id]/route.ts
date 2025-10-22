import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/jwt";
import * as cookie from "cookie";
import { errorResponse, successResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";
import { writeFile, unlink } from "fs/promises";
import path from "path";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("token=")[1]?.split(";")[0];
  
  if (!token) return errorResponse({
    error: "Unauthorized",
    message: "User not Authorized to do this action",
    status: HTTP_STATUS.UNAUTHORIZED,
  });

  try {
    const decoded_token = verifyToken(token);
    if (!decoded_token || !decoded_token.id) {
      return errorResponse({
        error: "Expired or Invalid token",
        message: "Invalid or expired token",
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    const { id } = await context.params;
    const post = await Post.findById(id);
    
    if (!post) return errorResponse({
      error: "Post not found",
      message: "Post not found",
      status: HTTP_STATUS.NOT_FOUND,
    });

    if (post.author.toString() !== decoded_token.id)
      return errorResponse({
        error: "Not Allowed",
        message: "Not allowed",
        status: HTTP_STATUS.FORBIDDEN,
      });

    // Parse FormData
    const formData = await req.formData();
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const status = formData.get("status") as string;
    const coverImage = formData.get("coverImage") as File | null;

    // Update fields
    if (title) post.title = title;
    if (slug) post.slug = slug;
    if (content) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category) post.category = category;
    if (tags !== undefined) post.tags = tags;
    if (status) post.status = status;

    // Handle cover image upload
    if (coverImage && coverImage.size > 0) {
      // Delete old image if exists
      if (post.coverImage) {
        try {
          const oldImagePath = path.join(process.cwd(), "public", post.coverImage);
          await unlink(oldImagePath);
        } catch (err) {
          console.log("Old image not found or couldn't be deleted");
        }
      }

      // Save new image
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${coverImage.name.replace(/\s+/g, "-")}`;
      const filepath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filepath, buffer);
      post.coverImage = `/uploads/${filename}`;
    }

    await post.save();
    
    return successResponse({
      message: "Post updated successfully",
      data: post,
      status: HTTP_STATUS.OK,
    });
    
  } catch (err) {
    console.error("Error updating post:", err);
    return errorResponse({
      message: "Server Error",
      error: "Server Error",
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { params } = context; 
  try {
    const resolvedParams = await params;
    const post = await Post.findById(resolvedParams.id).populate("author", "email name");
    
    if (!post) {
      return errorResponse({ 
        error: "Post not found",
        status: HTTP_STATUS.NOT_FOUND, 
        message: "Not Found" 
      });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return errorResponse({ 
      error: "Failed to fetch post",
      message: "Failed",
      status: HTTP_STATUS.SERVER_ERROR 
    });
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    await connectDB();

    const cookieHeader = req.headers.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];
    if (!token) return errorResponse({error: 'Unauthorized', message: 'Unauthorized', status: HTTP_STATUS.UNAUTHORIZED, });
    
    const user = verifyToken(token);
    if (!user) return errorResponse({ error: 'invalid token', message: 'Invalid Token', status:HTTP_STATUS.UNAUTHORIZED, });

    const deleted = await Post.findOneAndDelete({ _id: id, author: user.email });
    if (!deleted)
      return errorResponse ({ message: "Post not found or not authorized", error: "Post not found", status: HTTP_STATUS.FORBIDDEN, });

    return successResponse({ message: "Post deleted successfully", data: "", status: HTTP_STATUS.OK,});
  } catch (err) {
    return errorResponse({ error: "Server Error", message: "Error deleting post", status: HTTP_STATUS.SERVER_ERROR });
  }
}

