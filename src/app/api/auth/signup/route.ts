import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { resendEmail } from "@/lib/Resend-email";
import { signupSchema } from "@/lib/SignupSchema";
import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message || "Invalid input data.";
       return errorResponse({
                                error: errorMessage,
                                message: "Validation failed",
                                status: HTTP_STATUS.BAD_REQUEST,
                              });
    }

    const { email, username, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse({
              error: "Registration failed",
              message: "Email is already registered.",
              status: HTTP_STATUS.CONFLICT,
            });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    const token = generateToken({ userId: newUser._id, email }, "15m");
    if (!token) {
      return errorResponse({
              error: "Could not generate verification token. Please try again.",
              message: "Token generation failed",
              status: HTTP_STATUS.SERVER_ERROR,
            });
    }

    const emailBody = `
      <p>Hello,</p>
      <p>You need to verify your account. Click the link below to continue:</p>
      <p><a href="{RESET_LINK}" target="_blank">Verification Link</a></p>
      <p>This link will expire in 15 minutes. If you are unable to verify in this given time, you will have to sign up again.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `;
    await resendEmail(email, "Verification Email", emailBody, token, "verify");

    return successResponse({
      data: null,
      message: "User registered successfully. Please check your email to verify your account.",
      status: HTTP_STATUS.CREATED,
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
      }
      );
    }
  }