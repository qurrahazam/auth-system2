import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import ReactMarkdown from "react-markdown";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; 

  await connectDB();
  const post = await Post.findOne({ slug }).lean() as { title: string; content: string } | null;

  if (!post) {
    return <h1 className="text-center mt-10 text-red-500">Post not found</h1>;
  }

  return (
    <article className="prose mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </article>
  );
}
