import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { resetPasswordSchema } from "@/lib/resetPasswordSchema";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const parseResult = resetPasswordSchema.safeParse(body);

    if (!parseResult.success) {
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { newPassword } = parseResult.data;

   
    const { token } = body; 
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    let decoded_token: any;
    decoded_token = verifyToken(token);
    if (!decoded_token) {
      return NextResponse.json(
        { error: "Invalid or expired token" }, { status: 401 }
      );
    }

    const user = await User.findById(decoded_token.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const response = NextResponse.json(
      { message: "Password reset successfully. You are being redirected to login." },
      { status: 200 }
    );

    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
