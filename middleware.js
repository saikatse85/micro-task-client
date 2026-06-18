import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(token, secret);

    const pathname = req.nextUrl.pathname;

    if (
      pathname.startsWith("/dashboard/admin") &&
      payload.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      pathname.startsWith("/dashboard/buyer") &&
      payload.role !== "buyer"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (
      pathname.startsWith("/dashboard/worker") &&
      payload.role !== "worker"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};