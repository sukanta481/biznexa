import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/admin/login";
const SESSION_COOKIE_NAME = "admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and auth API routes
  if (pathname === LOGIN_PATH || pathname.startsWith("/api/admin/auth/")) {
    return NextResponse.next();
  }

  // Only protect /admin/* routes
  if (!pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  // Check session cookie existence
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  if (!session?.value) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
