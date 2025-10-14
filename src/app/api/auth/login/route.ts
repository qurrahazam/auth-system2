import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/LoginSchema";
import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return errorResponse({
                    error: errorMessage,
                    message: "Validation failed",
                    status: HTTP_STATUS.BAD_REQUEST,
                  });
    }

    const { email, password } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse({
                    error: "Invalid email or password.",
                    message: "Authentication failed",
                    status: HTTP_STATUS.UNAUTHORIZED,
                  }
      );
    }

    if (!user.isVerified) {
      return errorResponse({
                    error: "Email not verified. Please verify your email before logging in.",
                    message: "Email not verified",
                    status: HTTP_STATUS.FORBIDDEN,
                  });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse({
                    error: "Invalid email or password.",
                    message: "Authentication failed",
                    status: HTTP_STATUS.UNAUTHORIZED,
                  });
    }

    const token = generateToken({ userId: user._id, email: user.email }, "1h");
    if (!token) {
      return errorResponse({
                    error: "Could not generate authentication token. Please try again.",
                    message: "Token generation failed",
                    status: HTTP_STATUS.SERVER_ERROR,
                  });
    }

    const response = successResponse({
      data: null,
      message: "Login Successfully",
      status: HTTP_STATUS.OK,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;

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
