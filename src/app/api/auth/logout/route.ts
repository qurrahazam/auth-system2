import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = NextResponse.json({ message: "Logged out successfully" });
    res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
