import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

  // NextAuth session cookie
  const token =
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token");

  const protectedRoutes = [
    "/account",
    "/create-blog",
    "/dashboard",
    "/admin",
  ];

  const isProtected = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // NOT LOGGED IN → REDIRECT LOGIN
  if (isProtected && !token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/create-blog/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};