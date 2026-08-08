-- Encrypted third-party credentials. Deliberately NOT the `settings` table:
-- getSiteSettings() returns every row it finds, so a secret there would be
-- sent to the browser.

CREATE TABLE IF NOT EXISTS `integration_credentials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `provider` VARCHAR(50) NOT NULL COMMENT 'whatsapp | smtp | s3',
  `config_json` TEXT DEFAULT NULL COMMENT 'AES-256-GCM ciphertext of the config object',
  `last_verified_at` DATETIME DEFAULT NULL,
  `verify_error` TEXT DEFAULT NULL,
  `updated_by` INT(11) DEFAULT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_integration_credentials_provider` (`provider`),
  CONSTRAINT `fk_integration_credentials_user`
    FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
