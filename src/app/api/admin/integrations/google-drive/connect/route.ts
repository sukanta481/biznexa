import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { buildAuthUrl, DRIVE_STATE_COOKIE, redirectUriFrom } from "@/lib/google-drive";
import { getIntegrationConfig } from "@/lib/integrations";

export const runtime = "nodejs";

/** Starts the OAuth flow: stores a one-time state, then sends the admin to Google. */
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const redirectUri = redirectUriFrom(request.headers);
  const settingsUrl = new URL("/admin/settings/integrations", redirectUri);

  const { clientId, clientSecret } = await getIntegrationConfig("google_drive");
  if (!clientId || !clientSecret) {
    settingsUrl.searchParams.set("drive", "error");
    settingsUrl.searchParams.set("message", "Save the Google OAuth client ID and secret before connecting.");
    return NextResponse.redirect(settingsUrl);
  }

  // The state ties Google's redirect back to this browser, so a crafted
  // callback link cannot attach someone else's Drive to this site.
  const state = randomBytes(32).toString("hex");
  const response = NextResponse.redirect(buildAuthUrl(clientId, redirectUri, state));
  response.cookies.set(DRIVE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/admin/integrations/google-drive",
    maxAge: 600,
  });
  return response;
}
