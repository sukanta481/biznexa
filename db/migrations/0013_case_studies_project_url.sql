-- Public link to the delivered project, shown as a "Visit project" button on
-- the case study page.
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'case_studies' AND COLUMN_NAME = 'project_url'),
  'SELECT 1',
  'ALTER TABLE case_studies ADD COLUMN project_url VARCHAR(500) NULL AFTER slug'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
