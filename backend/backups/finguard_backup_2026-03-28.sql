-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: user_db
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
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL,
  `limit_amount` decimal(15,2) NOT NULL,
  `month` varchar(7) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_budget` (`user_id`,`category`,`month`),
  CONSTRAINT `fk_user_budget` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
INSERT INTO `budgets` VALUES (7,18,'food',5000.00,'2026-03','2026-03-17 14:58:31');
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `target_amount` decimal(15,2) NOT NULL,
  `current_saved` decimal(15,2) DEFAULT 0.00,
  `target_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `goals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES (10,16,'bday',5000.00,500.00,'2026-03-25','2026-03-13 09:02:20'),(13,18,'Wifi Box ',15000.00,2000.00,'2026-03-25','2026-03-18 04:52:06'),(15,20,'after party',5000.00,3500.00,'2026-03-24','2026-03-25 05:41:57'),(16,22,'defense',5000.00,3000.00,'2026-03-27','2026-03-27 16:44:34'),(17,18,'defense2',10000.00,5000.00,'2026-04-04','2026-03-27 16:59:30');
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations`
--

DROP TABLE IF EXISTS `knex_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations`
--

LOCK TABLES `knex_migrations` WRITE;
/*!40000 ALTER TABLE `knex_migrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `knex_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `knex_migrations_lock`
--

DROP TABLE IF EXISTS `knex_migrations_lock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `knex_migrations_lock` (
  `index` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `is_locked` int(11) DEFAULT NULL,
  PRIMARY KEY (`index`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `knex_migrations_lock`
--

LOCK TABLES `knex_migrations_lock` WRITE;
/*!40000 ALTER TABLE `knex_migrations_lock` DISABLE KEYS */;
INSERT INTO `knex_migrations_lock` VALUES (1,0);
/*!40000 ALTER TABLE `knex_migrations_lock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `method` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT current_timestamp(),
  `externalReference` varchar(255) DEFAULT NULL,
  `syncSource` enum('manual','automated') DEFAULT 'manual',
  PRIMARY KEY (`id`),
  UNIQUE KEY `externalReference` (`externalReference`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (28,16,'Salary',56273.00,'income','Salary','Complete','Cash in Hand','2026-03-13 09:00:00',NULL,'manual'),(29,16,'Salary',60000.00,'income','Salary','pending','momo','2026-03-13 09:00:00',NULL,'manual'),(30,16,'Transport',500.00,'expense','Transport','Complete','Cash in Hand','2026-03-13 09:00:00',NULL,'manual'),(35,18,'wifi box',15000.00,'expense','wifi box','Complete','Cash in Hand','2026-03-18 04:49:00',NULL,'manual'),(36,18,'Salary',50000.00,'income','Salary','Complete','Cash in Hand','2026-03-18 04:50:00',NULL,'manual'),(37,20,'salary',200000.00,'income','salary','Complete','Cash in Hand','2026-03-25 00:00:00',NULL,'manual'),(38,20,'project ',20000.00,'expense','project ','Complete','Cash in Hand','2026-03-25 00:00:00',NULL,'manual'),(39,18,'Salary',678987.00,'income','Salary','Complete','Cash in Hand','2026-03-26 15:26:00',NULL,'manual'),(42,18,'Salary',6783637.00,'income','Salary','Complete','Cash in Hand','2026-03-26 15:53:00',NULL,'manual'),(43,18,'Salary',6700.00,'income','Salary','Complete','Cash in Hand','2026-03-26 15:53:00',NULL,'manual'),(44,22,'Salary',40000.00,'income','Salary','Complete','Cash in Hand','2026-03-27 16:42:00',NULL,'manual'),(45,22,'internet',500.00,'expense','internet','Complete','MTN Momo','2026-03-27 16:43:00',NULL,'manual'),(46,22,'puff balls',1000.00,'expense','puff balls','Complete','Cash in Hand','2026-03-27 00:00:00',NULL,'manual'),(48,18,'Salary',20500.00,'income','Salary','pending ','Cash in Hand','2026-03-28 20:46:00',NULL,'manual');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_balance` decimal(15,2) DEFAULT 0.00,
  `monthly_income` decimal(15,2) DEFAULT 0.00,
  `bio` text DEFAULT NULL,
  `profile_pic` longtext DEFAULT NULL,
  `profile_bg_color` varchar(10) DEFAULT '#ffffff',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (16,'jd','nii','nii@gmail.com','$2b$10$.XTBMyhEe5raMIqU4M6EHe/dUrW9kBAdQMWhWxrIe0ncdjy4pMuPG','2026-03-13 09:00:08',0.00,0.00,NULL,NULL,'#ffffff'),(17,'j','jj','jj@gmail.com','$2b$10$dtF68hwWXFUIFAuugJSfKuBnT08pHwZVNre/bRJlebL..Yl3c1cWC','2026-03-14 03:19:11',0.00,0.00,NULL,NULL,'#ffffff'),(18,'cam','pay','pay@gmail.com','$2b$10$OAuBI/phx94mjO1Hd4t5EuDWBCEC9iROaVxofmMOydFy4IDjp4Efm','2026-03-14 04:14:21',0.00,0.00,NULL,NULL,'#ffffff'),(19,'teg','tec','teg@gmail.com','$2b$10$J6710QZBKiZSm7.Du8mvR.jx3RknPFWGamIgBYWQqv7zI2fy4gP8a','2026-03-14 05:42:22',0.00,0.00,NULL,NULL,'#ffffff'),(20,'che','for','che@gmail.com','$2b$10$6BD2cjnwrxNY3ANxsEmq9eRYacehpgLE8gCV68TzOyHX8Tm1UgHJy','2026-03-16 12:05:55',0.00,0.00,NULL,NULL,'#ffffff'),(21,'munji','mbaya','mbaya@gmail.com','$2b$10$hIzwPnQaeExstuzZAqirl.Obe8XDxW/HrIlZ6GEeYoWNqyIc4X/oG','2026-03-26 15:09:53',0.00,0.00,NULL,NULL,'#ffffff'),(22,'jennifer','sandrine','jen@gmail.com','$2b$10$CsoQJfAFgdCbLe1jHXK3i.31okOKmFm9l8ubCcDiDyXcB6QnPFUbm','2026-03-27 16:42:26',0.00,0.00,NULL,NULL,'#ffffff'),(23,'jen','ji','ji@gmail.com','$2b$10$0v/GJujBXpFY.41mRspqTewO4Ir9lUdM7xQ1s3666thYTDCAfX2MS','2026-03-28 21:24:03',0.00,0.00,NULL,NULL,'#ffffff'),(24,'hey','u','u@gmail.com','$2b$10$LFIYb6N5UTJShX/hFLHAKuXBrunBtTiQzk2kBzyIcxTR4UI45PxEy','2026-03-28 21:31:16',0.00,0.00,NULL,NULL,'#ffffff');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-28 22:55:36
