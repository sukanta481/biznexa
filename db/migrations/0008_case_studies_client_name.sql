-- Person name for the testimonial, distinct from the client company.
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'case_studies' AND COLUMN_NAME = 'client_name'),
  'SELECT 1',
  'ALTER TABLE case_studies ADD COLUMN client_name VARCHAR(255) NULL AFTER client'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

UPDATE case_studies SET client_name = '' WHERE client_name IS NULL;
