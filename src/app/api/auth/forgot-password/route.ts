import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/jwt";
import { resendEmail } from "@/lib/Resend-email";
import { forgotPasswordSchema } from "@/lib/ForgotPasswordSchema";
import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return errorResponse({
              error: errorMessage,
              message: "Validation failed",
              status: HTTP_STATUS.BAD_REQUEST,
            });
    }

    const { email } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse({
              error: "Email not found.",
              message: "No user with this email exists",
              status: HTTP_STATUS.NOT_FOUND,
            });
    }

    const token = generateToken({ userId: user._id, email }, "15m");
    if (!token) {
      return errorResponse({
              error: "Could not generate reset token. Please try again.",
              message: "Token generation failed",
              status: HTTP_STATUS.SERVER_ERROR,
            });
    }

    const emailBody = `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to continue:</p>
      <p><a href="{RESET_LINK}" target="_blank">Reset Password</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `;

    await resendEmail(email, "Password Reset", emailBody, token, "reset-password");

    return successResponse({
      data: null,
      message: "Password reset email sent. Please check your inbox.",
      status: HTTP_STATUS.OK,
    });

  } catch (error: any) {
  
      if (error.name === "MongoServerError") {
        return errorResponse({
          error: "Database connection error. Please try again later.",
          message: "Database error",
          status: HTTP_STATUS.SERVICE_UNAVAILABLE,
        });
      }
  
      if (error.name === "JsonWebTokenError") {
        return errorResponse({
          error: "Error generating token. Please try again.",
          message: "Token error",
          status: HTTP_STATUS.SERVER_ERROR,
        });
      }
  
      return errorResponse({
        error: error.message,
        message: "Unexpected server error.",
        status: HTTP_STATUS.SERVER_ERROR,
      });
    }
  }