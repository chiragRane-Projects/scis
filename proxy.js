import { NextResponse } from "next/server";
import { jwtVerify } from "jose"

const ACCESS_SECRET = new TextEncoder().encode(
    process.env.ACCESS_SECRET
)

export async function proxy(req) {
    const { pathname } = req.nextUrl;

    if (
        pathname.startsWith("/") ||
        pathname.startsWith("/api/auth/login") ||
        pathname.startsWith("/api/auth/refresh")
    ) {
        return NextResponse.next();
    }

    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    const token = authHeader.split(" ")[1];

    try {
        const { payload } = await jwtVerify(token, ACCESS_SECRET);

        const role = payload.role;

        if (pathname.startsWith("/admin")) {
            if (role !== "admin") {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        if (pathname.startsWith("/analyst")) {
            if (!["admin", "analyst"].includes(role)) {
                return NextResponse.redirect(new URL("/unauthorized", req.url));
            }
        }

        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/analytics/:path*"
  ],
};