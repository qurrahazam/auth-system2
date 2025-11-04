import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname, origin } = req.nextUrl;

  if (token && ["/login", "/signup", "/forgot-password", "/reset-password"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  const protectedRoutes = ["/dashboard", "/change-password"];

  if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", origin));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard/:path*",
    "/change-password",
  ],
};
