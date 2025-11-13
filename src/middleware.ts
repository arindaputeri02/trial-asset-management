import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🚫 Lewatin middleware untuk route publik
  if (
    pathname.startsWith("/api/auth") ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/_next") || // penting: untuk assets
    pathname.startsWith("/images") || // kalau kamu load dari /public/images
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // 🚫 Kalau belum login → redirect ke signin
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);

    // ✅ Token valid → lanjut
    return NextResponse.next();
  } catch {
    // console.error("❌ Token invalid:", err);
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|images|public).*)"],
};
