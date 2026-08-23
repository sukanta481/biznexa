-- Written with information_schema guards rather than "ADD COLUMN IF NOT EXISTS",
-- which is MariaDB-only syntax. Production runs MySQL 8.4, where that form is a
-- syntax error. This pattern works on both, and is safe to re-run.

SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'author_image'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN author_image TEXT NULL AFTER author'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'service_line'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN service_line VARCHAR(120) NULL AFTER category'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'region'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN region VARCHAR(80) NOT NULL DEFAULT ''Global'' AFTER service_line'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'cover_image_alt'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN cover_image_alt VARCHAR(255) NULL AFTER cover_image'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'seo_title'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN seo_title VARCHAR(255) NULL AFTER published'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND COLUMN_NAME = 'seo_description'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD COLUMN seo_description TEXT NULL AFTER seo_title'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND INDEX_NAME = 'idx_blog_posts_service_line'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD INDEX idx_blog_posts_service_line (service_line)'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @sql := (SELECT IF(
  EXISTS(SELECT 1 FROM information_schema.STATISTICS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'blog_posts' AND INDEX_NAME = 'idx_blog_posts_region'),
  'SELECT 1',
  'ALTER TABLE blog_posts ADD INDEX idx_blog_posts_region (region)'
));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
