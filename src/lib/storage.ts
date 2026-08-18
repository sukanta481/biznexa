import "server-only";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import { getIntegrationConfig } from "@/lib/integrations";

/**
 * True when S3 is configured in this environment. Routes use this to decide
 * between durable S3 storage (production, Amplify) and the local-disk
 * `public/uploads` fallback (local dev). Existing committed files under
 * `public/uploads` keep working in both cases because they are referenced by
 * their committed `/uploads/...` URLs — only NEW uploads change destination.
 */
export async function isS3Configured(): Promise<boolean> {
  const { bucket, region } = await getIntegrationConfig("s3");
  return Boolean(bucket && region);
}

async function client(): Promise<S3Client> {
  const { region, accessKeyId, secretAccessKey, endpoint, forcePathStyle } = await getIntegrationConfig("s3");
  if (!region) {
    throw new Error("Missing S3_REGION.");
  }

  // The SDK resolves credentials through its default chain (env, shared-ini,
  // ECS, IMDS) when explicit access-key env vars are not provided. We only
  // pass explicit credentials when BOTH the key id and secret are present.
  const credentials =
    accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined;

  const options: ConstructorParameters<typeof S3Client>[0] = { region, credentials };

  if (endpoint) options.endpoint = endpoint;
  if (forcePathStyle === "true") options.forcePathStyle = true;

  return new S3Client(options);
}

async function publicUrl(key: string): Promise<string> {
  // Custom CDN/base takes precedence (e.g. a CloudFront domain in front of S3).
  const { publicBase, bucket, region } = await getIntegrationConfig("s3");
  if (publicBase) {
    return `${publicBase.replace(/\/$/, "")}/${key}`;
  }

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
  const { bucket } = await getIntegrationConfig("s3");
  if (!bucket) {
    return { ok: false, error: "Missing S3_BUCKET." };
  }

  try {
    const s3 = await client();
    await s3.send(
      // No ACL is set. The bucket runs with "bucket owner enforced" (ACLs
      // disabled), so sending one is rejected outright. Public readability for
      // site assets comes from a bucket policy scoped to `uploads/*`, which
      // deliberately leaves WhatsApp media under `wa/` private.
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
    const url = await publicUrl(key);
    return { ok: true, url, key };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "S3 PutObject failed.",
    };
  }
}
