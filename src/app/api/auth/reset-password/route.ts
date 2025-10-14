import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { resetPasswordSchema } from "@/lib/ResetPasswordSchema";
import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parseResult = resetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return errorResponse({
                          error: errorMessage,
                          message: "Validation failed",
                          status: HTTP_STATUS.BAD_REQUEST,
                        });
    }

    const { newPassword } = parseResult.data;

   
    const { token } = body; 
    if (!token) {
      return errorResponse({
                          error: "Token is required.",
                          message: "Validation failed",
                          status: HTTP_STATUS.BAD_REQUEST,
                        });
    }

    let decoded_token: any;
    decoded_token = verifyToken(token);
    if (!decoded_token) {
      return errorResponse({
                          error: "Invalid or expired token.",
                          message: "Token verification failed",
                          status: HTTP_STATUS.UNAUTHORIZED,
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const response = successResponse({
      data: null,
      message: "Reset Password Successfully",
      status: HTTP_STATUS.OK
    });

    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;

  } catch (error) {
    return errorResponse({
                        error: "Server error. Please try again later.",
                        message: "Password reset failed",
                        status: HTTP_STATUS.SERVER_ERROR,
                      });
  }
}
