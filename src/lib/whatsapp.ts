import "server-only";

const GRAPH_VERSION = "v22.0";

export const WHATSAPP_WINDOW_MS = 24 * 60 * 60 * 1000;

function config() {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error("Missing WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID.");
  }

  return { token, phoneNumberId };
}

function tokenConfig(): string {
  const token = process.env.WHATSAPP_TOKEN;
  if (!token) {
    throw new Error("Missing WHATSAPP_TOKEN.");
  }
  return token;
}

export interface SendResult {
  ok: boolean;
  waMessageId?: string;
  error?: string;
}

/** Sends a plain text message. Only valid inside the 24-hour window. */
export async function sendTextMessage(to: string, body: string): Promise<SendResult> {
  const { token, phoneNumberId } = config();

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: true, body },
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      // Meta nests the useful part at error.message.
      return { ok: false, error: json?.error?.message ?? `Graph API returned ${res.status}` };
    }

    return { ok: true, waMessageId: json?.messages?.[0]?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error calling Graph API" };
  }
}

export interface DownloadMediaResult {
  ok: boolean;
  buffer?: Buffer;
  mimeType?: string;
  error?: string;
}

/**
 * Downloads a WhatsApp media asset. Two Graph calls: GET /{mediaId} for the
 * URL, then GET that URL with the bearer token. Returns the bytes ready to
 * stream onward to S3. WhatsApp media expires from Meta's servers after 30
 * days, so callers must persist the result durably.
 */
export async function downloadMedia(mediaId: string): Promise<DownloadMediaResult> {
  try {
    const token = tokenConfig();

    const metaRes = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${mediaId}`, {
      headers: { authorization: `Bearer ${token}` },
    });

    const metaJson = (await metaRes.json().catch(() => ({}))) as {
      url?: string;
      mime_type?: string;
      error?: { message?: string };
    };

    if (!metaRes.ok || !metaJson.url) {
      return {
        ok: false,
        error: metaJson?.error?.message ?? `Graph media lookup returned ${metaRes.status}`,
      };
    }

    const fileRes = await fetch(metaJson.url, {
      headers: { authorization: `Bearer ${token}` },
    });

    if (!fileRes.ok) {
      return { ok: false, error: `Media download returned ${fileRes.status}` };
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    const mimeType = metaJson.mime_type ?? fileRes.headers.get("content-type") ?? "application/octet-stream";

    return { ok: true, buffer: Buffer.from(arrayBuffer), mimeType };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Network error downloading media" };
  }
}

/** True when a free-form reply is still permitted. */
export function isWithinWindow(lastInboundAt: Date | string | null): boolean {
  if (!lastInboundAt) return false;
  const last = lastInboundAt instanceof Date ? lastInboundAt : new Date(lastInboundAt);
  if (Number.isNaN(last.getTime())) return false;
  return Date.now() - last.getTime() < WHATSAPP_WINDOW_MS;
}
