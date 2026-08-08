import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { requireAdmin, unauthorized } from "@/lib/admin-guard";
import { isS3Configured, putObject } from "@/lib/storage";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .toLowerCase();
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return Response.json(
        { ok: false, error: "No file provided." },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return Response.json(
        {
          ok: false,
          error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, SVG, AVIF.`,
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { ok: false, error: "File exceeds the 5 MB limit." },
        { status: 400 },
      );
    }

    const timestamp = Date.now();
    const sanitized = sanitizeFilename(file.name);
    const filename = `${timestamp}-${sanitized}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    // New uploads prefer durable S3 storage (required in production where
    // Amplify's SSR filesystem is ephemeral). When S3 is not configured — i.e.
    // local dev — fall back to writing under public/uploads so the route still
    // works. Existing committed files at /uploads/... keep resolving in both
    // cases because Next serves them as static assets.
    let url: string;
    if (await isS3Configured()) {
      const key = `uploads/${filename}`;
      const stored = await putObject(key, buffer, file.type);
      if (!stored.ok || !stored.url) {
        return Response.json(
          { ok: false, error: `S3 upload failed: ${stored.error ?? "unknown error"}` },
          { status: 502 },
        );
      }
      url = stored.url;
    } else if (process.env.NODE_ENV === "production") {
      // The local-disk fallback below cannot work on a serverless/read-only
      // host, so say exactly what is missing instead of surfacing an EROFS.
      return Response.json(
        {
          ok: false,
          error:
            "Media storage is not configured on this server. Set S3_BUCKET and S3_REGION (plus credentials) in the hosting environment — the local public/uploads fallback only works in development.",
        },
        { status: 500 },
      );
    } else {
      try {
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
      } catch (diskError) {
        const reason = diskError instanceof Error ? diskError.message : String(diskError);
        return Response.json(
          { ok: false, error: `Could not write to public/uploads: ${reason}` },
          { status: 500 },
        );
      }
      url = `/uploads/${filename}`;
    }

    return Response.json({ ok: true, url, filename });
  } catch (error) {
    console.error("[upload] Error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
