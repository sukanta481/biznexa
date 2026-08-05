import "server-only";

import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { query } from "@/lib/db";

export interface ConversationRow extends RowDataPacket {
  id: number;
  wa_id: string;
  profile_name: string | null;
  ai_enabled: number;
  unread_count: number;
  last_message_at: string | null;
  last_inbound_at: string | null;
}

export interface MessageRow extends RowDataPacket {
  id: number;
  conversation_id: number;
  direction: "in" | "out";
  type: string;
  text_body: string | null;
  media_path: string | null;
  media_mime: string | null;
  status: string;
  error_text: string | null;
  sent_by: number | null;
  created_at: string;
}

/** Finds or creates the conversation for a wa_id. Returns its id. */
export async function upsertConversation(waId: string, profileName: string | null): Promise<number> {
  await query<ResultSetHeader>(
    `INSERT INTO wa_conversations (wa_id, profile_name)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
       profile_name = COALESCE(VALUES(profile_name), profile_name)`,
    [waId, profileName],
  );

  const rows = await query<ConversationRow[]>(
    `SELECT id FROM wa_conversations WHERE wa_id = ? LIMIT 1`,
    [waId],
  );

  return rows[0].id;
}

export async function getConversation(id: number): Promise<ConversationRow | null> {
  const rows = await query<ConversationRow[]>(
    `SELECT id, wa_id, profile_name, ai_enabled, unread_count, last_message_at, last_inbound_at
       FROM wa_conversations WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function listConversations(): Promise<Array<ConversationRow & { preview: string | null }>> {
  return query<Array<ConversationRow & { preview: string | null }>>(
    `SELECT c.id, c.wa_id, c.profile_name, c.ai_enabled, c.unread_count,
            c.last_message_at, c.last_inbound_at,
            (SELECT m.text_body FROM wa_messages m
              WHERE m.conversation_id = c.id
              ORDER BY m.id DESC LIMIT 1) AS preview
       FROM wa_conversations c
      ORDER BY c.last_message_at DESC, c.id DESC
      LIMIT 200`,
  );
}

export async function listMessages(conversationId: number, limit = 100): Promise<MessageRow[]> {
  const rows = await query<MessageRow[]>(
    `SELECT id, conversation_id, direction, type, text_body, media_path, media_mime,
            status, error_text, sent_by, created_at
       FROM wa_messages
      WHERE conversation_id = ?
      ORDER BY id DESC
      LIMIT ?`,
    [conversationId, limit],
  );
  return rows.reverse(); // oldest first for display
}

export interface RecordMessageInput {
  conversationId: number;
  waMessageId: string | null;
  direction: "in" | "out";
  type?: string;
  textBody: string | null;
  mediaPath?: string | null;
  mediaMime?: string | null;
  status?: "pending" | "sent" | "delivered" | "read" | "failed";
  errorText?: string | null;
  sentBy?: number | null;
}

/**
 * Inserts a message and updates conversation counters.
 * Returns false when the message was a duplicate (Meta retries webhooks).
 */
export async function recordMessage(input: RecordMessageInput): Promise<boolean> {
  try {
    await query<ResultSetHeader>(
      `INSERT INTO wa_messages
         (conversation_id, wa_message_id, direction, type, text_body,
          media_path, media_mime, status, error_text, sent_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.conversationId,
        input.waMessageId,
        input.direction,
        input.type ?? "text",
        input.textBody,
        input.mediaPath ?? null,
        input.mediaMime ?? null,
        input.status ?? "sent",
        input.errorText ?? null,
        input.sentBy ?? null,
      ],
    );
  } catch (err) {
    // Duplicate wa_message_id means Meta redelivered a webhook we already stored.
    if (err && typeof err === "object" && "code" in err && err.code === "ER_DUP_ENTRY") {
      return false;
    }
    throw err;
  }

  if (input.direction === "in") {
    await query<ResultSetHeader>(
      `UPDATE wa_conversations
          SET last_message_at = NOW(), last_inbound_at = NOW(), unread_count = unread_count + 1
        WHERE id = ?`,
      [input.conversationId],
    );
  } else {
    await query<ResultSetHeader>(
      `UPDATE wa_conversations SET last_message_at = NOW() WHERE id = ?`,
      [input.conversationId],
    );
  }

  return true;
}

export async function setAiEnabled(conversationId: number, enabled: boolean): Promise<void> {
  await query<ResultSetHeader>(
    `UPDATE wa_conversations SET ai_enabled = ? WHERE id = ?`,
    [enabled ? 1 : 0, conversationId],
  );
}

export async function markRead(conversationId: number): Promise<void> {
  await query<ResultSetHeader>(
    `UPDATE wa_conversations SET unread_count = 0 WHERE id = ?`,
    [conversationId],
  );
}
