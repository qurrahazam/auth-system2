import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/jwt";
import { changePasswordSchema } from "@/lib/changePasswordSchema";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const parseResult = changePasswordSchema.safeParse(body);

    if (!parseResult.success) {
  
      const errorMessage = parseResult.error.issues[0]?.message || "Invalid input.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const { currentPassword, newPassword } = parseResult.data;

    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const response = NextResponse.json(
      { message: "Password changed successfully. You are being redirected to login." },
      { status: 200 }
    );
    response.cookies.set("token", "", { maxAge: 0, path: "/" });

    return response;
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