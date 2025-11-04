import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { changePasswordSchema } from "@/lib/ChangePasswordSchema";
import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(request: Request) {

  try {
    await connectDB();
    const body = await request.json();
    const parseResult = changePasswordSchema.safeParse(body);

    if (!parseResult.success) {
  
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
       return errorResponse({
                    error: errorMessage,
                    message: "Validation failed",
                    status: HTTP_STATUS.BAD_REQUEST,
                  });
    }

    const { currentPassword, newPassword } = parseResult.data;

    const token = (await cookies()).get("token")?.value;
    if (!token) {
    return errorResponse({
            error: "Unauthorized",
            message: "Token not found",
            status: HTTP_STATUS.UNAUTHORIZED,
          });
    }

    let decoded_token: any;
    decoded_token = verifyToken(token);
    if (!decoded_token) {
      return errorResponse({
        error: "Invalid or expired token",
        message: "Authentication Failed",
        status: HTTP_STATUS.UNAUTHORIZED

      });
    }

    const user = await User.findById(decoded_token.userId);
    if (!user) {
      return errorResponse({
                            error: "User not found.",
                            message: "No user with this token exists",
                            status: HTTP_STATUS.NOT_FOUND,
                          });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
    return errorResponse({
            error: "Password mismatch",
            message: "Current password is incorrect",
            status: HTTP_STATUS.BAD_REQUEST,
          });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const response = successResponse({
      data: null,
      message: "Password Changed Successfully",
      status: HTTP_STATUS.OK,
    });

    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;

  } catch (error: any) {
    if (error.name === "MongoServerError") {
      return errorResponse({
        error: error.message,
        message: "Database error, please try again later.",
        status: HTTP_STATUS.SERVICE_UNAVAILABLE,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return errorResponse({
        error: error.message,
        message: "Invalid token.",
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    return errorResponse({
      error: error.message,
      message: "Unexpected server error.",
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}