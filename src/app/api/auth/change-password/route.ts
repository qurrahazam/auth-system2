import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  try {
    await connectDB();
    
    const { oldPassword, newPassword } = await request.json();
    
    const token = request.headers.get("cookie")?.split("=")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Old password is incorrect" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error:
            "New password must have at least 8 characters, including 1 uppercase and 1 number.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password changed successfully" }, { status: 200 });
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json({ error: "Password change failed" }, { status: 500 });
  }
}
