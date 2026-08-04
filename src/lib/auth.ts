import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 7; // 7 days
const SESSION_MAX_AGE_DEFAULT = 60 * 60 * 24; // 1 day
const PEPPER = process.env.AUTH_PEPPER || process.env.APP_SECRET || "biznexa-auth-pepper-2026";

/** The cookie carries the raw token; only this hash is ever persisted. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: string;
  avatar: string | null;
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(salt + password + PEPPER).digest("hex");
  return `$sha256$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash.startsWith("$sha256$")) {
    // Legacy bcrypt hashes — use simple comparison fallback
    // For the existing admin user with bcrypt hash, we'll handle it separately
    return false;
  }

  const parts = storedHash.split("$");
  if (parts.length !== 4) return false;

  const salt = parts[2];
  const hash = parts[3];
  const computedHash = createHash("sha256").update(salt + password + PEPPER).digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computedHash, "hex"));
  } catch {
    return false;
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<{ user: AdminUser } | null> {
  const rows = await query<RowDataPacket[]>(
    `SELECT id, username, email, password, full_name, role, avatar, status
     FROM admin_users
     WHERE (username = ? OR email = ?) AND status = 'active'
     LIMIT 1`,
    [username, username],
  );

  if (!rows.length) return null;

  const user = rows[0];
  const passwordHash = user.password as string;

  // Only support SHA-256 hashes
  if (!passwordHash.startsWith("$sha256$")) {
    // Old bcrypt hash — can't verify without bcryptjs (removed due to webpack issues)
    // Run the SQL migration to update your password
    return null;
  }

  const isValid = verifyPassword(password, passwordHash);
  if (!isValid) return null;

  await query<ResultSetHeader>(
    `UPDATE admin_users SET last_login = NOW() WHERE id = ?`,
    [user.id],
  );

  return {
    user: {
      id: user.id as number,
      username: user.username as string,
      email: user.email as string,
      full_name: user.full_name as string,
      role: user.role as string,
      avatar: user.avatar as string | null,
    },
  };
}

export async function createSession(
  userId: number,
  remember: boolean,
  meta: { userAgent?: string | null; ip?: string | null } = {},
): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const maxAge = remember ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE_DEFAULT;

  await query<ResultSetHeader>(
    `INSERT INTO admin_sessions (user_id, token_hash, expires_at, user_agent, ip)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? SECOND), ?, ?)`,
    [userId, hashToken(token), maxAge, meta.userAgent?.slice(0, 255) ?? null, meta.ip?.slice(0, 45) ?? null],
  );

  // Opportunistic cleanup so the table cannot grow without bound.
  await query<ResultSetHeader>(`DELETE FROM admin_sessions WHERE expires_at < NOW()`);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (raw && /^[a-f0-9]{64}$/.test(raw)) {
    await query<ResultSetHeader>(`DELETE FROM admin_sessions WHERE token_hash = ?`, [hashToken(raw)]);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!raw) return null;

  // Anything that is not a bare 64-char hex token is rejected outright. This
  // also invalidates every legacy "userId:token" cookie, which was forgeable.
  if (!/^[a-f0-9]{64}$/.test(raw)) return null;

  const rows = await query<RowDataPacket[]>(
    `SELECT u.id, u.username, u.email, u.full_name, u.role, u.avatar
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
        AND u.status = 'active'
      LIMIT 1`,
    [hashToken(raw)],
  );

  if (!rows.length) return null;

  const user = rows[0];
  return {
    id: user.id as number,
    username: user.username as string,
    email: user.email as string,
    full_name: user.full_name as string,
    role: user.role as string,
    avatar: user.avatar as string | null,
  };
}
