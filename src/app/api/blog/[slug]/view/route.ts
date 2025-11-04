import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { errorResponse, successResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await connectDB();

  try {
    await Post.findOneAndUpdate({ slug }, { $inc: { view: 1 } });
    return successResponse({
      message: '',
      data: '',
      status: HTTP_STATUS.OK,
    });
  } catch (err) {
    return errorResponse({
      message: '',
      error: "Couldn't like",
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}