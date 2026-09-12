import "server-only";

import { driveFolderUrl } from "@/lib/drive-links";
import { getIntegrationConfig, saveIntegrationConfig } from "@/lib/integrations";

/**
 * Google Drive storage for inspection-file documents.
 *
 * Authentication is OAuth against the owner's own Google account, not a
 * service account: service accounts have no storage quota in a personal
 * Drive, so their uploads fail. The scope is drive.file, which lets the app
 * see only the files and folders it created itself — never the rest of the
 * account's Drive.
 *
 * Plain fetch against the REST endpoints keeps this free of the googleapis
 * package, which is over 100 MB for the four calls needed here.
 */

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const REVOKE_URL = "https://oauth2.googleapis.com/revoke";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
export const DRIVE_CALLBACK_PATH = "/api/admin/integrations/google-drive/callback";
export const DRIVE_STATE_COOKIE = "gdrive_oauth_state";
export const ROOT_FOLDER_NAME = "Biznexa Inspection Files";
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const FOLDER_MIME = "application/vnd.google-apps.folder";

export class DriveError extends Error {
  /** True when the stored grant is unusable and the account must be reconnected. */
  readonly reconnect: boolean;
  readonly status: number;

  constructor(message: string, status: number, reconnect = false) {
    super(message);
    this.name = "DriveError";
    this.status = status;
    this.reconnect = reconnect;
  }
}

export const folderUrl = driveFolderUrl;

/**
 * The redirect URI Google sends the browser back to. It must match one
 * registered on the OAuth client exactly, so it is derived from the request
 * the admin is actually using — behind Nginx that means the forwarded headers.
 */
export function redirectUriFrom(headers: Headers): string {
  const host = headers.get("x-forwarded-host") ?? headers.get("host") ?? "localhost:3000";
  const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) ? "http" : "https");
  return `${proto}://${host}${DRIVE_CALLBACK_PATH}`;
}

