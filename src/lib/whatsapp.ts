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

/** True when a free-form reply is still permitted. */
export function isWithinWindow(lastInboundAt: Date | string | null): boolean {
  if (!lastInboundAt) return false;
  const last = lastInboundAt instanceof Date ? lastInboundAt : new Date(lastInboundAt);
  if (Number.isNaN(last.getTime())) return false;
  return Date.now() - last.getTime() < WHATSAPP_WINDOW_MS;
}
