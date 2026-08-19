-- Public link to the delivered project, shown as a "Visit project" button on
-- the case study page.
ALTER TABLE case_studies
  ADD COLUMN project_url VARCHAR(500) NULL AFTER slug;
