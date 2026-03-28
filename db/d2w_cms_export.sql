-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: d2w_cms
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` VALUES (1,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-19 19:37:39'),(2,1,'update','admin_users',1,'Updated profile','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 12:49:20'),(3,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 12:49:55'),(4,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 12:49:58'),(5,1,'update','leads',1,'Updated lead status to contacted','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 12:56:39'),(6,1,'create','projects',1,'Created project: North Super Fast Service - Complete Logistics Management System','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 13:13:32'),(7,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 13:46:33'),(8,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 17:35:59'),(9,1,'update','settings',NULL,'Updated site settings','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36','2025-11-21 18:19:05'),(10,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-03 11:08:36'),(11,1,'create','projects',2,'Created project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-03 11:20:52'),(12,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 08:47:00'),(13,1,'update','projects',2,'Updated project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 08:47:33'),(14,1,'update','projects',2,'Updated project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 08:47:44'),(15,1,'update','projects',2,'Updated project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 08:58:54'),(16,1,'update','projects',2,'Updated project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 09:00:55'),(17,1,'update','projects',2,'Updated project: Realto CRM','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 09:01:06'),(18,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-05 10:32:46'),(19,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36','2026-01-12 07:36:50'),(20,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:00:24'),(21,1,'create','clients',1,'Created client: Suman Kundu','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:08:02'),(22,1,'create','bills',1,'Created bill: INV-2026-0001','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:10:44'),(23,1,'update','admin_users',1,'Updated profile','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:13:36'),(24,1,'create','payment_methods',1,'Added bank account: Slice Cur','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:27:33'),(25,1,'create','payment_methods',2,'Added UPI: Slice','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:30:37'),(26,1,'create','bills',2,'Created bill: INV-2026-0002','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:31:08'),(27,1,'create','bills',3,'Created bill: INV-2026-0003','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:50:01'),(28,1,'create','bills',4,'Created bill: INV-2026-0004','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 05:50:26'),(29,1,'delete','bills',1,'Deleted bill','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:01:19'),(30,1,'delete','bills',2,'Deleted bill','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:01:24'),(31,1,'delete','bills',3,'Deleted bill','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:01:27'),(32,1,'delete','bills',4,'Deleted bill','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:01:47'),(33,1,'create','bills',5,'Created bill: INV-2026-0001','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:03:07'),(34,1,'update','admin_users',1,'Updated profile','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:08:22'),(35,1,'update','bills',5,'Updated bill','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:19:57'),(36,1,'update','clients',1,'Updated client: Suman Kundu','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 06:22:32'),(37,1,'update','settings',NULL,'Updated site settings','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-01-24 08:01:53'),(38,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 04:17:13'),(39,1,'update','bills',5,'Recorded payment of ₹2,000.00 (Cash)','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 04:20:43'),(40,1,'delete','leads',1,'Deleted lead','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36','2026-02-03 04:28:05'),(41,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 12:20:36'),(42,1,'update','settings',NULL,'Updated site settings','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-17 14:48:20'),(43,1,'create','inspection_banks',1,'Added bank: Bank of India','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:13:16'),(44,1,'create','inspection_banks',3,'Added bank: Bank of Baroda','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:13:38'),(45,1,'create','inspection_branches',1,'Added branch: Southern Avn','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:13:52'),(46,1,'create','inspection_branches',2,'Added branch: Baghajatin','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:14:07'),(47,1,'create','inspection_branches',3,'Added branch: Park Circus','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:14:23'),(48,1,'create','inspection_branches',4,'Added branch: Michal Nagar','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:14:37'),(49,1,'create','inspection_sources',1,'Added source: Ayon Adhikari Southarn Manager BOI','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:17:21'),(50,1,'create','inspection_files',1,'Created file INS-2026-0001','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:56:26'),(51,1,'update','inspection_files',1,'Updated file','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 17:58:35'),(52,1,'create','inspection_banks',4,'Added bank: PNB','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 18:16:20'),(53,1,'create','inspection_banks',5,'Added bank: SBI','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 18:16:26'),(54,1,'create',NULL,NULL,'Bulk imported 21 branches','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:00:48'),(55,1,'create',NULL,NULL,'Bulk imported 27 sources','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:06:06'),(56,1,'create','inspection_my_accounts',1,'Added account: Sukanta Saha','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:14:28'),(57,1,'create','inspection_branches',31,'Added branch: Garden Reach','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:25:03'),(58,1,'create','inspection_files',NULL,'Bulk imported 70 inspection files','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:27:58'),(59,1,'update','inspection_files',617,'Updated file','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-18 19:33:09'),(60,1,'create','inspection_files',633,'Created file INS-2026-0072','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-19 04:47:28'),(61,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-20 14:58:56'),(62,1,'update','settings',NULL,'Updated site settings','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-21 18:22:27'),(63,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 06:23:01'),(64,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 06:23:13'),(65,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 06:24:19'),(66,1,'create','expenses',1,'Added expense: Hostinger for 1 month renewal','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 06:26:16'),(67,1,'create','expenses',2,'Added expense: Claude Subscription','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 06:27:08'),(68,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:15:30'),(69,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:15:48'),(70,1,'login',NULL,NULL,'User logged in','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:16:08'),(71,1,'create','expenses',3,'Added income: Rapido','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:17:07'),(72,1,'create','expenses',4,'Added expense: Grocary','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:17:50'),(73,1,'create','expenses',5,'Added expense: Outing','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-22 07:18:15'),(74,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-23 17:36:43'),(75,1,'logout',NULL,NULL,'User logged out','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','2026-03-26 17:28:15');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `role` enum('super_admin','admin','editor') DEFAULT 'editor',
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `last_login` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'admin','biznexa.tech@gmail.com','$2y$10$Hq0/o8u1IuNtIsqU9uJpKuzS9yX3vLERtDT2AWOp7IdgAhNoUriJa','Sukanta Saha','super_admin','','active','2026-03-22 12:46:08','2025-11-19 19:33:57','2026-03-22 07:16:08');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ai_agents`
--

DROP TABLE IF EXISTS `ai_agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_agents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `features` text DEFAULT NULL,
  `pricing` decimal(10,2) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `demo_url` varchar(255) DEFAULT NULL,
  `documentation_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive','coming_soon') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  CONSTRAINT `ai_agents_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_agents`
--

