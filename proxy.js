import { NextResponse } from "next/server";

export function proxy(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const protectedPaths = [
    "/dashboard",
    "/inventory",
    "/orders",
    "/warehouse",
    "/settings",
    "/analytics",
  ];

  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected && !refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/orders/:path*",
    "/warehouse/:path*",
    "/settings/:path*",
    "/analytics/:path*",
  ],
};