-- Documents attached to an inspection file are stored in Google Drive, one
-- folder per file. The folder is created on the first upload, so files with
-- no documents never get an empty folder; its ID is kept here so every later
-- upload and every "Open in Google Drive" link reuses the same folder.
--
-- Guarded with information_schema rather than ADD COLUMN IF NOT EXISTS, which
-- is MariaDB-only and a syntax error on the MySQL 8 used in production.

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'drive_folder_id'),
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN drive_folder_id VARCHAR(128) NULL DEFAULT NULL AFTER notes'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
