-- ── Bill Items table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bill_items (
  id INT NOT NULL AUTO_INCREMENT,
  bill_id INT NOT NULL,
  description VARCHAR(500) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  unit_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  display_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_bill_items_bill_id (bill_id),
  CONSTRAINT fk_bill_items_bill FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
);

-- ── Seed billing settings (skip if keys already exist) ───────────────────────
INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES
  ('bill_prefix', 'INV', 'text', 'Prefix for auto-generated bill numbers'),
  ('bill_terms',  'Payment is due within 15 days of the invoice date. Late payments may incur additional charges. Please make payment via bank transfer or UPI as per the details provided on this invoice. For queries, contact us at hello@biznexa.com.', 'textarea', 'Default terms and conditions printed on bills')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
