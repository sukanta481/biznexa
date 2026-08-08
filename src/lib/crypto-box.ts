import "server-only";

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_BYTES = 12;

function key(): Buffer | null {
  const raw = process.env.CREDENTIALS_KEY;
  if (!raw || !/^[a-f0-9]{64}$/i.test(raw)) return null;
  return Buffer.from(raw, "hex");
}

export function isEncryptionConfigured(): boolean {
  return key() !== null;
}

/** Returns "iv:tag:ciphertext", all base64. Throws when the key is absent. */
export function seal(plaintext: string): string {
  const k = key();
  if (!k) throw new Error("CREDENTIALS_KEY is missing or malformed (want 64 hex chars).");

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGO, k, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

/**
 * Returns null on any failure — missing key, wrong key, tampered payload.
 * Callers treat null as "not configured" and fall back to env. Never throws,
 * so a rotated key degrades gracefully instead of taking the app down.
 */
export function open(sealed: string | null): string | null {
  if (!sealed) return null;
  const k = key();
  if (!k) return null;

  const parts = sealed.split(":");
  if (parts.length !== 3) return null;

  try {
    const iv = Buffer.from(parts[0], "base64");
    const tag = Buffer.from(parts[1], "base64");
    const enc = Buffer.from(parts[2], "base64");

    const decipher = createDecipheriv(ALGO, k, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** Masks a secret for display: last 4 characters only. */
export function mask(value: string | null | undefined): string {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return `••••••${value.slice(-4)}`;
}