export function buildAuthUrl(clientId: string, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: DRIVE_SCOPE,
    // offline + consent is what makes Google return a refresh token every
    // time, including when the account has connected before.
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URL}?${params}`;
}

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

async function postToken(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
    signal: AbortSignal.timeout(20_000),
  });
  const json = (await res.json().catch(() => ({}))) as TokenResponse;
  if (!res.ok || json.error) {
    const reconnect = json.error === "invalid_grant" || json.error === "unauthorized_client";
    const message = reconnect
      ? "Google Drive access was revoked or has expired. Reconnect it in Settings → Integrations."
      : json.error_description ?? json.error ?? `Google token endpoint returned ${res.status}`;
    throw new DriveError(message, res.status, reconnect);
  }
  return json;
}

export async function exchangeCode(
  clientId: string,
  clientSecret: string,
  code: string,
  redirectUri: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const json = await postToken({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  if (!json.access_token || !json.refresh_token) {
    throw new DriveError("Google did not return a refresh token. Try connecting again.", 400);
  }
  return { accessToken: json.access_token, refreshToken: json.refresh_token };
}

export async function revokeToken(token: string): Promise<void> {
  // Best effort: a token that is already invalid is exactly the state we want.
  await fetch(REVOKE_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => undefined);
}

// Access tokens last an hour. Keyed by refresh token so reconnecting a
// different account can never reuse the previous account's access token.
let tokenCache: { refreshToken: string; accessToken: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret, refreshToken } = await getIntegrationConfig("google_drive");
  if (!clientId || !clientSecret) {
    throw new DriveError("Google Drive is not configured. Add the OAuth client in Settings → Integrations.", 409);
  }
  if (!refreshToken) {
    throw new DriveError("Google Drive is not connected. Connect it in Settings → Integrations.", 409, true);
  }

  if (tokenCache && tokenCache.refreshToken === refreshToken && tokenCache.expiresAt > Date.now() + 60_000) {
    return tokenCache.accessToken;
  }

  const json = await postToken({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });
  if (!json.access_token) throw new DriveError("Google returned no access token.", 502);

  tokenCache = {
    refreshToken,
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

export function clearAccessTokenCache() {
  tokenCache = null;
}

async function driveJson<T>(url: string, init: RequestInit, accessToken: string): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { ...(init.headers ?? {}), authorization: `Bearer ${accessToken}` },
    signal: init.signal ?? AbortSignal.timeout(30_000),
  });
  if (res.status === 204) return undefined as T;

  const json = (await res.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!res.ok) {
    throw new DriveError(json.error?.message ?? `Google Drive returned ${res.status}`, res.status, res.status === 401);
  }
  return json;
}

export async function getAccountEmail(accessToken: string): Promise<string> {
  const json = await driveJson<{ user?: { emailAddress?: string } }>(
    `${DRIVE_API}/about?fields=user(emailAddress)`,
    { method: "GET" },
    accessToken,
  );
  return json.user?.emailAddress ?? "";
}

/** True when the folder still exists and is not in the bin. */
async function folderIsUsable(folderId: string, accessToken: string): Promise<boolean> {
  try {
    const json = await driveJson<{ trashed?: boolean; mimeType?: string }>(
      `${DRIVE_API}/files/${encodeURIComponent(folderId)}?fields=trashed,mimeType`,
      { method: "GET" },
      accessToken,
    );
    return !json.trashed && json.mimeType === FOLDER_MIME;
  } catch (error) {
    // 404 means it was deleted (or was never ours). Anything else is a real failure.
    if (error instanceof DriveError && error.status === 404) return false;
    throw error;
  }
}

export async function createFolder(name: string, parentId: string | null, accessToken: string): Promise<string> {
  const json = await driveJson<{ id?: string }>(
    `${DRIVE_API}/files?fields=id`,
    {
      method: "POST",
      headers: { "content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, ...(parentId ? { parents: [parentId] } : {}) }),
    },
    accessToken,
  );
  if (!json.id) throw new DriveError("Google Drive did not return a folder ID.", 502);
  return json.id;
}

export async function deleteFile(fileId: string, accessToken: string): Promise<void> {
  await driveJson<void>(`${DRIVE_API}/files/${encodeURIComponent(fileId)}`, { method: "DELETE" }, accessToken).catch(
    () => undefined,
  );
}

/**
 * The top-level folder every inspection file's folder lives in. Created on
 * first use and recreated if someone deletes it. The owner can rename or move
 * it anywhere in their Drive — drive.file access follows the folder.
 */
export async function ensureRootFolder(accessToken: string, adminId: number): Promise<string> {
  const { rootFolderId } = await getIntegrationConfig("google_drive");
  if (rootFolderId && (await folderIsUsable(rootFolderId, accessToken))) return rootFolderId;

  const id = await createFolder(ROOT_FOLDER_NAME, null, accessToken);
  await saveIntegrationConfig("google_drive", { rootFolderId: id }, adminId);
  return id;
}

/** Reuses `existingId` when it is still a live folder, otherwise creates one. */
export async function ensureChildFolder(
  existingId: string | null,
  name: string,
  accessToken: string,
  adminId: number,
): Promise<{ id: string; created: boolean }> {
  if (existingId && (await folderIsUsable(existingId, accessToken))) return { id: existingId, created: false };

  const rootId = await ensureRootFolder(accessToken, adminId);
  return { id: await createFolder(name, rootId, accessToken), created: true };
}

/** Drive allows almost any character in a name; strip only control characters. */
export function inspectionFolderName(fileNumber: string, customerName: string | null): string {
  const clean = (value: string) => value.replace(/[\x00-\x1f\x7f]/g, " ").replace(/\s+/g, " ").trim();
  const customer = customerName ? clean(customerName) : "";
  return (customer ? `${clean(fileNumber)} - ${customer}` : clean(fileNumber)).slice(0, 200);
}

export type UploadedDriveFile = { id: string; name: string; webViewLink: string | null };

/**
 * Resumable upload: one request opens a session, a second sends the bytes.
 * The same two calls work for any size, so there is no separate small-file path.
 */
export async function uploadFile(
  folderId: string,
  file: { name: string; mimeType: string; data: ArrayBuffer },
  accessToken: string,
): Promise<UploadedDriveFile> {
  const session = await fetch(
    `${DRIVE_UPLOAD_API}/files?uploadType=resumable&fields=id,name,webViewLink`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json; charset=UTF-8",
        "x-upload-content-type": file.mimeType,
        "x-upload-content-length": String(file.data.byteLength),
      },
      body: JSON.stringify({ name: file.name, parents: [folderId] }),
      signal: AbortSignal.timeout(30_000),
    },
  );

  const location = session.headers.get("location");
  if (!session.ok || !location) {
    const json = (await session.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new DriveError(
      json.error?.message ?? `Google Drive refused the upload (${session.status})`,
      session.status,
      session.status === 401,
    );
  }

  const res = await fetch(location, {
    method: "PUT",
    headers: { "content-type": file.mimeType },
    body: file.data,
    signal: AbortSignal.timeout(180_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
    webViewLink?: string;
    error?: { message?: string };
  };
  if (!res.ok || !json.id) {
    throw new DriveError(json.error?.message ?? `Upload to Google Drive failed (${res.status})`, res.status);
  }
  return { id: json.id, name: json.name ?? file.name, webViewLink: json.webViewLink ?? null };
}

export type DriveStatus = {
  configured: boolean;
  connected: boolean;
  accountEmail: string;
  rootFolderUrl: string | null;
  redirectUri: string;
};

/** What the settings page shows. Reads config only — makes no Google calls. */
export async function getDriveStatus(headers: Headers): Promise<DriveStatus> {
  const cfg = await getIntegrationConfig("google_drive");
  return {
    configured: Boolean(cfg.clientId && cfg.clientSecret),
    connected: Boolean(cfg.clientId && cfg.clientSecret && cfg.refreshToken),
    accountEmail: cfg.accountEmail ?? "",
    rootFolderUrl: cfg.rootFolderId ? folderUrl(cfg.rootFolderId) : null,
    redirectUri: redirectUriFrom(headers),
  };
}

export async function isDriveConnected(): Promise<boolean> {
  const cfg = await getIntegrationConfig("google_drive");
  return Boolean(cfg.clientId && cfg.clientSecret && cfg.refreshToken);
}
