-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: check_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `banner_url` varchar(255) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'banner1.jpg','TOP'),(2,'banner2.jpg','BOTTOM'),(3,'banner3.jpg','LEFT'),(4,'banner4.jpg','RIGHT'),(5,'banner5.jpg','CENTER');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_companies`
--

DROP TABLE IF EXISTS `bus_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_companies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `descriptions` longtext,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_companies`
--

LOCK TABLES `bus_companies` WRITE;
/*!40000 ALTER TABLE `bus_companies` DISABLE KEYS */;
INSERT INTO `bus_companies` VALUES (1,'ABC Bus Co.','abc_logo.png','A leading bus company','2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,'XYZ Transport','xyz_logo.png','Reliable transport service','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,'Speedy Travels','speedy_logo.png','Fast and efficient bus services','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,'Elite Transport','elite_logo.png','Luxurious travel experience','2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,'Green Bus','green_logo.png','Eco-friendly and sustainable buses','2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `bus_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_image`
--

DROP TABLE IF EXISTS `bus_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) DEFAULT NULL,
  `bus_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `bus_image_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_image`
--

LOCK TABLES `bus_image` WRITE;
/*!40000 ALTER TABLE `bus_image` DISABLE KEYS */;
INSERT INTO `bus_image` VALUES (1,'bus101_image1.jpg',1),(2,'bus202_image1.jpg',2),(3,'bus303_image1.jpg',3),(4,'bus404_image1.jpg',4),(5,'bus505_image1.jpg',5);
/*!40000 ALTER TABLE `bus_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bus_reviews`
--

DROP TABLE IF EXISTS `bus_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bus_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bus_id` (`bus_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bus_reviews_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`),
  CONSTRAINT `bus_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bus_reviews`
--

LOCK TABLES `bus_reviews` WRITE;
/*!40000 ALTER TABLE `bus_reviews` DISABLE KEYS */;
INSERT INTO `bus_reviews` VALUES (1,1,1,5,'Great service and comfortable ride!','2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,2,2,4,'Good value for money.','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,3,3,3,'Decent but could be better.','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,4,4,2,'The bus was delayed and uncomfortable.','2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,5,5,5,'Excellent experience, will travel again.','2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `bus_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `license_plate` varchar(20) DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `company_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `buses_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `bus_companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'Bus 101','Luxury bus for long routes','AB123CD',50,1,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,'Bus 202','Economy bus','XY987ZT',40,2,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,'Bus 303','Express bus for daily commuters','LM234GH',60,3,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,'Bus 404','VIP bus','JK567MN',30,4,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,'Bus 505','Sustainable bus with eco-friendly features','GH890XY',45,5,'2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cancellation_policies`
--

DROP TABLE IF EXISTS `cancellation_policies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cancellation_policies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descriptions` text,
  `route_id` int DEFAULT NULL,
  `cancellation_time_limit` int DEFAULT NULL,
  `refund_percentage` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `route_id` (`route_id`),
  CONSTRAINT `cancellation_policies_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cancellation_policies`
--

