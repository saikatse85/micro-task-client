import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  
  const token = req.cookies.get("token")?.value;
  
  console.log("TOKEN EXISTS:", !!token);
  console.log("JWT_SECRET EXISTS:", !!process.env.JWT_SECRET);
  
  const pathname = req.nextUrl.pathname;

  // 1. No token → block
  if (!token) {
     console.log("NO TOKEN FOUND");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log("USER:", user);
    console.log("PATH:", pathname);

    // 2. ROLE CHECKS

    if (pathname.startsWith("/dashboard/admin") && user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard/worker") && user.role !== "worker") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/dashboard/buyer") && user.role !== "buyer") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }catch (err) {
  console.log("JWT ERROR:", err.message);
  console.log("TOKEN EXISTS:", !!token);
  console.log("SECRET EXISTS:", !!process.env.JWT_SECRET);
  return NextResponse.redirect(new URL("/login", req.url));
}
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/worker/:path*"],
};