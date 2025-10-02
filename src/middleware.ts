import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (token && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!token && req.nextUrl.pathname.startsWith("/change-password")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/change-password", "/dashboard/:path*"],
};
