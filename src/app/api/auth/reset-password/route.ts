import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { token, newPassword } = await request.json();
    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    let decoded: any;
    decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid or expired token" }, { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const response =  NextResponse.json(
      { message: "Password reset successfully, You are being redirected to Login" },
      { status: 200 }
    );
   
    response.cookies.set("token", "", { maxAge: 0, path: "/" });
    return response;
      
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Server error, please try again later." },
        { status: 500 } 
    );
  }
}
