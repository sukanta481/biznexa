-- Add-on reports for inspection files: extra deliverables (structural
-- certificate, estimate, rental certificate, ...) each carrying their own fee.
--
-- Applies to self files only. For those, commission and the office share are
-- computed from the base fee plus the add-on fees, keeping the existing 30/70
-- split. Office files are paid a flat commission and are unaffected.

CREATE TABLE IF NOT EXISTS `inspection_report_types` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `report_name` VARCHAR(150) NOT NULL,
  `status` ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inspection_report_types_name` (`report_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `inspection_report_types` (`report_name`) VALUES
  ('Structural Certificate'),
  ('Estimate'),
  ('Rental Certificate');

-- One row per add-on report attached to a file. report_type_id is kept
-- nullable with ON DELETE SET NULL so retiring a report type never destroys
-- the financial history of files that used it; report_name preserves what it
-- was called at the time.
CREATE TABLE IF NOT EXISTS `inspection_file_reports` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `file_id` INT(11) NOT NULL,
  `report_type_id` INT(11) DEFAULT NULL,
  `report_name` VARCHAR(150) NOT NULL,
  `fees` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inspection_file_reports_file` (`file_id`),
  CONSTRAINT `fk_inspection_file_reports_file`
    FOREIGN KEY (`file_id`) REFERENCES `inspection_files` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inspection_file_reports_type`
    FOREIGN KEY (`report_type_id`) REFERENCES `inspection_report_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Denormalised sum of the rows above, so listing and export queries do not
-- need a join. `fees` keeps its existing meaning: the base inspection fee.
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'inspection_files' AND COLUMN_NAME = 'addon_fees'),
  'SELECT 1',
  'ALTER TABLE inspection_files ADD COLUMN addon_fees DECIMAL(10,2) NOT NULL DEFAULT 0.00 AFTER fees'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
