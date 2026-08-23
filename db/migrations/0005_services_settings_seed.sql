INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
  ('services_hero', NULL, 'json', 'Services hero content'),
  ('services_workflow', NULL, 'json', 'Services workflow content'),
  ('services_mobile_cards', NULL, 'json', 'Services mobile cards'),
  ('services_desktop_sidebar', NULL, 'json', 'Services desktop sidebar'),
  ('services_desktop_cards', NULL, 'json', 'Services desktop cards'),
  ('services_cta', NULL, 'json', 'Services CTA section')
ON DUPLICATE KEY UPDATE
  setting_type = VALUES(setting_type),
  description = VALUES(description);
