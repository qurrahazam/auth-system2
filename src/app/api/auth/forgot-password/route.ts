import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { Resend } from 'resend';
import { connectDB } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Email Not Found." },
        { status: 404 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "15m" }
    );


    const resend = new Resend(process.env.RESEND_API_KEY);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset Your Password',
    html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to continue:</p>
        <p><a href="${resetLink}" target="_blank">Reset Password</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
    `,
    });

    return NextResponse.json(
      { message: "Password reset email sent. Please check your inbox." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Server error, please try again later." },
      { status: 500 }
    );
  }
}
