import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { verifyToken } from "@/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


export async function GET() { 
  await connectDB(); 
  const posts = await Post.find().sort({ createdAt: -1 }); 
  return NextResponse.json(posts); 
}

function calculateReadTime(content: string) {
  const wordsPerMinute = 200; 
  const words = content.trim().split(/\s+/).length; 
  const minutes = Math.ceil(words / wordsPerMinute); 
  return minutes;
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

    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const slug =
      formData.get("slug")?.toString() ||
      title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const content = formData.get("content")?.toString() || "";
    const excerpt = formData.get("excerpt")?.toString() || "";
    const category = formData.get("category")?.toString() || "";
    const tags =
      formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((t) => t.trim()) || [];

    const file = formData.get("coverImage") as File | null;
    const readTime = calculateReadTime(content);
    let coverUrl = "";

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "blog_posts" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.write(buffer);
      stream.end();
    });

      coverUrl = (uploadRes as any).secure_url;
    }


    const newPost = await Post.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: coverUrl,
      tags,
      category,
      author: decoded.email,
      isPublished: true,
      readTime,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("Post creation failed:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
