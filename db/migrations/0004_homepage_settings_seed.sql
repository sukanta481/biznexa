CREATE TABLE IF NOT EXISTS settings (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NULL,
  setting_type VARCHAR(50) NOT NULL DEFAULT 'text',
  description TEXT NULL,
  updated_by INT UNSIGNED NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_settings_setting_key (setting_key),
  KEY idx_settings_setting_key (setting_key)
);

INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
  ('homepage_hero', NULL, 'json', 'Homepage hero content'),
  ('homepage_stats', NULL, 'json', 'Homepage stat cards'),
  ('homepage_services_intro', NULL, 'json', 'Homepage services section intro'),
  ('homepage_services', NULL, 'json', 'Homepage service cards'),
  ('homepage_global_reach', NULL, 'json', 'Homepage global reach section'),
  ('homepage_testimonials_intro', NULL, 'json', 'Homepage testimonials intro'),
  ('homepage_testimonials', NULL, 'json', 'Homepage testimonials'),
  ('homepage_faq_intro', NULL, 'json', 'Homepage FAQ intro'),
  ('homepage_faqs', NULL, 'json', 'Homepage FAQ entries'),
  ('homepage_cta', NULL, 'json', 'Homepage CTA section')
ON DUPLICATE KEY UPDATE
  setting_type = VALUES(setting_type),
  description = VALUES(description);
