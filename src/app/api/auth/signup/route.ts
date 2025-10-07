import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; 
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { generateToken } from "@/lib/jwt";
import { isValidEmail, isStrongPassword} from "@/lib/validators";

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

    if (isValidEmail(email) === false) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const passwordValidation = isStrongPassword(password);
    if (
      (typeof passwordValidation === "boolean" && passwordValidation === false) ||
      (typeof passwordValidation === "object" && passwordValidation.valid === false)
    ) {
      return NextResponse.json(
        { error: typeof passwordValidation === "object" && passwordValidation.message ? passwordValidation.message : "Password is not strong enough." },
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
    const token = generateToken({ userId: newUser._id, email: email}, "15m");
    if (!token) {
      return NextResponse.json(
        { error: "Could not generate verification token, please try again." },
        { status: 500 }
      );
    }

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
        <p>This link will expire in 15 minutes. If you are unable to verify in this given time you would have to 
        sign-up again</p>
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