LOCK TABLES `ai_agents` WRITE;
/*!40000 ALTER TABLE `ai_agents` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_items`
--

DROP TABLE IF EXISTS `bill_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` decimal(10,2) DEFAULT 1.00,
  `unit_price` decimal(12,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_bill_id` (`bill_id`),
  CONSTRAINT `bill_items_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_items`
--

LOCK TABLES `bill_items` WRITE;
/*!40000 ALTER TABLE `bill_items` DISABLE KEYS */;
INSERT INTO `bill_items` VALUES (15,5,'Realto CRM Setup & Configuration',1.00,2000.00,2000.00,0,'2026-01-24 06:19:57'),(16,5,'Website Frontend Design (Multi Page)',1.00,3500.00,3500.00,1,'2026-01-24 06:19:57'),(17,5,'1-Year Server Hosting (First Year Free)',1.00,0.00,0.00,2,'2026-01-24 06:19:57'),(18,5,'Domain Mapping Setup',1.00,0.00,0.00,3,'2026-01-24 06:19:57');
/*!40000 ALTER TABLE `bill_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_number` varchar(50) NOT NULL,
  `client_id` int(11) NOT NULL,
  `bill_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `subtotal` decimal(12,2) DEFAULT 0.00,
  `tax_percent` decimal(5,2) DEFAULT 18.00,
  `tax_amount` decimal(12,2) DEFAULT 0.00,
  `discount_amount` decimal(12,2) DEFAULT 0.00,
  `total_amount` decimal(12,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `terms` text DEFAULT NULL,
  `bank_payment_method_id` int(11) DEFAULT NULL,
  `upi_payment_method_id` int(11) DEFAULT NULL,
  `status` enum('draft','sent','paid','overdue','cancelled') DEFAULT 'draft',
  `payment_status` enum('unpaid','partial','paid') DEFAULT 'unpaid',
  `paid_amount` decimal(12,2) DEFAULT 0.00,
  `payment_date` date DEFAULT NULL,
  `sent_via_email` tinyint(1) DEFAULT 0,
  `sent_via_whatsapp` tinyint(1) DEFAULT 0,
  `email_sent_at` datetime DEFAULT NULL,
  `whatsapp_sent_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` enum('cash','bank','upi','cheque','other') DEFAULT NULL,
  `payment_bank_id` int(11) DEFAULT NULL,
  `payment_upi_id` int(11) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `payment_notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bill_number` (`bill_number`),
  KEY `created_by` (`created_by`),
  KEY `idx_bill_number` (`bill_number`),
  KEY `idx_client_id` (`client_id`),
  KEY `idx_status` (`status`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_bill_date` (`bill_date`),
  KEY `idx_due_date` (`due_date`),
  KEY `fk_bills_bank_payment` (`bank_payment_method_id`),
  KEY `fk_bills_upi_payment` (`upi_payment_method_id`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bills_bank_payment` FOREIGN KEY (`bank_payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bills_upi_payment` FOREIGN KEY (`upi_payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (5,'INV-2026-0001',1,'2026-01-24','2026-02-08',5500.00,0.00,0.00,0.00,5500.00,'','Payment is due within 15 days of the invoice date. Late payments may be subject to a fee.',1,2,'sent','partial',2000.00,'2026-02-03',0,0,NULL,NULL,1,'2026-01-24 06:03:07','2026-02-03 04:20:43','cash',NULL,NULL,'In personal account','');
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `blog_posts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` longtext NOT NULL,
  `author` varchar(150) NOT NULL DEFAULT 'Sukanta Saha',
  `author_image` text DEFAULT NULL,
  `category` varchar(120) NOT NULL DEFAULT 'Technology',
  `service_line` varchar(120) DEFAULT NULL,
  `region` varchar(80) NOT NULL DEFAULT 'Global',
  `read_time` varchar(50) NOT NULL DEFAULT '5 min read',
  `cover_image` text DEFAULT NULL,
  `cover_image_alt` varchar(255) DEFAULT NULL,
  `views` int(10) unsigned NOT NULL DEFAULT 0,
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `published` tinyint(1) NOT NULL DEFAULT 1,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_posts_slug` (`slug`),
  KEY `idx_blog_posts_published` (`published`),
  KEY `idx_blog_posts_published_at` (`published_at`),
  KEY `idx_blog_posts_category` (`category`),
  KEY `idx_blog_posts_service_line` (`service_line`),
  KEY `idx_blog_posts_region` (`region`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
/*!40000 ALTER TABLE `blog_posts` DISABLE KEYS */;
INSERT INTO `blog_posts` VALUES (1,'google-stitch-ai-ui-design-modern-revolution-2026','Google Stitch Just Changed How We Design UIs — Here\'s What Actually Matters','Google Stitch went from a basic text-to-UI demo to a full AI design canvas with voice commands, instant prototyping, and portable design systems. I break down what works, what doesn\'t, and why designers should pay attention.','Google Stitch Just Changed How We Design UIs — Here\'s What Actually Matters\nTen months ago, Google showed off a tool called Stitch at I/O 2025. It could take a text prompt and spit out a UI mockup. Neat demo, mild applause, everyone moved on.\nThen something happened. People actually started using it. Designers, developers, product managers, solo founders with zero design skills. The feedback piled up, Google listened, and on March 19, 2026, they released an update that turned a tech demo into something worth rethinking your workflow around.\nI\'ve been spending time with the new version, and I want to walk through what\'s changed, what works, what still falls short, and who should actually care.\nWhat Stitch Actually Is Now\nThe original Stitch was a single-screen generator. You typed a description, it gave you a layout. Useful for quick mockups, but limited.\nThe March 2026 version is a different product. Google rebuilt it around what they call an \"AI-native infinite canvas\" — basically a workspace where you can throw in images, text, code snippets, and voice commands, and the AI agent processes all of it as context for your design.\nPowered by Gemini models (2.5 Flash for speed, 2.5 Pro for fidelity, and Gemini 3 for the best contextual understanding), Stitch now generates up to five interconnected screens at once. You can describe an entire app flow in plain English and get back a clickable prototype in minutes.\nIt\'s free. No subscriptions, no credit card. 550 generations a month — 350 in standard mode, 200 in the higher-fidelity pro mode. Google will probably introduce paid plans by late 2026, but right now the whole thing costs nothing.\nFive Features That Actually Matter\n1. Voice Canvas\nThis is the one that surprised me. You click the microphone icon and just talk. \"Make the hero section feel more energetic. Bigger headline. Add a product screenshot next to the CTA.\" Stitch processes it and updates in real time.\nIt also gives design critiques when you ask. Say \"what\'s wrong with this layout?\" and it\'ll point out issues. It\'s not always right, and it tends toward generic advice, but as a rubber duck for design decisions, it\'s faster than typing follow-up prompts.\nThe voice system handles multiple requests at once, which means you can layer commands without waiting. That\'s the difference between a gimmick and a tool you\'d actually use during a working session.\n2. Vibe Design\nThis is Google\'s term for describing a feeling instead of specifying components. Instead of \"create a dashboard with a sidebar, header, and kanban board,\" you say something like \"I want a project management tool that feels calm and organized, aimed at small creative teams.\"\nStitch then generates several design directions that match that vibe. You pick one, refine it, keep going. The idea is that you explore ten directions in the time it takes to wireframe one.\nI\'m mixed on this. When it works, it genuinely surfaces ideas I wouldn\'t have reached on my own. When it doesn\'t, you get bland, corporate-looking screens that could be for any SaaS product ever made. The quality depends heavily on how specific your prompt is, which kind of defeats the purpose of \"vibe\" over precision.\n3. Instant Prototyping\nThis one is straightforward and useful. You connect screens together, hit Play, and click through an interactive prototype. Stitch can also auto-generate the next logical screen based on where you click — tap the \"Sign Up\" button and it builds the confirmation page.\nFor client presentations, user testing, or just validating whether a flow makes sense before you commit to building it, this saves real time. The transitions are basic, but functional.\n4. DESIGN.md and Design System Import\nThis might be the most significant feature for anyone working across projects. DESIGN.md is a markdown file that captures your design rules — colors, typography, spacing, component patterns — in a format that both humans and AI agents can read.\nYou can extract a design system from any URL, export it from one Stitch project, and import it into another. Or pass it to a coding tool like AI Studio or Antigravity so your developers are working from the same rules.\nThe practical impact: you design something once, and the rules follow you everywhere. For agencies and freelancers juggling multiple client projects, this solves a real consistency problem.\n5. MCP Server and Developer Pipeline\nStitch now ships with a Model Context Protocol server and SDK. In non-jargon terms: you can connect it to coding tools like Gemini CLI, Claude Code, Cursor, or Google\'s own Antigravity.\nThis means your design doesn\'t have to live in Stitch forever. It can flow into your development environment with the context intact. The Stitch Skills library on GitHub has already picked up over 2,400 stars, which tells you developers are paying attention.\nFor the design-to-code pipeline, this is where Stitch starts looking less like a prototyping tool and more like a node in a larger workflow.\nWhere It Falls Short\nI don\'t want to oversell this. Stitch has real limitations.\nThe generated designs are inconsistent. Components don\'t always align. Colors sometimes drift from what you specified. Complex multi-screen flows need manual cleanup before they\'re presentable to anyone with design standards. The March update added direct editing — you can click text elements and rewrite them, swap images, tweak spacing — but you\'ll use that feature more than you\'d expect.\nImage input is still unreliable. Despite claiming to support sketch uploads, the results vary wildly. Hand-drawn wireframes sometimes get interpreted correctly, sometimes get ignored entirely. If you\'re counting on the image-to-UI pipeline, test it before you promise a client anything.\nThere\'s no backend logic. Stitch generates frontend code — HTML, CSS, and some component structure. It won\'t build your API, handle state management, or connect to a database. It\'s a design and prototyping tool, not a full app builder.\nAnd the big one: design system management at scale is still Figma\'s territory. Stitch can import and export design rules, but it doesn\'t have the collaboration depth, version control maturity, or plugin ecosystem that large teams depend on.\nWho Should Actually Use This\nDevelopers who need UI mockups but don\'t want to learn Figma. Stitch generates code you can work with, and the export pipeline means you\'re not stuck in another design tool.\nProduct managers who need to show, not tell. Instead of writing a feature spec and hoping everyone imagines the same thing, generate a clickable prototype in Stitch and share it. The voice canvas is particularly good here — you can talk through a product vision and watch it take shape.\nFounders and solo builders who need to validate ideas fast. Go from concept to interactive prototype in an afternoon. Test it with users, iterate, and figure out if the idea has legs before you hire a designer or write production code.\nDesigners who want to speed up early exploration. Stitch isn\'t replacing your Figma workflow for production design. But for the first hour of a project — when you\'re trying to get past the blank canvas and explore directions — it\'s genuinely faster than starting from scratch.\nWhat This Means for UI Design Going Forward\nFigma\'s stock dropped over 4% when the March update launched. That reaction feels premature — Figma is still the better tool for production design work — but it tells you something about where people think the industry is heading.\nThe shift isn\'t from \"manual tools\" to \"AI tools.\" It\'s from designing interfaces to briefing agents. In traditional tools, every input is a precise action: draw this box, set this color, align these layers. In Stitch, the input is intent. You describe what you want, and the AI interprets it.\nThat\'s a different skill set. Knowing how to prompt effectively, how to evaluate generated output, how to steer an AI agent toward the result you want — these are becoming design skills as real as knowing how to kern type or balance a layout.\nThe DESIGN.md format is worth watching closely. A design system that travels between tools as a readable markdown file, understood by both humans and AI agents, is a fundamentally different object than a Figma library with documentation. If your design system can\'t be read by a machine in 2026, it\'s already behind.\nTry It While It\'s Free\nGoogle Stitch is at stitch.withgoogle.com. No signup beyond a Google account. The 550 monthly generations are generous, and they\'ll almost certainly shrink when paid plans arrive.\nMy advice: don\'t try to replace your existing tools with it. Use it for what it\'s best at — getting from nothing to something, fast. Explore ideas you wouldn\'t have time to mock up manually. Feed it weird prompts and see what comes back. That\'s where the value is right now.\nThe tool will get better. The question for designers and developers isn\'t whether AI design tools will matter. It\'s whether you\'ll have spent enough time with them to know how to use them well when they do.\n','Sukanta Saha','/uploads/1774642464314-whatsapp_image_2026-03-26_at_11.37.56.jpeg','Web Development','Web Dev','Global','5 min read','/uploads/1774642455920-google_stitch_blog_cover_image.svg','Google Stitch AI design canvas showing multiple UI screens generated from text prompts',0,0,1,'Google Stitch: AI UI Design Tool That\'s Reshaping Modern Interface Design (2026)','Google Stitch turns text prompts, sketches, and voice commands into production-ready UI designs with code export. Free tool with 550 generations/month. Full breakdown of features, limitations, and real-world use. (212 characters)','2026-03-27 04:42:00','2026-03-27 20:25:41','2026-03-27 20:25:41');
/*!40000 ALTER TABLE `blog_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `gst_number` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Suman Kundu','','8910821105','Kalpaink','Kolkata','','active',1,'2026-01-24 05:08:02','2026-01-24 06:22:32');
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` enum('biznexa','inspection','general') NOT NULL,
  `type` enum('income','expense') NOT NULL DEFAULT 'expense',
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `expense_date` date NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_expense_date` (`expense_date`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,'biznexa','expense','Hostinger for 1 month renewal','from apr 1 to 30 will valid',859.00,'2026-03-22',1,'2026-03-22 06:26:16','2026-03-22 06:26:16'),(2,'biznexa','expense','Claude Subscription',NULL,2000.00,'2026-02-22',1,'2026-03-22 06:27:08','2026-03-22 06:27:08'),(3,'general','income','Rapido',NULL,155.00,'2026-03-21',1,'2026-03-22 07:17:07','2026-03-22 07:17:07'),(4,'general','expense','Grocary',NULL,283.00,'2026-03-21',1,'2026-03-22 07:17:50','2026-03-22 07:17:50'),(5,'general','expense','Outing',NULL,125.00,'2026-03-21',1,'2026-03-22 07:18:15','2026-03-22 07:18:15');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_banks`
--

DROP TABLE IF EXISTS `inspection_banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_banks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(150) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bank_name` (`bank_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_banks`
--

LOCK TABLES `inspection_banks` WRITE;
/*!40000 ALTER TABLE `inspection_banks` DISABLE KEYS */;
INSERT INTO `inspection_banks` VALUES (1,'Bank of India','active','2026-03-18 17:13:16','2026-03-18 17:13:16'),(3,'Bank of Baroda','active','2026-03-18 17:13:38','2026-03-18 17:13:38'),(4,'PNB','active','2026-03-18 18:16:20','2026-03-18 18:16:20'),(5,'SBI','active','2026-03-18 18:16:26','2026-03-18 18:16:26');
/*!40000 ALTER TABLE `inspection_banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_branches`
--

DROP TABLE IF EXISTS `inspection_branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_branches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bank_id` int(11) NOT NULL,
  `branch_name` varchar(150) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_bank_branch` (`bank_id`,`branch_name`),
  CONSTRAINT `inspection_branches_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `inspection_banks` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_branches`
--

LOCK TABLES `inspection_branches` WRITE;
/*!40000 ALTER TABLE `inspection_branches` DISABLE KEYS */;
INSERT INTO `inspection_branches` VALUES (1,1,'Southern Avn','active','2026-03-18 17:13:52','2026-03-18 17:13:52'),(2,1,'Baghajatin','active','2026-03-18 17:14:07','2026-03-18 17:14:07'),(3,3,'Park Circus','active','2026-03-18 17:14:23','2026-03-18 17:14:23'),(4,1,'Michal Nagar','active','2026-03-18 17:14:37','2026-03-18 17:14:37'),(5,4,'CA SALTLAKE','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(6,1,'RBC SALTLAKE','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(7,1,'Moulali','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(8,1,'Biswa Bangla Sarani','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(9,1,'Kalyani','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(10,1,'Krishnanagar','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(11,5,'Malda','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(12,5,'Kanktia','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(13,1,'Bhupen Bose Avn','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(14,1,'Bagha Jatin','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(15,5,'Bardwan','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(16,1,'Kaikhali','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(17,1,'Sec 5','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(18,1,'Bongaon','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(19,1,'Madhyamgram','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(20,1,'Highland Park','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(21,1,'Anandapur','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(22,1,'Biswa Bangla','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(23,1,'Bidhannagar','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(24,1,'Dum Dum','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(25,5,'RACPC Kolkata','active','2026-03-18 19:00:48','2026-03-18 19:00:48'),(31,1,'Garden Reach','active','2026-03-18 19:25:03','2026-03-18 19:25:03');
/*!40000 ALTER TABLE `inspection_branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_files`
--

DROP TABLE IF EXISTS `inspection_files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_number` varchar(20) NOT NULL,
  `file_date` date DEFAULT NULL,
  `file_type` enum('office','self') DEFAULT NULL,
  `location` enum('kolkata','out_of_kolkata') DEFAULT NULL,
  `customer_name` varchar(150) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `property_address` text DEFAULT NULL,
  `property_value` decimal(15,2) DEFAULT NULL,
  `bank_id` int(11) DEFAULT NULL,
  `branch_id` int(11) DEFAULT NULL,
  `source_id` int(11) DEFAULT NULL,
  `fees` decimal(10,2) DEFAULT NULL,
  `report_status` enum('draft','final_soft','final_hard') DEFAULT NULL,
  `report_status_date` date DEFAULT NULL,
  `payment_mode_id` int(11) DEFAULT NULL,
  `payment_status` enum('due','paid','partially') DEFAULT NULL,
  `payment_status_date` date DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `paid_to_office` enum('paid','due') DEFAULT NULL,
  `office_amount` decimal(10,2) DEFAULT NULL,
  `commission` decimal(10,2) DEFAULT 0.00,
  `extra_amount` decimal(10,2) DEFAULT 0.00,
  `gross_amount` decimal(10,2) DEFAULT 0.00,
  `received_account_id` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_file_number` (`file_number`),
  KEY `idx_file_type` (`file_type`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_bank_id` (`bank_id`),
  KEY `idx_source_id` (`source_id`),
  KEY `idx_file_date` (`file_date`),
  KEY `branch_id` (`branch_id`),
  KEY `payment_mode_id` (`payment_mode_id`),
  KEY `received_account_id` (`received_account_id`),
  CONSTRAINT `inspection_files_ibfk_1` FOREIGN KEY (`bank_id`) REFERENCES `inspection_banks` (`id`),
  CONSTRAINT `inspection_files_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `inspection_branches` (`id`),
  CONSTRAINT `inspection_files_ibfk_3` FOREIGN KEY (`source_id`) REFERENCES `inspection_sources` (`id`),
  CONSTRAINT `inspection_files_ibfk_4` FOREIGN KEY (`payment_mode_id`) REFERENCES `inspection_payment_modes` (`id`),
  CONSTRAINT `inspection_files_ibfk_5` FOREIGN KEY (`received_account_id`) REFERENCES `inspection_my_accounts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=634 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_files`
--

LOCK TABLES `inspection_files` WRITE;
/*!40000 ALTER TABLE `inspection_files` DISABLE KEYS */;
INSERT INTO `inspection_files` VALUES (1,'INS-2026-0001','2026-03-18','self',NULL,'sukanta saha','08961090050','225/h/304 bagmari road kolkata-54',100000.00,1,4,1,3000.00,'draft',NULL,NULL,'',NULL,NULL,'',2100.00,900.00,0.00,900.00,NULL,NULL,'2026-03-18 17:56:26','2026-03-18 17:58:35'),(563,'INS-2026-0002','2025-08-02','self',NULL,'Dipu Rajak',NULL,'Dakhindari, lake Town',2500000.00,4,5,2,3500.00,'final_hard','2025-04-08',1,'paid','0021-08-25',3500.00,'paid',2450.00,1050.00,0.00,1050.00,1,'Direct to office','2026-03-18 19:27:58','0000-00-00 00:00:00'),(564,'INS-2026-0003','2025-06-08','self',NULL,'Toushali Dey',NULL,'Magnolia, Barasat',NULL,1,6,3,3000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,'pending doucment, agrement needed','2026-03-18 19:27:58','2026-03-18 14:57:58'),(565,'INS-2026-0004','2025-06-08','self',NULL,'Gourab Saha',NULL,'Shyamnagar',NULL,1,6,3,3000.00,'final_hard','2025-07-08',1,'paid','2025-06-08',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2025-06-07 18:30:00'),(566,'INS-2026-0005','2025-07-08','self',NULL,'Moumita Bisawas','9836009093','Uni World, New Town',NULL,1,7,3,3000.00,'final_hard','2025-07-08',1,'paid','0019-08-25',3000.00,'due',2100.00,900.00,0.00,900.00,1,'pending to pay office','2026-03-18 19:27:58','0000-00-00 00:00:00'),(567,'INS-2026-0006','2025-08-08','self',NULL,'Prabhat Kumar Gupta',NULL,'Cloud9, Khidirpore',NULL,1,6,4,4000.00,'final_hard','0023-08-25',NULL,'due',NULL,NULL,'due',2800.00,1200.00,0.00,1200.00,1,NULL,'2026-03-18 19:27:58','0000-00-00 00:00:00'),(568,'INS-2026-0007','2026-08-12','self',NULL,'Avik Mandal','9903099973','Ordit Tarang',NULL,1,8,5,3000.00,'final_hard','0014-08-25',1,'paid','2025-08-10',3000.00,'paid',2100.00,900.00,0.00,900.00,1,'Adjusted with pending payment','2026-03-18 19:27:58','2025-08-09 18:30:00'),(569,'INS-2026-0008','2026-08-18','self',NULL,'Prasentjit Pramanik',NULL,'Kankinara',NULL,1,9,3,3000.00,'final_hard','0020-08-25',1,'paid','0018-08-25',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','0000-00-00 00:00:00'),(570,'INS-2026-0009','2026-08-20','self',NULL,'Ankit Gupta',NULL,'Belur Math',NULL,1,8,5,3000.00,'final_hard','0021-08-25',1,'paid','0020-08-25',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','0000-00-00 00:00:00'),(571,'INS-2026-0010','2026-08-20','self',NULL,'Anuj Kumar','7903134125','Mangolia Skyview, Newtown',NULL,1,8,6,3000.00,'final_hard','0022-08-25',1,'paid','0020-08-25',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','0000-00-00 00:00:00'),(572,'INS-2026-0011','2026-08-21','self',NULL,'SIRSENDU MOHANTA',NULL,'F Residence Marlin, Newtown',NULL,1,6,4,4000.00,'final_hard','0021-08-25',1,'paid','2025-09-19',4000.00,'paid',2800.00,1200.00,0.00,1200.00,1,NULL,'2026-03-18 19:27:58','2025-09-18 18:30:00'),(573,'INS-2026-0012','2026-08-22','self',NULL,'SIDDHARTHA SAHOO','9830036308','MERLIN AVANA',NULL,1,6,4,3000.00,'final_hard','0022-08-25',1,'paid','2026-11-28',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-27 18:30:00'),(574,'INS-2026-0013','2026-08-23','self',NULL,'Nandan Shanyal','8926282121','near Anandapur Police Station',NULL,1,10,7,3000.00,'final_hard','0025-08-25',1,'paid','0030-08-25',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','0000-00-00 00:00:00'),(575,'INS-2026-0014','2026-08-26','office','kolkata','Manas Paul','9932759705','Baguihati',NULL,5,11,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(576,'INS-2026-0015','2026-08-26','office','kolkata','Suchitra Samanta','8617210134','Garfa',NULL,5,12,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(577,'INS-2026-0016','2026-08-30','self',NULL,'Prabhat Kumar Gupta','8420637265','Cloud9, Khidirpore',NULL,1,6,4,3000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,'NEED PLAN','2026-03-18 19:27:58','2026-03-18 14:57:58'),(578,'INS-2026-0017','2026-09-01','self',NULL,'Uttal Nandy','9239257302','Bhupen Bose Ann.',NULL,1,13,9,0.00,NULL,NULL,1,'paid','2026-10-09',0.00,'due',0.00,0.00,0.00,0.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(579,'INS-2026-0018','2026-09-01','office','kolkata','Bilthika Roy','9474464903','Jadavpur / Garia Monda',NULL,5,11,8,NULL,NULL,NULL,NULL,NULL,'2026-10-09',NULL,NULL,NULL,300.00,0.00,300.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(580,'INS-2026-0019','2026-09-03','self',NULL,'SoumiK Pal','9002662700','Sonarpur',NULL,1,14,10,3000.00,'final_hard','2026-09-03',1,'paid','2026-09-05',3000.00,'due',2100.00,900.00,0.00,900.00,1,'Office not mention in due list','2026-03-18 19:27:58','2026-09-04 18:30:00'),(581,'INS-2026-0020','2026-09-06','office','kolkata','Sourav Dey','9002662700','Italgaça / Bardwan',NULL,5,15,8,NULL,NULL,NULL,NULL,NULL,'2026-10-09',NULL,NULL,NULL,300.00,0.00,300.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(582,'INS-2026-0021','2026-09-10','self',NULL,'Archana Singh','9830330824','Bagnajati / Kaikhali',NULL,1,16,11,3000.00,'final_hard','2026-09-11',1,'paid','2026-09-12',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-09-11 18:30:00'),(583,'INS-2026-0022','2026-09-11','self',NULL,'Arijit Patran','6293233215','Ghuni Sec-5',NULL,1,17,12,3000.00,'final_hard','2026-09-12',1,'paid','2026-10-07',3000.00,'paid',2100.00,900.00,0.00,900.00,1,'Adjusted with pending payment','2026-03-18 19:27:58','2026-10-06 18:30:00'),(584,'INS-2026-0023','2026-09-11','self',NULL,'Ranik Basak','NA','Salt Lake',NULL,1,13,9,0.00,NULL,NULL,1,'paid','2026-10-09',0.00,'due',0.00,0.00,0.00,0.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(585,'INS-2026-0024','2026-09-12','self',NULL,'Prakash Mondal','8343082620','Bongaon',NULL,1,18,7,3000.00,'final_hard','2026-10-10',1,'paid','2026-11-10',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-09 18:30:00'),(586,'INS-2026-0025','2026-09-15','office','kolkata','M/s Millennium Road Construction','NA','AHMERT STREET',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,'2026-10-09',NULL,NULL,NULL,300.00,0.00,300.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(587,'INS-2026-0026','2026-09-18','self',NULL,'Christopher Thomas','6291302597','Kasba',NULL,1,NULL,7,3000.00,'final_hard','2026-09-18',1,'paid','2026-10-14',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-10-13 18:30:00'),(588,'INS-2026-0027','2026-09-19','self',NULL,'Arpita Halder','8250701735','Italgacha',NULL,1,16,13,3500.00,'final_hard','2026-09-19',1,'paid','2026-09-21',3500.00,'paid',2450.00,1050.00,0.00,1050.00,1,NULL,'2026-03-18 19:27:58','2026-09-20 18:30:00'),(589,'INS-2026-0028','2026-09-19','self',NULL,'Shelly Das','9163934189','Italgacha',NULL,1,19,13,3000.00,'final_hard','2026-09-20',1,'paid','2026-09-21',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-09-20 18:30:00'),(590,'INS-2026-0029','2026-09-20','office','kolkata','Gaffar Khan','9609782143','SARDARPARA, BIMANNAGAR',NULL,5,11,8,NULL,NULL,NULL,NULL,NULL,'2026-10-09',NULL,NULL,NULL,300.00,0.00,300.00,1,'All clear','2026-03-18 19:27:58','2026-10-08 18:30:00'),(591,'INS-2026-0030','2026-09-22','self',NULL,'BIMAL SINGH',NULL,'Kaikhali',NULL,1,16,11,3000.00,'final_hard','2026-09-25',NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-09-24 18:30:00'),(592,'INS-2026-0031','2026-09-25','self',NULL,'Sandip Gayan','8967190076','Utopia, Mukundopur',NULL,1,20,7,3000.00,'final_hard','2026-09-25',1,'paid','2026-01-22',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-01-21 18:30:00'),(593,'INS-2026-0032','2026-09-25','self',NULL,'Sanjoy Singha','7001356787','Prudent Pragati, Sonarpur',NULL,1,21,10,3000.00,'final_hard','2026-09-25',1,'paid','2026-09-24',3000.00,'paid',2100.00,900.00,0.00,900.00,1,'got 500 extra','2026-03-18 19:27:58','2026-09-23 18:30:00'),(594,'INS-2026-0033','2026-10-07','self',NULL,'Nikhil Mondal','9432629879','Ideal Aquaview, Mahisbatan',NULL,1,22,3,3000.00,'final_hard','2026-10-09',1,'paid','2026-10-07',3000.00,'paid',2100.00,900.00,0.00,900.00,1,'Adjusted with pending payment','2026-03-18 19:27:58','2026-10-06 18:30:00'),(595,'INS-2026-0034','2026-10-08','self',NULL,'Anirban BANDHOPADHAYA','9163497047','Southwind, Sonarpur',NULL,1,23,7,3000.00,'final_hard','2026-11-12',1,'paid','2026-11-10',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-09 18:30:00'),(596,'INS-2026-0035','2026-10-09','self',NULL,'Mampi Sarkar','7029012033','Eternia, Madhyamgram',NULL,1,16,14,3000.00,'final_hard','2026-10-10',1,'paid','2026-01-15',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-01-14 18:30:00'),(597,'INS-2026-0036','2026-10-09','self',NULL,'Akashdip Kundu','9831591697','Eternia, Madhyamgram',NULL,1,16,6,4000.00,'final_hard','2026-10-10',NULL,'due',NULL,NULL,'due',2800.00,1200.00,0.00,1200.00,1,NULL,'2026-03-18 19:27:58','2026-10-09 18:30:00'),(598,'INS-2026-0037','2026-10-14','self',NULL,'SAMARPAN PAUL','9933000377','GREEN VEGA, RAJARHAT',NULL,1,17,10,3000.00,'final_hard','2026-10-15',1,'paid','2026-10-15',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-10-14 18:30:00'),(599,'INS-2026-0038','2026-10-15','self',NULL,'SAYANTANI PAUL','7439722306','SERENIA',NULL,1,24,10,3000.00,'final_hard','2026-10-16',NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,'2000 PAY BY ABHINSA DA','2026-03-18 19:27:58','2026-10-15 18:30:00'),(600,'INS-2026-0039','2026-10-18','office','out_of_kolkata','Mojjaffar Hossain Molla','9733702699',NULL,NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,350.00,0.00,350.00,1,'OUT SIDE OF KOLKATA','2026-03-18 19:27:58','2026-03-18 14:57:58'),(601,'INS-2026-0040','2026-10-27','office','kolkata','DEBARATA DAS','NA','LAKETOWN',NULL,5,25,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(602,'INS-2026-0041','2026-11-03','self',NULL,'MANIK SEKH','9732873674','MAHAJATIN, BIRATI',NULL,NULL,NULL,7,3000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,'NEED PLAN','2026-03-18 19:27:58','2026-03-18 14:57:58'),(603,'INS-2026-0042','2026-11-03','office','kolkata','AMAL KRISHNA BISWAS',NULL,'BAGUIATI',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(604,'INS-2026-0043','2026-11-04','self',NULL,'AMRIT GHOSH','9230122148','BARACKPUR',NULL,1,9,3,3000.00,'final_hard','2026-11-12',1,'paid','2026-11-07',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-06 18:30:00'),(605,'INS-2026-0044','2026-11-05','office','kolkata','PARTHA SARATHI SINGHA','8918239802','BGHAJATIN',NULL,5,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(606,'INS-2026-0045','2026-11-06','self',NULL,'MD FAREED','7980502471','GODREJ SEVEN, BISHNURPUR',NULL,1,31,6,3000.00,'final_hard','2026-11-06',1,'paid','2026-01-16',3000.00,'paid',2100.00,900.00,0.00,900.00,1,'still pending 1000','2026-03-18 19:27:58','2026-01-15 18:30:00'),(607,'INS-2026-0046','2026-11-14','self',NULL,'LALBABU SHARMA','9062085054','MALONCHO',NULL,1,2,15,3000.00,'final_hard','2026-11-17',1,'paid','2026-11-19',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-18 18:30:00'),(608,'INS-2026-0047','2026-11-18','office','kolkata','SARMISTREE HALDER','NA','NAKTALA',NULL,5,11,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(609,'INS-2026-0048','2026-11-19','self',NULL,'KOUSHIK ROY','9830120745','DIMOND CIY SOUTH, TOLLYGAUNG',NULL,NULL,NULL,7,3000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,'NEED PLAN','2026-03-18 19:27:58','2026-03-18 14:57:58'),(610,'INS-2026-0049','2026-11-20','self',NULL,'DILIP SARKAR','8017407511','BIRNAGAR',NULL,1,9,16,3000.00,'final_hard','2026-11-27',1,'paid','2026-11-20',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-19 18:30:00'),(611,'INS-2026-0050','2026-11-22','office','out_of_kolkata','SHOALI SEPAI','NA','NALPUR',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,350.00,0.00,350.00,1,'OUTSIDE KOLKATA','2026-03-18 19:27:58','2026-03-18 14:57:58'),(612,'INS-2026-0051','2026-11-22','office','out_of_kolkata','SONIA PARVEJ','NA','JOY VILA, BANGRA',NULL,NULL,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,350.00,0.00,350.00,1,'OUTSIDE KOLKATA','2026-03-18 19:27:58','2026-03-18 14:57:58'),(613,'INS-2026-0052','2026-11-23','self',NULL,'BREEZ SHAU','8240481281','DUM DUM CANT',NULL,1,17,17,3000.00,'final_hard','2026-11-25',1,'paid','2026-11-23',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-11-22 18:30:00'),(614,'INS-2026-0053','2026-12-03','self',NULL,'saikat kumar roy','858821796','Fortune Heights, Barasat',NULL,1,24,10,3000.00,'final_hard','2026-12-03',1,'paid','2026-12-02',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-12-01 18:30:00'),(615,'INS-2026-0054','2026-12-08','self',NULL,'Koushik Gorai','9477092249','Suvenior Heights, Baguihati',NULL,1,19,5,3000.00,'final_hard','2026-12-08',1,'paid','2026-01-04',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-01-03 18:30:00'),(616,'INS-2026-0055','2026-12-17','self',NULL,'Prabhat Kumar Pramanik','9874395120','Baguihati',NULL,1,8,21,4000.00,'final_hard','2026-12-19',NULL,'due',NULL,NULL,'due',2800.00,1200.00,0.00,1200.00,1,NULL,'2026-03-18 19:27:58','2026-12-18 18:30:00'),(617,'INS-2026-0056','2026-12-20','office','out_of_kolkata','Sadip Mondal','NA','Magrahat',NULL,5,NULL,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,350.00,0.00,350.00,1,'OUTSIDE KOLKATA','2026-03-18 19:27:58','2026-03-18 19:33:09'),(618,'INS-2026-0057','2026-12-22','office','kolkata','Biplab Dey','9903272207','Regent Park, Tollygaung',NULL,5,15,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(619,'INS-2026-0058','2026-12-23','self',NULL,'Monirul Haque','9143700636','Regent Kusum, Barasat',NULL,1,19,6,3000.00,'final_hard','2026-12-23',1,'paid','2026-12-23',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-12-22 18:30:00'),(620,'INS-2026-0059','2026-12-24','self',NULL,'Anjan Dey','7001449107','Kharda',NULL,1,9,19,3000.00,'final_hard','2026-12-26',1,'paid','2026-12-26',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-12-25 18:30:00'),(621,'INS-2026-0060','2026-01-13','office','kolkata','Dipak Panda','9933160197','Aswaninnagar',NULL,5,11,8,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(622,'INS-2026-0061','2026-01-14','self',NULL,'Binod Chandra Patra','9836030222','Eden Tolly Signature',NULL,1,16,3,3000.00,'final_hard','2026-01-16',1,'paid','2026-01-16',3000.00,'paid',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-01-15 18:30:00'),(623,'INS-2026-0062','2026-01-24','self',NULL,'Debashis Sarkar','9810664656','Garfa',NULL,1,1,23,4500.00,'final_hard','2026-01-28',NULL,'due',NULL,NULL,'due',3150.00,1350.00,0.00,1350.00,1,NULL,'2026-03-18 19:27:58','2026-01-27 18:30:00'),(624,'INS-2026-0063','2026-01-27','self',NULL,'Syed Shams Tabrez','9163458247','Specia, Madhyamgram',NULL,1,NULL,13,3000.00,'final_hard','2026-01-29',NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-01-28 18:30:00'),(625,'INS-2026-0064','2026-01-28','self',NULL,'Ashish Nahata','8600080483','Moray, BL saha road',NULL,1,23,24,4000.00,'final_hard','2026-01-29',NULL,'due',NULL,NULL,'due',2800.00,1200.00,0.00,1200.00,1,NULL,'2026-03-18 19:27:58','2026-01-28 18:30:00'),(626,'INS-2026-0065','2026-01-30','self',NULL,'Ranjan Roy','9830537398','Garfa',NULL,1,1,23,3000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(627,'INS-2026-0066','2026-01-30','self',NULL,'Ranjan Roy','9830537398','Garfa',NULL,1,1,23,1000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',700.00,300.00,0.00,300.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(628,'INS-2026-0067','2026-02-05','self',NULL,'Yoges Dua','9830057455','B Garden',NULL,1,13,25,12000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',8400.00,3600.00,0.00,3600.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(629,'INS-2026-0068','2026-02-05','self',NULL,'Ankit Chowdhury',NULL,'Tallygaung post office',NULL,1,1,26,5000.00,NULL,NULL,NULL,'due',NULL,NULL,'due',3500.00,1500.00,0.00,1500.00,1,NULL,'2026-03-18 19:27:58','2026-03-18 14:57:58'),(630,'INS-2026-0069','2026-02-03','self',NULL,'Sourav Das',NULL,'Barisha Thakurpukur',NULL,1,1,26,3000.00,'final_hard','2026-02-08',1,'paid','2026-03-02',3000.00,'due',2100.00,900.00,0.00,900.00,1,NULL,'2026-03-18 19:27:58','2026-03-01 18:30:00'),(631,'INS-2026-0070','2026-02-10','self',NULL,'Jabbar Ali Molla',NULL,'Patharghata, Rajarhat',NULL,1,16,27,2000.00,'final_hard','2026-02-11',NULL,'due',NULL,NULL,'due',1400.00,600.00,0.00,600.00,1,'NPA','2026-03-18 19:27:58','2026-02-10 18:30:00'),(632,'INS-2026-0071','2026-02-12','self',NULL,'Jitendra Kumar','9831813598','Entally',NULL,3,3,28,4500.00,'final_hard','2026-02-12',NULL,'due',NULL,NULL,'due',3150.00,1350.00,0.00,1350.00,1,NULL,'2026-03-18 19:27:58','2026-02-11 18:30:00'),(633,'INS-2026-0072','2026-03-19','self',NULL,'Malay Sarkar','8777793272','Parui Pucca, Behala',NULL,1,1,1,0.00,NULL,NULL,NULL,'',NULL,NULL,'',0.00,0.00,0.00,0.00,NULL,NULL,'2026-03-19 04:47:28','2026-03-19 04:47:28');
/*!40000 ALTER TABLE `inspection_files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_my_accounts`
--

DROP TABLE IF EXISTS `inspection_my_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_my_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_name` varchar(150) NOT NULL,
  `bank_name` varchar(150) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_my_accounts`
--

LOCK TABLES `inspection_my_accounts` WRITE;
/*!40000 ALTER TABLE `inspection_my_accounts` DISABLE KEYS */;
INSERT INTO `inspection_my_accounts` VALUES (1,'Sukanta Saha','Bank Of India','424910110008179','BKID0004249','active','2026-03-18 19:14:28','2026-03-18 19:14:28');
/*!40000 ALTER TABLE `inspection_my_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_payment_modes`
--

DROP TABLE IF EXISTS `inspection_payment_modes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_payment_modes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mode_name` varchar(100) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_mode_name` (`mode_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_payment_modes`
--

LOCK TABLES `inspection_payment_modes` WRITE;
/*!40000 ALTER TABLE `inspection_payment_modes` DISABLE KEYS */;
INSERT INTO `inspection_payment_modes` VALUES (1,'Cash','active','2026-03-18 17:08:07','2026-03-18 17:08:07'),(2,'UPI','active','2026-03-18 17:08:07','2026-03-18 17:08:07'),(3,'Bank Transfer','active','2026-03-18 17:08:07','2026-03-18 17:08:07'),(4,'Cheque','active','2026-03-18 17:08:07','2026-03-18 17:08:07');
/*!40000 ALTER TABLE `inspection_payment_modes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inspection_sources`
--

DROP TABLE IF EXISTS `inspection_sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `inspection_sources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source_name` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_source_name` (`source_name`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inspection_sources`
--

LOCK TABLES `inspection_sources` WRITE;
/*!40000 ALTER TABLE `inspection_sources` DISABLE KEYS */;
INSERT INTO `inspection_sources` VALUES (1,'Ayon Adhikari Southarn Manager BOI','7384058527','active','2026-03-18 17:17:21','2026-03-18 17:17:21'),(2,'Binita MNG','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(3,'Sudipta','7003587871','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(4,'Lajpreet','7033804994','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(5,'Bishan Kumar','7980040122','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(6,'Manotosh','8945075169','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(7,'Joydeep','7003587871','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(8,'Avijit Da','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(9,'Monogopal','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(10,'Avinash Singh','7980373695','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(11,'Sankar Da','8240942133','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(12,'Mousumi Sen','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(13,'Lajpreeti','7033804994','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(14,'Bhushion','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(15,'Prabhita','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(16,'Sankar','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(17,'Mousumi Mam','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(18,'Riya Maam','8240071971','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(19,'Rahul','7044067258','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(20,'Amit Kumar','7044285072','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(21,'Koyel Maam','9830304838','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(22,'Sandip Hazra','8961090050','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(23,'Pritam Da','7439726927','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(24,'Abhinash','7980373695','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(25,'Soumick Sir','7384058527','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(26,'Ayon Sir','7384058527','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(27,'Mahaswata Sarkar','8910132678','active','2026-03-18 19:06:06','2026-03-18 19:06:06'),(28,'Rajib Kumar RAPC','9723910086','active','2026-03-18 19:06:06','2026-03-18 19:06:06');
/*!40000 ALTER TABLE `inspection_sources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `message` text NOT NULL,
  `budget_range` varchar(50) DEFAULT NULL,
  `source` varchar(50) DEFAULT 'website',
  `status` enum('new','contacted','qualified','proposal_sent','won','lost') DEFAULT 'new',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `assigned_to` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_priority` (`priority`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('bank','upi') NOT NULL,
  `name` varchar(100) NOT NULL COMMENT 'Display name like "HDFC Savings" or "GooglePay UPI"',
  `bank_name` varchar(100) DEFAULT NULL,
  `account_holder` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `branch_name` varchar(100) DEFAULT NULL,
  `upi_id` varchar(100) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL COMMENT 'Path to uploaded QR code image',
  `is_default` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_type` (`type`),
  KEY `idx_active` (`is_active`),
  KEY `idx_default` (`is_default`),
  CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'bank','Slice Cur','Slice','Sukanta Saha','033311501012740','NESF0000333','',NULL,NULL,0,1,0,1,'2026-01-24 05:27:33','2026-01-24 05:27:33'),(2,'upi','Slice',NULL,NULL,NULL,NULL,NULL,'s9992171824897953@sIc','uploads/payment-qr/qr_1769232637_697458fdeac42.jpeg',0,1,0,1,'2026-01-24 05:30:37','2026-01-24 05:30:37');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `client_name` varchar(100) DEFAULT NULL,
  `project_url` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `banner_url` varchar(255) DEFAULT NULL,
  `technologies` text DEFAULT NULL,
  `completion_date` date DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `featured` tinyint(1) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`),
  KEY `idx_banner_url` (`banner_url`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,'North Super Fast Service - Complete Logistics Management System','Developed a comprehensive logistics management platform for West Bengal\'s leading courier service provider. The project includes a modern, responsive front-end website showcasing company services, team profiles, and client testimonials, paired with a robust CMS backend for complete business operations management. The admin panel enables efficient tracking and management of vehicles, staff assignments, delivery packages, service areas (11,400+ pin codes), order tracking, website content, and customer data. The system streamlines their entire logistics operation, from order placement to final delivery, supporting their 24/7 service model and 7+ million order fulfillment record.','web-development','North Super Fast Service','https://northsuperfastservice.com/','',NULL,'PHP, MySQL, HTML5, CSS3, JavaScript, Bootstrap, Responsive Design, Custom CMS, RESTful API','2024-11-20',0,1,'active',1,'2025-11-21 13:13:32','2025-11-21 13:13:32'),(2,'Realto CRM','Real estate crm','web-development','Demo','https://realto.biznexa.tech/','','uploads/projects/banners/banner_1767603666_695b7dd2ea3e4.png','vue, tailwind, php, mysql','2025-12-31',0,1,'active',1,'2026-01-03 11:20:52','2026-01-05 09:01:06');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rate_limits`
--

DROP TABLE IF EXISTS `rate_limits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rate_limits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `action` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_rate_lookup` (`ip_address`,`action`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rate_limits`
--

LOCK TABLES `rate_limits` WRITE;
/*!40000 ALTER TABLE `rate_limits` DISABLE KEYS */;
/*!40000 ALTER TABLE `rate_limits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `short_description` text NOT NULL,
  `full_description` longtext DEFAULT NULL,
  `icon` varchar(100) NOT NULL,
  `features` text DEFAULT NULL,
  `pricing_info` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_status` (`status`),
  CONSTRAINT `services_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (1,'Website Design','Faster loading secured website designing service.',NULL,'fas fa-laptop-code',NULL,NULL,1,'active',NULL,'2025-11-19 19:33:57','2025-11-19 19:33:57'),(2,'Ecommerce Website','Premium Quality E-Commerce Development Services.',NULL,'fas fa-shopping-cart',NULL,NULL,2,'active',NULL,'2025-11-19 19:33:57','2025-11-19 19:33:57'),(3,'Web Development','Web portal development with the latest technology.',NULL,'fas fa-code',NULL,NULL,3,'active',NULL,'2025-11-19 19:33:57','2025-11-19 19:33:57'),(4,'AI & Automation Agents','Intelligent AI agents to automate your business processes.','','fas fa-robot','','',4,'active',NULL,'2025-11-19 19:33:57','2026-01-12 07:38:19'),(5,'Digital Marketing','Result-oriented digital marketing services.',NULL,'fas fa-chart-line',NULL,NULL,5,'active',NULL,'2025-11-19 19:33:57','2025-11-19 19:33:57'),(6,'SEO','SEO services to rank higher in search engines.',NULL,'fas fa-search',NULL,NULL,6,'active',NULL,'2025-11-19 19:33:57','2025-11-19 19:33:57');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` varchar(50) DEFAULT 'text',
  `description` text DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `updated_by` (`updated_by`),
  KEY `idx_setting_key` (`setting_key`),
  CONSTRAINT `settings_ibfk_1` FOREIGN KEY (`updated_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'site_name','BizNexa','text','Website name',1,'2026-01-24 05:52:52'),(2,'site_email','biznexa.tech@gmail.com','email','Primary contact email',1,'2026-03-21 18:22:27'),(3,'site_phone','+91 89610 90050','text','Primary contact phone',1,'2026-03-21 18:22:27'),(4,'site_address','225 bagmari road kolkata - 700054','text','Business address',1,'2025-11-21 18:19:05'),(5,'facebook_url','https://www.facebook.com/profile.php?id=61580834600459','url','Facebook page URL',1,'2025-11-21 18:19:05'),(6,'twitter_url','https://www.facebook.com/profile.php?id=61580834600459','url','Twitter profile URL',1,'2025-11-21 18:19:05'),(7,'linkedin_url','https://www.facebook.com/profile.php?id=61580834600459','url','LinkedIn profile URL',1,'2025-11-21 18:19:05'),(8,'instagram_url','https://www.instagram.com/dawntoweb/','url','Instagram profile URL',1,'2025-11-21 18:19:05'),(9,'bill_prefix','INV','text','Prefix for bill numbers',NULL,'2026-01-24 05:04:23'),(10,'bill_terms','Payment is due within 15 days of the invoice date. Late payments may be subject to a fee.','textarea','Default payment terms for bills',NULL,'2026-01-24 05:04:23'),(11,'company_gst','','text','Company GST number',NULL,'2026-01-24 05:04:23'),(12,'company_bank_name','','text','Bank name for payment',NULL,'2026-01-24 05:04:23'),(13,'company_bank_account','','text','Bank account number',NULL,'2026-01-24 05:04:23'),(14,'company_bank_ifsc','','text','Bank IFSC code',NULL,'2026-01-24 05:04:23'),(15,'company_upi','','text','UPI ID for payments',NULL,'2026-01-24 05:04:23'),(24,'stat_years','5','number','Years of experience shown on homepage',1,'2026-03-17 14:48:20'),(25,'stat_projects','15','number','Projects completed shown on homepage',1,'2026-03-17 14:48:20'),(26,'stat_clients','12','number','Happy clients shown on homepage',1,'2026-03-17 14:48:20'),(27,'stat_countries','2','number','Countries served shown on homepage',1,'2026-03-17 14:48:20'),(28,'hero_title','Website Design and Development Company','text','Homepage hero title',1,'2026-03-17 14:48:20'),(29,'hero_subtitle','Custom Web Design Services at Affordable Pricing','text','Homepage hero subtitle',1,'2026-03-17 14:48:20'),(30,'hero_image','https://biznexa.tech/','url','Homepage hero image URL',1,'2026-03-17 14:48:20'),(46,'contact_phones','[{\"number\":\"8910676113\",\"label\":\"WhatsApp\"}]','json','Additional contact phone numbers',1,'2026-03-21 18:22:27'),(47,'contact_emails','[{\"email\":\"info@biznexa.tech\",\"department\":\"Support\"}]','json','Department-wise contact emails',1,'2026-03-21 18:22:27');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technologies`
--

DROP TABLE IF EXISTS `technologies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `technologies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `icon` varchar(100) NOT NULL,
  `color` varchar(20) DEFAULT '#333333',
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technologies`
--

LOCK TABLES `technologies` WRITE;
/*!40000 ALTER TABLE `technologies` DISABLE KEYS */;
INSERT INTO `technologies` VALUES (1,'HTML5','fab fa-html5','#E34F26',1,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(2,'CSS3','fab fa-css3-alt','#1572B6',2,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(3,'JavaScript','fab fa-js-square','#F7DF1E',3,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(4,'PHP','fab fa-php','#777BB4',4,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(5,'WordPress','fab fa-wordpress','#21759B',5,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(6,'Bootstrap','fab fa-bootstrap','#7952B3',6,'active','2025-11-21 18:32:28','2025-11-21 18:32:28'),(7,'Shopify','fab fa-shopify','#96bf48',7,'active','2025-11-21 18:32:28','2025-11-21 18:32:28');
/*!40000 ALTER TABLE `technologies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) NOT NULL,
  `client_position` varchar(100) DEFAULT NULL,
  `client_company` varchar(100) DEFAULT NULL,
  `testimonial` text NOT NULL,
  `rating` int(11) DEFAULT 5,
  `client_photo` varchar(255) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (2,'Sarah Johnson','Founder','Fashion Hub','Excellent service! The team delivered our e-commerce website on time with amazing features. Our sales have increased by 40% since launch.',5,NULL,NULL,0,'active','2025-11-19 19:33:57','2025-11-19 19:33:57'),(5,'Tanmoy Ghosh','Ceo','North Super Fast Service','Outstanding delivery. The system is now the backbone of our operations—handling logistics, staff, and customer tracking seamlessly. We gave him a chance as a fresher, and he proved himself exceptionally.',5,'',1,1,'active','2025-11-21 19:02:13','2025-11-21 19:02:13');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `website_content`
--

DROP TABLE IF EXISTS `website_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `website_content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  KEY `idx_section` (`section`),
  KEY `idx_status` (`status`),
  CONSTRAINT `website_content_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `website_content`
--

LOCK TABLES `website_content` WRITE;
/*!40000 ALTER TABLE `website_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `website_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'd2w_cms'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-28  2:05:16