LOCK TABLES `cancellation_policies` WRITE;
/*!40000 ALTER TABLE `cancellation_policies` DISABLE KEYS */;
INSERT INTO `cancellation_policies` VALUES (1,'Cancel up to 24 hours before departure for full refund',1,24,100,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,'Cancel up to 12 hours before departure for 50% refund',2,12,50,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,'No refund after departure',3,0,0,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,'Cancel up to 48 hours before departure for full refund',4,48,100,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,'Cancel up to 6 hours before departure for 25% refund',5,6,25,'2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `cancellation_policies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_providers`
--

DROP TABLE IF EXISTS `payment_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_providers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `provider_name` varchar(100) DEFAULT NULL,
  `provider_type` enum('CARD','E_WALLET','BANK_TRANSFER','QR_CODE') DEFAULT NULL,
  `api_endpoint` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_providers`
--

LOCK TABLES `payment_providers` WRITE;
/*!40000 ALTER TABLE `payment_providers` DISABLE KEYS */;
INSERT INTO `payment_providers` VALUES (1,'PayPal','E_WALLET','https://api.paypal.com','2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,'Stripe','CARD','https://api.stripe.com','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,'BankTransfer','BANK_TRANSFER','https://api.banktransfer.com','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,'QRPay','QR_CODE','https://api.qrpay.com','2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,'GooglePay','E_WALLET','https://api.googlepay.com','2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `payment_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_provider_id` int DEFAULT NULL,
  `user_id` int unsigned DEFAULT NULL,
  `ticket_id` int DEFAULT NULL,
  `payment_method` enum('CASH','ONLINE') DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_provider_id` (`payment_provider_id`),
  KEY `user_id` (`user_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`payment_provider_id`) REFERENCES `payment_providers` (`id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,1,'ONLINE',50,'COMPLETED','2025-05-11 08:15:35','2025-05-11 08:15:35'),(2,2,2,2,'CASH',30,'PENDING','2025-05-11 08:15:35','2025-05-11 08:15:35'),(3,3,3,3,'ONLINE',70,'COMPLETED','2025-05-11 08:15:35','2025-05-11 08:15:35'),(4,4,4,4,'ONLINE',30,'FAILED','2025-05-11 08:15:35','2025-05-11 08:15:35'),(5,5,5,5,'CASH',50,'PENDING','2025-05-11 08:15:35','2025-05-11 08:15:35');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` enum('ROLE_ADMIN','ROLE_USER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `departure_station_id` int DEFAULT NULL,
  `arrival_station_id` int DEFAULT NULL,
  `price` double DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `distance` int DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `departure_station_id` (`departure_station_id`),
  KEY `arrival_station_id` (`arrival_station_id`),
  CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`departure_station_id`) REFERENCES `stations` (`id`),
  CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`arrival_station_id`) REFERENCES `stations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,1,2,20,120,50,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,2,3,30,150,75,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,3,4,40,180,100,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,4,5,50,240,120,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,5,1,60,300,150,'2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `route_id` int DEFAULT NULL,
  `bus_id` int DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `arrival_time` datetime DEFAULT NULL,
  `available_seats` int DEFAULT NULL,
  `total_seats` int DEFAULT NULL,
  `status` enum('AVAILABLE','FULL','CANCELLED') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `route_id` (`route_id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,1,'2025-06-15 08:00:00','2025-06-15 10:00:00',49,50,'AVAILABLE','2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,2,2,'2025-06-15 09:00:00','2025-06-15 11:30:00',40,40,'AVAILABLE','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,3,3,'2025-06-15 10:00:00','2025-06-15 12:30:00',60,60,'AVAILABLE','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,4,4,'2025-06-15 11:00:00','2025-06-15 13:00:00',30,30,'AVAILABLE','2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,5,5,'2025-06-15 12:00:00','2025-06-15 14:30:00',45,45,'AVAILABLE','2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bus_id` int DEFAULT NULL,
  `seat_number` varchar(20) DEFAULT NULL,
  `seat_type` enum('LUXURY','VIP','STANDARD') DEFAULT NULL,
  `status` enum('AVAILABLE','BOOKED') DEFAULT NULL,
  `price_for_type_seat` double DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'1A','VIP','BOOKED',50,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,1,'1B','VIP','BOOKED',50,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,2,'2A','STANDARD','AVAILABLE',30,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,2,'2B','STANDARD','BOOKED',30,'2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,3,'3A','LUXURY','AVAILABLE',70,'2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `station_bus`
--

DROP TABLE IF EXISTS `station_bus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `station_bus` (
  `station_id` int NOT NULL,
  `bus_id` int NOT NULL,
  PRIMARY KEY (`station_id`,`bus_id`),
  KEY `bus_id` (`bus_id`),
  CONSTRAINT `station_bus_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`),
  CONSTRAINT `station_bus_ibfk_2` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `station_bus`
--

LOCK TABLES `station_bus` WRITE;
/*!40000 ALTER TABLE `station_bus` DISABLE KEYS */;
INSERT INTO `station_bus` VALUES (1,1),(2,2),(3,3),(4,4),(5,5);
/*!40000 ALTER TABLE `station_bus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `wallpaper` varchar(255) DEFAULT NULL,
  `descriptions` longtext,
  `location` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES (1,'Station A','station_a.jpg','wallpaper_a.jpg','Main station for bus routes','City Center','2025-05-11 08:15:34','2025-05-11 08:15:34'),(2,'Station B','station_b.jpg','wallpaper_b.jpg','Suburban station','North District','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,'Station C','station_c.jpg','wallpaper_c.jpg','Central hub for commuters','South City','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,'Station D','station_d.jpg','wallpaper_d.jpg','Small station for short routes','East District','2025-05-11 08:15:34','2025-05-11 08:15:34'),(5,'Station E','station_e.jpg','wallpaper_e.jpg','Major stop for long-distance buses','West Side','2025-05-11 08:15:34','2025-05-11 08:15:34');
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seat_id` int DEFAULT NULL,
  `schedule_id` int DEFAULT NULL,
  `departure_time` datetime DEFAULT NULL,
  `arrival_time` datetime DEFAULT NULL,
  `seat_type` enum('LUXURY','VIP','STANDARD') DEFAULT NULL,
  `price` double DEFAULT NULL,
  `status` enum('BOOKED','CANCELLED') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `seat_id` (`seat_id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`seat_id`) REFERENCES `seats` (`id`),
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,1,'2025-05-10 08:00:00','2025-05-10 10:00:00','VIP',50,'CANCELLED','2025-05-11 08:15:34','2025-05-14 19:12:00'),(2,2,2,'2025-05-11 09:00:00','2025-05-11 11:30:00','STANDARD',30,'CANCELLED','2025-05-11 08:15:34','2025-05-11 08:15:34'),(3,3,3,'2025-05-12 10:00:00','2025-05-12 12:30:00','LUXURY',70,'BOOKED','2025-05-11 08:15:34','2025-05-11 08:15:34'),(4,4,4,'2025-05-13 11:00:00','2025-05-13 13:00:00','STANDARD',30,'CANCELLED','2025-05-11 08:15:34','2025-05-13 17:42:00'),(5,5,5,'2025-05-14 12:00:00','2025-05-14 14:30:00','VIP',50,'CANCELLED','2025-05-11 08:15:34','2025-05-11 08:15:34'),(6,1,1,'2025-06-15 08:00:00','2025-06-15 10:00:00','VIP',70,'BOOKED','2025-05-14 23:27:45','2025-05-14 23:27:45');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `token` text NOT NULL,
  `expires_at` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
