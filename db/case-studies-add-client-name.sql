-- Add client_name column for person name in testimonial/quote section
ALTER TABLE case_studies
  ADD COLUMN client_name VARCHAR(255) NULL AFTER client;

-- Update existing rows with placeholder names
UPDATE case_studies SET client_name = '' WHERE client_name IS NULL;
