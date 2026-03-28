INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
  ('about_hero', NULL, 'json', 'About page hero content'),
  ('about_leadership', NULL, 'json', 'About page leadership section'),
  ('about_pillars', NULL, 'json', 'About page strategic pillars'),
  ('about_cta', NULL, 'json', 'About page CTA section')
ON DUPLICATE KEY UPDATE
  setting_type = VALUES(setting_type),
  description = VALUES(description);