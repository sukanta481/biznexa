INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
  ('site_settings_social', NULL, 'json', 'Site social links')
ON DUPLICATE KEY UPDATE
  setting_type = VALUES(setting_type),
  description = VALUES(description);
