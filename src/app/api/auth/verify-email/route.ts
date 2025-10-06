import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User already verified" });
    }

    user.isVerified = true;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}
