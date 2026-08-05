import "server-only";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * True when S3 is configured in this environment. Routes use this to decide
 * between durable S3 storage (production, Amplify) and the local-disk
 * `public/uploads` fallback (local dev). Existing committed files under
 * `public/uploads` keep working in both cases because they are referenced by
 * their committed `/uploads/...` URLs — only NEW uploads change destination.
 */
export function isS3Configured(): boolean {
  return Boolean(process.env.S3_BUCKET && process.env.S3_REGION);
}

function client(): S3Client {
  const region = process.env.S3_REGION;
  if (!region) {
    throw new Error("Missing S3_REGION.");
  }

  // The SDK resolves credentials through its default chain (env, shared-ini,
  // ECS, IMDS) when explicit access-key env vars are not provided. We only
  // pass explicit credentials when BOTH the key id and secret are present.
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const credentials =
    accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

  const options: ConstructorParameters<typeof S3Client>[0] = { region, credentials };

  const endpoint = process.env.S3_ENDPOINT;
  if (endpoint) options.endpoint = endpoint;

  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE === "true";
  if (forcePathStyle) options.forcePathStyle = true;

  return new S3Client(options);
}

function publicUrl(key: string): string {
  // Custom CDN/base takes precedence (e.g. a CloudFront domain in front of S3).
  const base = process.env.S3_PUBLIC_BASE;
  if (base) {
    return `${base.replace(/\/$/, "")}/${key}`;
  }

  const bucket = process.env.S3_BUCKET;
  const region = process.env.S3_REGION;
  if (!bucket || !region) {
    throw new Error("Missing S3_BUCKET or S3_REGION.");
  }

  // Virtual-hosted style: https://<bucket>.s3.<region>.amazonaws.com/<key>
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export interface PutObjectResult {
  ok: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Stores `body` at `key` in S3 and returns the public URL. `body` may be a
 * Buffer or any value PutObjectCommand accepts as Body (string, Uint8Array,
 * Blob, Readable). The caller owns the key — use a path-safe, prefixed name.
 */
export async function putObject(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
): Promise<PutObjectResult> {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    return { ok: false, error: "Missing S3_BUCKET." };
  }

  try {
    const s3 = client();
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
        ACL: "public-read",
      }),
    );
    return { ok: true, url: publicUrl(key), key };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "S3 PutObject failed.",
    };
  }
}
