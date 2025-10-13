import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { resendEmail } from "@/lib/Resend-email";
import { signupSchema } from "@/lib/signupSchema";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      const errorMessage = parsed.error.issues[0]?.message || "Invalid input data.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { email, username, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
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
      return NextResponse.json(
        { error: "Could not generate verification token, please try again." },
        { status: 500 }
      );
    }

    const emailBody = `
      <p>Hello,</p>
      <p>You need to verify your account. Click the link below to continue:</p>
      <p><a href="{RESET_LINK}" target="_blank">Verification Link</a></p>
      <p>This link will expire in 15 minutes. If you are unable to verify in this given time, you will have to sign up again.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `;
    await resendEmail(email, "Verification Email", emailBody, token, "verify");

    return NextResponse.json(
      { success: true, message: "User registered successfully. Verify your email to continue." },
      { status: 201 }
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