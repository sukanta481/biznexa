-- Reconciles columns that were added by hand to one database but not the
-- other, before the migration runner existed. Every column below already
-- exists in local or in production; this makes both match.
--
-- The one that was actually broken: bills.sent_via_email and email_sent_at
-- are absent in production, and the send-bill-by-email route UPDATEs them
-- unguarded, so emailing a bill failed live with "Unknown column".
--
-- Each change is guarded by an information_schema check rather than
-- ADD COLUMN IF NOT EXISTS, which is MariaDB-only and a syntax error on the
-- MySQL 8.4 in production.

-- ── bills: email and WhatsApp send tracking (missing in production) ─────────
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bills' AND COLUMN_NAME = 'sent_via_email'),
  'SELECT 1',
  'ALTER TABLE bills ADD COLUMN sent_via_email TINYINT(1) NULL DEFAULT 0'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bills' AND COLUMN_NAME = 'email_sent_at'),
  'SELECT 1',
  'ALTER TABLE bills ADD COLUMN email_sent_at DATETIME NULL DEFAULT NULL'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bills' AND COLUMN_NAME = 'sent_via_whatsapp'),
  'SELECT 1',
  'ALTER TABLE bills ADD COLUMN sent_via_whatsapp TINYINT(1) NULL DEFAULT 0'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bills' AND COLUMN_NAME = 'whatsapp_sent_at'),
  'SELECT 1',
  'ALTER TABLE bills ADD COLUMN whatsapp_sent_at DATETIME NULL DEFAULT NULL'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── bill_items: created_at (missing in production) ──────────────────────────
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bill_items' AND COLUMN_NAME = 'created_at'),
  'SELECT 1',
  'ALTER TABLE bill_items ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── projects: banner_url (missing in production) ────────────────────────────
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'banner_url'),
  'SELECT 1',
  'ALTER TABLE projects ADD COLUMN banner_url VARCHAR(255) NULL DEFAULT NULL'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── inspection_files: the three status dates ────────────────────────────────
-- payment_status_date is missing in production; the other two are missing
-- locally. The file routes probe information_schema for these at runtime, so
-- once all three exist everywhere that probing always succeeds.
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'payment_status_date'),
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN payment_status_date DATE NULL DEFAULT NULL AFTER payment_status'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'paid_to_office_date'),
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN paid_to_office_date DATE NULL DEFAULT NULL AFTER paid_to_office'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'payment_done_date'),
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN payment_done_date DATE NULL DEFAULT NULL'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ── case_studies: client_name (missing locally) ─────────────────────────────
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'case_studies' AND COLUMN_NAME = 'client_name'),
  'SELECT 1',
  'ALTER TABLE case_studies ADD COLUMN client_name VARCHAR(255) NULL DEFAULT NULL'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
