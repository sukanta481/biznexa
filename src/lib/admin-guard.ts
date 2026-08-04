import "server-only";

import { NextResponse } from "next/server";

import { getCurrentAdmin, type AdminUser } from "@/lib/auth";

/**
 * Resolves the caller's admin identity, optionally restricted to given roles.
 * Returns null when the caller is anonymous, their session is expired or
 * forged, their account is inactive, or their role is not permitted.
 *
 * This is the security boundary for the admin API. `src/middleware.ts` is not
 * — it runs on the edge runtime and cannot reach the database.
 */
export async function requireAdmin(roles?: string[]): Promise<AdminUser | null> {
  const user = await getCurrentAdmin();
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return user;
}

/** Standard rejection response for the admin API. */
export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}