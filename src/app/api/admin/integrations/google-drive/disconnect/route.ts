import { NextResponse } from "next/server";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { clearAccessTokenCache, revokeToken } from "@/lib/google-drive";
import { clearIntegrationFields, getIntegrationConfig } from "@/lib/integrations";

export const runtime = "nodejs";

/**
 * Revokes the grant and forgets the account. The OAuth client and the root
 * folder ID are kept, so reconnecting the same account resumes in the same
 * folder. Nothing in Drive is deleted.
 */
export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return unauthorized();

  const { refreshToken } = await getIntegrationConfig("google_drive");
  if (refreshToken) await revokeToken(refreshToken);

  await clearIntegrationFields("google_drive", ["refreshToken", "accountEmail"], admin.id);
  clearAccessTokenCache();

  return NextResponse.json({ ok: true });
}
