import "server-only";

import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { query } from "@/lib/db";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const PEPPER = process.env.AUTH_PEPPER || process.env.APP_SECRET || "biznexa-auth-pepper-2026";

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

export async function authenticateAdmin(username: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
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

  const token = randomBytes(32).toString("hex");

  return {
    user: {
      id: user.id as number,
      username: user.username as string,
      email: user.email as string,
      full_name: user.full_name as string,
      role: user.role as string,
      avatar: user.avatar as string | null,
    },
    token,
  };
}

export async function setSessionCookie(token: string, userId: number, remember: boolean = false) {
  const cookieStore = await cookies();
  const maxAge = remember ? SESSION_MAX_AGE : 60 * 60 * 24; // 1 day if not remember

  cookieStore.set(SESSION_COOKIE_NAME, `${userId}:${token}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session?.value) return null;

  const parts = session.value.split(":");
  if (parts.length !== 2) return null;

  const userId = parseInt(parts[0], 10);
  if (isNaN(userId)) return null;

  const rows = await query<RowDataPacket[]>(
    `SELECT id, username, email, full_name, role, avatar, status
     FROM admin_users
     WHERE id = ? AND status = 'active'
     LIMIT 1`,
    [userId],
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
