-- Migration: add payment_done_date column and update report_status enum
-- Run this in phpMyAdmin > SQL tab

-- 1. Add payment_done_date column (wrapped in condition check)
SET @dbname = DATABASE();
SET @tablename = 'inspection_files';
SET @columnname = 'payment_done_date';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = @columnname) > 0,
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN payment_done_date DATE DEFAULT NULL AFTER paid_to_office_date'
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- 2. Update report_status ENUM to include new options
ALTER TABLE inspection_files
MODIFY COLUMN report_status
ENUM('draft','inspection_done','sent_to_office','hold','final_soft','final_hard')
DEFAULT NULL;