INSERT INTO `token_blacklist` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbmhuZ3V5ZW4yazM3M0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDY5MjY3MTksImV4cCI6MTc0NjkyODUxOX0.f3lrcblucNd_jrpMhWsmRtBAppqxUmOWFpTIvZCUEEw',1746928519000),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhbmhuZ3V5ZW4yazM3M0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDY5MjgzODUsImV4cCI6MTc0NjkzMDE4NX0.N_RJJW9rivsX0Wz-rpTUP52ZYiiqO0XWD8LDEuIVjgU',1746930185000);
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role`
--

DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role` (
  `role_id` int NOT NULL,
  `user_id` int unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role`
--

LOCK TABLES `user_role` WRITE;
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT 'GOOGLE_SSO',
  `username` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` bigint DEFAULT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `google_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` text,
  `phone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_google_id_unique` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'anhnguyen2k373@gmail.com','$2b$10$G/VmdsJvoKvsMVGZT/vFH.B619KZJgIPY4gNREOoFtlS1W0xkgSRa',NULL,NULL,NULL,'admin',NULL,'2025-04-16 17:55:00','2025-04-16 17:55:00',NULL,'0256568962'),(2,'maingan@gmail.com','$2b$10$Sv/FJ/8ktO/PzcSxdh79COVPh49miF3zYZheClW41Fj5t1OW9Sp8O',NULL,NULL,NULL,'user',NULL,'2025-05-04 11:41:20','2025-05-04 11:41:20',NULL,'0364218466'),(3,'user3@example.com','$2b$10$abc123examplehashhere','User Three',NULL,NULL,'user',NULL,'2025-05-11 01:15:34','2025-05-11 01:15:34',NULL,'0421658459'),(4,'user4@example.com','$2b$10$abc123examplehashhere','User Four',NULL,NULL,'user',NULL,'2025-05-11 01:15:34','2025-05-11 01:15:34',NULL,'0786329421'),(5,'21012478@st.phenikaa-uni.edu.vn','','Anh Nguyen Duc',NULL,NULL,'user','109210913742492563743','2025-05-09 18:49:45','2025-05-09 18:49:45','https://lh3.googleusercontent.com/a/ACg8ocIGYzkBLd5XulJi2C5f2Ue80wZil7FzabWNI5Bzy9ddj0AaIQ=s96-c','0965641265'),(6,'anhnguyen2k37@gmail.com','$2b$10$t34FvFL1FaRuRZg1Y7ujXOmpTMrvfSsJR6CrjOW42M/967E9Xi9Gm','anhnguyen2k37',NULL,NULL,'user',NULL,'2025-05-09 20:37:49','2025-05-09 20:37:49',NULL,'0112364879'),(7,'se.nhi.vuongdong@gmail.com','','Nguyen Anh',NULL,NULL,'user','112057046898094209264','2025-05-09 21:08:29','2025-05-09 21:08:29','https://lh3.googleusercontent.com/a/ACg8ocKXqvD4It1cvDMHG2_kLN5XVxCQKdgtUA1SOWMDGwLQlc0q8w=s96-c','0236548797'),(9,'user@example.com','$2b$10$RxaTcn2dMf47i3rFuJnMpeHwWTZNG0.rZeffmZ3UXHau0itgSdTtO','user',NULL,NULL,'user',NULL,'2025-05-09 21:41:14','2025-05-09 21:41:14',NULL,'0123456789'),(11,'user2@example.com','$2b$10$KfU4GFoh0Sm8LW6gTPGAa.T5IgAD/NzEqAtUd1VSZbFJzCN1JWryS','user2',NULL,NULL,'user',NULL,'2025-05-09 21:45:25','2025-05-09 21:45:25',NULL,'0214545865'),(12,'anhnguyen2k3@gmail.com','$2b$10$YC3iMpwdH9xcLBdMTSmM/uYpgTBUvCUnBtjsUU4QoAtODaovi6Lmu','anhnguyen2k3',NULL,NULL,'user',NULL,'2025-05-10 08:51:36','2025-05-10 08:51:36',NULL,'0123696565'),(13,'huynguyen2k3@gmail.com','$2b$10$6jRDGVdkIpgNYpr4gUInHeXm4oWkszUdtPbLbG1Z7psHp/ECo.uIS','huynguyen2k3',NULL,NULL,'user',NULL,'2025-05-14 13:51:47','2025-05-14 13:51:47',NULL,'0265486545');
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

-- Dump completed on 2025-05-15  7:45:31
