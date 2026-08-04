import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATH = "/admin";
const LOGIN_PATH = "/admin/login";
const SESSION_COOKIE_NAME = "admin_session";

// UX ONLY — this is not a security boundary.
//
// Middleware runs on the edge runtime and cannot reach MySQL, so it can only
// check that a cookie is present, never that it is valid. Its job is to bounce
// logged-out users to the login page instead of showing them an empty shell.
//
// The real check is requireAdmin() in src/lib/admin-guard.ts, called by every
// admin API handler. Do not extend the matcher below to /api/admin/* — a
// cookie-existence check is trivially forged, and it would return an HTML
// redirect where the admin UI expects a JSON 401.

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
