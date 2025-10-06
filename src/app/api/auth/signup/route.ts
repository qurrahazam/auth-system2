import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    } 
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: "Username must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Password must have at least 8 characters, including 1 uppercase and 1 number.",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();
    const token = jwt.sign(
    { userId: newUser._id, email: newUser.email },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: "15m" }
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
        
    const resetLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Verify Your Email',
    html: `
        <p>Hello,</p>
        <p>You need to verify your account. Click the link below to continue:</p>
        <p><a href="${resetLink}" target="_blank">Verfication Link</a></p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you didn’t request this, you can ignore this email.</p>
    `,
    });


    return NextResponse.json(
      { success: true, message: "User registered successfully, Verify Email to continue"},
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}