ALTER TABLE blog_posts
  ADD COLUMN IF NOT EXISTS author_image TEXT NULL AFTER author,
  ADD COLUMN IF NOT EXISTS service_line VARCHAR(120) NULL AFTER category,
  ADD COLUMN IF NOT EXISTS region VARCHAR(80) NOT NULL DEFAULT 'Global' AFTER service_line,
  ADD COLUMN IF NOT EXISTS cover_image_alt VARCHAR(255) NULL AFTER cover_image,
  ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255) NULL AFTER published,
  ADD COLUMN IF NOT EXISTS seo_description TEXT NULL AFTER seo_title,
  ADD INDEX IF NOT EXISTS idx_blog_posts_service_line (service_line),
  ADD INDEX IF NOT EXISTS idx_blog_posts_region (region);