-- WhatsApp team inbox. One contact is one ongoing thread, so contacts and
-- conversations are the same row.

CREATE TABLE IF NOT EXISTS `wa_conversations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `wa_id` VARCHAR(20) NOT NULL COMMENT 'Customer phone in wa_id form, e.g. 918961090050',
  `profile_name` VARCHAR(150) DEFAULT NULL,
  `ai_enabled` TINYINT(1) NOT NULL DEFAULT 1,
  `unread_count` INT(11) NOT NULL DEFAULT 0,
  `last_message_at` DATETIME DEFAULT NULL,
  `last_inbound_at` DATETIME DEFAULT NULL COMMENT 'Drives the Meta 24-hour window',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_conversations_wa_id` (`wa_id`),
  KEY `idx_wa_conversations_last_message_at` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `wa_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` INT(11) NOT NULL,
  `wa_message_id` VARCHAR(128) DEFAULT NULL COMMENT 'Meta wamid; unique gives free idempotency on webhook retries',
  `direction` ENUM('in','out') NOT NULL,
  `type` VARCHAR(32) NOT NULL DEFAULT 'text',
  `text_body` TEXT DEFAULT NULL,
  `media_path` VARCHAR(500) DEFAULT NULL,
  `media_mime` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('pending','sent','delivered','read','failed') NOT NULL DEFAULT 'sent',
  `error_text` TEXT DEFAULT NULL,
  `sent_by` INT(11) DEFAULT NULL COMMENT 'admin_users.id for human replies; NULL for inbound and AI',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_messages_wa_message_id` (`wa_message_id`),
  KEY `idx_wa_messages_conversation` (`conversation_id`, `id`),
  CONSTRAINT `fk_wa_messages_conversation`
    FOREIGN KEY (`conversation_id`) REFERENCES `wa_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wa_messages_sent_by`
    FOREIGN KEY (`sent_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
