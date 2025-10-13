import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { generateToken } from "@/lib/jwt";
import { resendEmail } from "@/lib/Resend-email";
import { forgotPasswordSchema } from "@/lib/forgotPasswordSchema";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parseResult = forgotPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { email } = parseResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Email not found." },
        { status: 404 }
      );
    }

    const token = generateToken({ userId: user._id, email }, "15m");
    if (!token) {
      return NextResponse.json(
        { error: "Could not generate reset token. Please try again." },
        { status: 500 }
      );
    }

    const emailBody = `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below to continue:</p>
      <p><a href="{RESET_LINK}" target="_blank">Reset Password</a></p>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `;

    await resendEmail(email, "Password Reset", emailBody, token, "reset-password");

    return NextResponse.json(
      { message: "Password reset email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error: any) {
  
      if (error.name === "MongoServerError") {
        return NextResponse.json(
          { message: "Database error, please try again later." },
          { status: 503 }
        );
      }
  
      if (error.name === "JsonWebTokenError") {
        return NextResponse.json(
          { message: "Invalid token." },
          { status: 401 }
        );
      }
  
      return NextResponse.json(
        { message: "Unexpected server error" },
        { status: 500 }
      );
    }
  }