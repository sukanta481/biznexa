import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

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

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filepath = join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;

    return Response.json({ ok: true, url, filename });
  } catch (error) {
    console.error("[upload] Error:", error);
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
