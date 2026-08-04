-- Real server-side sessions for the admin panel.
-- Before this table existed, the session cookie carried a user ID that was
-- trusted without verification, so any cookie value authenticated.

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `token_hash` CHAR(64) NOT NULL COMMENT 'SHA-256 of the raw cookie token; raw token is never stored',
  `expires_at` DATETIME NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `ip` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_sessions_token_hash` (`token_hash`),
  KEY `idx_admin_sessions_user_id` (`user_id`),
  KEY `idx_admin_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_admin_sessions_user`
    FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;