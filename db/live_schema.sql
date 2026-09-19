-- Live schema snapshot: biznexa @ biznexa.ctoemo6e2r0q.ap-south-1.rds.amazonaws.com
-- Taken 2026-09-08 04:12:44 UTC
-- Structure only, no rows. Reference snapshot, NOT a migration.

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------------------------------------------------
-- activity_log  (458 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE `activity_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `table_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `record_id` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=459 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- admin_sessions  (2 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_sessions`;
CREATE TABLE `admin_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 of the raw cookie token; raw token is never stored',
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_sessions_token_hash` (`token_hash`),
  KEY `idx_admin_sessions_user_id` (`user_id`),
  KEY `idx_admin_sessions_expires_at` (`expires_at`),
  CONSTRAINT `fk_admin_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- admin_users  (1 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('super_admin','admin','editor') COLLATE utf8mb4_unicode_ci DEFAULT 'editor',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- ai_agents  (0 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `ai_agents`;
CREATE TABLE `ai_agents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `pricing` decimal(10,2) DEFAULT NULL,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `demo_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `documentation_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive','coming_soon') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  CONSTRAINT `ai_agents_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- bill_items  (22 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `bill_items`;
CREATE TABLE `bill_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_id` int NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `quantity` decimal(10,2) DEFAULT '1.00',
  `unit_price` decimal(12,2) DEFAULT '0.00',
  `total_price` decimal(12,2) DEFAULT '0.00',
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `bill_id` (`bill_id`),
  CONSTRAINT `bill_items_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------------
-- bills  (15 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `bills`;
CREATE TABLE `bills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bill_number` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `client_id` int NOT NULL,
  `bill_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT '0.00',
  `tax_percent` decimal(5,2) DEFAULT '0.00',
  `tax_amount` decimal(12,2) DEFAULT '0.00',
  `discount_amount` decimal(12,2) DEFAULT '0.00',
  `total_amount` decimal(12,2) DEFAULT '0.00',
  `paid_amount` decimal(12,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_general_ci,
  `terms` text COLLATE utf8mb4_general_ci,
  `status` enum('draft','sent','paid','overdue','cancelled') COLLATE utf8mb4_general_ci DEFAULT 'draft',
  `payment_status` enum('unpaid','partial','paid') COLLATE utf8mb4_general_ci DEFAULT 'unpaid',
  `bank_payment_method_id` int DEFAULT NULL,
  `upi_payment_method_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_date` date DEFAULT NULL,
  `payment_method` enum('cash','bank','upi','cheque','other') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_bank_id` int DEFAULT NULL,
  `payment_upi_id` int DEFAULT NULL,
  `payment_reference` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment_notes` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bill_number` (`bill_number`),
  KEY `client_id` (`client_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------------
-- blog_posts  (1 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Sukanta Saha',
  `author_image` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Technology',
  `service_line` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `region` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Global',
  `read_time` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '5 min read',
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `cover_image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int unsigned NOT NULL DEFAULT '0',
  `featured` tinyint(1) NOT NULL DEFAULT '0',
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `seo_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seo_description` text COLLATE utf8mb4_unicode_ci,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_posts_slug` (`slug`),
  KEY `idx_blog_posts_published` (`published`),
  KEY `idx_blog_posts_published_at` (`published_at`),
  KEY `idx_blog_posts_category` (`category`),
  KEY `idx_blog_posts_service_line` (`service_line`),
  KEY `idx_blog_posts_region` (`region`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- case_studies  (5 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `case_studies`;
CREATE TABLE `case_studies` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `project_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `challenge` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `solution` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `results_json` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `technologies_json` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `cover_image` text COLLATE utf8mb4_unicode_ci,
  `cover_image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_quote` text COLLATE utf8mb4_unicode_ci,
  `client_image` text COLLATE utf8mb4_unicode_ci,
  `related_slugs_json` text COLLATE utf8mb4_unicode_ci,
  `published` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_case_studies_slug` (`slug`),
  KEY `idx_case_studies_published` (`published`),
  KEY `idx_case_studies_category` (`category`),
  KEY `idx_case_studies_sort_order` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- clients  (7 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_general_ci,
  `gst_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------------
-- expenses  (51 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` enum('biznexa','inspection','general') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('income','expense') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'expense',
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `expense_date` date NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_expense_date` (`expense_date`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_banks  (5 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_banks`;
CREATE TABLE `inspection_banks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bank_name` (`bank_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_branches  (58 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_branches`;
CREATE TABLE `inspection_branches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bank_id` int NOT NULL,
  `branch_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bank_branch` (`bank_id`,`branch_name`),
  CONSTRAINT `inspection_branches_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `inspection_banks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_file_reports  (4 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_file_reports`;
CREATE TABLE `inspection_file_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_id` int NOT NULL,
  `report_type_id` int DEFAULT NULL,
  `report_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fees` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inspection_file_reports_file` (`file_id`),
  KEY `fk_inspection_file_reports_type` (`report_type_id`),
  CONSTRAINT `fk_inspection_file_reports_file` FOREIGN KEY (`file_id`) REFERENCES `inspection_files` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_inspection_file_reports_type` FOREIGN KEY (`report_type_id`) REFERENCES `inspection_report_types` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_files  (188 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_files`;
CREATE TABLE `inspection_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_date` date DEFAULT NULL,
  `file_type` enum('office','self') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` enum('kolkata','out_of_kolkata') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `property_address` text COLLATE utf8mb4_unicode_ci,
  `property_value` decimal(15,2) DEFAULT NULL,
  `bank_id` int DEFAULT NULL,
  `branch_id` int DEFAULT NULL,
  `source_id` int DEFAULT NULL,
  `fees` decimal(10,2) DEFAULT NULL,
  `addon_fees` decimal(10,2) NOT NULL DEFAULT '0.00',
  `report_status` enum('draft','inspection_done','sent_to_office','hold','final_soft','final_hard') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `report_status_date` date DEFAULT NULL,
  `payment_mode_id` int DEFAULT NULL,
  `payment_status` enum('due','paid','partially') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `paid_to_office` enum('paid','due') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_to_office_date` date DEFAULT NULL,
  `payment_done_date` date DEFAULT NULL,
  `office_amount` decimal(10,2) DEFAULT NULL,
  `commission` decimal(10,2) DEFAULT '0.00',
  `extra_amount` decimal(10,2) DEFAULT '0.00',
  `gross_amount` decimal(10,2) DEFAULT '0.00',
  `received_account_id` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_file_number` (`file_number`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_bank_id` (`bank_id`),
  KEY `idx_source_id` (`source_id`),
  KEY `idx_file_date` (`file_date`),
  KEY `branch_id` (`branch_id`),
  KEY `payment_mode_id` (`payment_mode_id`),
  KEY `received_account_id` (`received_account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=288 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_my_accounts  (1 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_my_accounts`;
CREATE TABLE `inspection_my_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bank_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ifsc_code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_payment_modes  (5 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_payment_modes`;
CREATE TABLE `inspection_payment_modes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mode_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mode_name` (`mode_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_report_types  (3 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_report_types`;
CREATE TABLE `inspection_report_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_inspection_report_types_name` (`report_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- inspection_sources  (40 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `inspection_sources`;
CREATE TABLE `inspection_sources` (
  `id` int NOT NULL AUTO_INCREMENT,
  `source_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_source_name` (`source_name`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- integration_credentials  (2 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `integration_credentials`;
CREATE TABLE `integration_credentials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'whatsapp | smtp | s3',
  `config_json` text COLLATE utf8mb4_unicode_ci COMMENT 'AES-256-GCM ciphertext of the config object',
  `last_verified_at` datetime DEFAULT NULL,
  `verify_error` text COLLATE utf8mb4_unicode_ci,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_integration_credentials_provider` (`provider`),
  KEY `fk_integration_credentials_user` (`updated_by`),
  CONSTRAINT `fk_integration_credentials_user` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- leads  (11 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `budget_range` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'website',
  `status` enum('new','contacted','qualified','proposal_sent','won','lost') COLLATE utf8mb4_unicode_ci DEFAULT 'new',
  `priority` enum('low','medium','high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `assigned_to` int DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- payment_methods  (2 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `payment_methods`;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('bank','upi') COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `bank_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_holder` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `account_number` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ifsc_code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `branch_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `upi_id` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `qr_code_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `display_order` int DEFAULT '0',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------------
-- projects  (1 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `technologies` text COLLATE utf8mb4_unicode_ci,
  `completion_date` date DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `featured` tinyint(1) DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- schema_migrations  (15 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `schema_migrations`;
CREATE TABLE `schema_migrations` (
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- services  (6 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `services`;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `short_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_description` longtext COLLATE utf8mb4_unicode_ci,
  `icon` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `features` text COLLATE utf8mb4_unicode_ci,
  `pricing_info` text COLLATE utf8mb4_unicode_ci,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_status` (`status`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- settings  (45 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`),
  KEY `idx_setting_key` (`setting_key`),
  CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- technologies  (7 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `technologies`;
CREATE TABLE `technologies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `icon` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `color` varchar(20) COLLATE utf8mb4_general_ci DEFAULT '#333333',
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------------------------------------------------
-- testimonials  (2 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_position` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `client_company` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `testimonial` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int DEFAULT '5',
  `client_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_id` int DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- wa_conversations  (0 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `wa_conversations`;
CREATE TABLE `wa_conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wa_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Customer phone in wa_id form, e.g. 918961090050',
  `profile_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ai_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `unread_count` int NOT NULL DEFAULT '0',
  `last_message_at` datetime DEFAULT NULL,
  `last_inbound_at` datetime DEFAULT NULL COMMENT 'Drives the Meta 24-hour window',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_conversations_wa_id` (`wa_id`),
  KEY `idx_wa_conversations_last_message_at` (`last_message_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- wa_messages  (0 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `wa_messages`;
CREATE TABLE `wa_messages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `wa_message_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Meta wamid; unique gives free idempotency on webhook retries',
  `direction` enum('in','out') COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'text',
  `text_body` text COLLATE utf8mb4_unicode_ci,
  `media_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media_mime` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pending','sent','delivered','read','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'sent',
  `error_text` text COLLATE utf8mb4_unicode_ci,
  `sent_by` int DEFAULT NULL COMMENT 'admin_users.id for human replies; NULL for inbound and AI',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wa_messages_wa_message_id` (`wa_message_id`),
  KEY `idx_wa_messages_conversation` (`conversation_id`,`id`),
  KEY `fk_wa_messages_sent_by` (`sent_by`),
  CONSTRAINT `fk_wa_messages_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `wa_conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wa_messages_sent_by` FOREIGN KEY (`sent_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------
-- website_content  (0 rows)
-- ----------------------------------------------------------------------
DROP TABLE IF EXISTS `website_content`;
CREATE TABLE `website_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` text COLLATE utf8mb4_unicode_ci,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_section` (`section`),
  KEY `idx_status` (`status`),
  CONSTRAINT `website_content_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
