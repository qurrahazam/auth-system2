import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  await connectDB();
  await Post.deleteMany();
  await Post.insertMany([
    {
      title: "Getting Started with Next.js",
      slug: "getting-started-with-nextjs",
      content: "# Welcome!\nThis is my first post written in **Markdown**!",
      author: "Qurrah",
    },
    {
      title: "Learning Static Site Generation",
      slug: "learning-ssg",
      content: "Next.js supports *SSG*, which makes your site super fast 🚀",
      author: "Qurrah",
    },
  ]);
  return NextResponse.json({ message: "Database seeded" });
}
