import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import {
  clearAccessTokenCache,
  DRIVE_STATE_COOKIE,
  DriveError,
  ensureRootFolder,
  exchangeCode,
  getAccountEmail,
  redirectUriFrom,
} from "@/lib/google-drive";
import { getIntegrationConfig, recordVerification, saveIntegrationConfig } from "@/lib/integrations";

export const runtime = "nodejs";

function sameState(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Google redirects here after consent. Stores the grant and prepares the root folder. */
export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const redirectUri = redirectUriFrom(request.headers);
  const settingsUrl = new URL("/admin/settings/integrations", redirectUri);
  const url = new URL(request.url);

  const finish = (status: "connected" | "error", message?: string) => {
    settingsUrl.searchParams.set("drive", status);
    if (message) settingsUrl.searchParams.set("message", message);
    const response = NextResponse.redirect(settingsUrl);
    response.cookies.set(DRIVE_STATE_COOKIE, "", { path: "/api/admin/integrations/google-drive", maxAge: 0 });
    return response;
  };

  const googleError = url.searchParams.get("error");
  if (googleError) {
    return finish("error", googleError === "access_denied" ? "Google access was not granted." : googleError);
  }

  const state = url.searchParams.get("state") ?? "";
  const expected = request.headers.get("cookie")?.match(new RegExp(`${DRIVE_STATE_COOKIE}=([a-f0-9]{64})`))?.[1] ?? "";
  if (!state || !expected || !sameState(state, expected)) {
    return finish("error", "The connection request expired or did not start here. Try connecting again.");
  }

  const code = url.searchParams.get("code");
  if (!code) return finish("error", "Google did not return an authorization code.");

  try {
    const { clientId, clientSecret } = await getIntegrationConfig("google_drive");
    if (!clientId || !clientSecret) return finish("error", "The Google OAuth client is not configured.");

    const { accessToken, refreshToken } = await exchangeCode(clientId, clientSecret, code, redirectUri);
    const accountEmail = await getAccountEmail(accessToken).catch(() => "");

    // Save the grant first: the root folder lookup below reads it, and a
    // connected account with no folder yet is still a usable state.
    clearAccessTokenCache();
    await saveIntegrationConfig("google_drive", { refreshToken, accountEmail }, admin.id);
    await ensureRootFolder(accessToken, admin.id);
    await recordVerification("google_drive", true, null);

    return finish("connected");
  } catch (error) {
    const message = error instanceof DriveError ? error.message : "Could not connect Google Drive.";
    console.error("Google Drive connect failed", error);
    await recordVerification("google_drive", false, message).catch(() => undefined);
    return finish("error", message);
  }
}
