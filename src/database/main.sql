-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: localhost    Database: check_db
-- ------------------------------------------------------
-- Server version	8.0.30

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
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `payment_provider_id` int,
  `user_id` int,
  `ticket_id` int,
  `payment_method` enum("CASH", "ONLINE"),
  `amount` double,
  `status` enum("PENDING", "COMPLETED", "FAILED"),
  `created_at` datetime,
  `updated_at` datetime,
  FOREIGN KEY (`payment_provider_id`) REFERENCES `payment_providers` (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`)
);

INSERT INTO `users` (`first_name`, `last_name`, `email`, `password`, `phone`, `status`, `created_at`, `updated_at`) VALUES
('John', 'Doe', 'john.doe@example.com', 'hashed_password_1', '1234567890', 'ACTIVE', NOW(), NOW()),
('Jane', 'Smith', 'jane.smith@example.com', 'hashed_password_2', '0987654321', 'BLOCKED', NOW(), NOW()),
('Alice', 'Johnson', 'alice.johnson@example.com', 'hashed_password_3', '1112233445', 'ACTIVE', NOW(), NOW()),
('Bob', 'Williams', 'bob.williams@example.com', 'hashed_password_4', '2233445566', 'ACTIVE', NOW(), NOW()),
('Charlie', 'Brown', 'charlie.brown@example.com', 'hashed_password_5', '3344556677', 'BLOCKED', NOW(), NOW());

INSERT INTO `roles` (`role_name`) VALUES
('ROLE_ADMIN'),
('ROLE_USER');

INSERT INTO `user_role` (`role_id`, `user_id`) VALUES
(1, 1),
(2, 2),
(2, 3),
(1, 4),
(2, 5);

INSERT INTO `stations` (`name`, `image`, `wallpaper`, `descriptions`, `location`, `created_at`, `updated_at`) VALUES
('Station A', 'station_a.jpg', 'wallpaper_a.jpg', 'Main station for bus routes', 'City Center', NOW(), NOW()),
('Station B', 'station_b.jpg', 'wallpaper_b.jpg', 'Suburban station', 'North District', NOW(), NOW()),
('Station C', 'station_c.jpg', 'wallpaper_c.jpg', 'Central hub for commuters', 'South City', NOW(), NOW()),
('Station D', 'station_d.jpg', 'wallpaper_d.jpg', 'Small station for short routes', 'East District', NOW(), NOW()),
('Station E', 'station_e.jpg', 'wallpaper_e.jpg', 'Major stop for long-distance buses', 'West Side', NOW(), NOW());

INSERT INTO `bus_companies` (`company_name`, `image`, `descriptions`, `created_at`, `updated_at`) VALUES
('ABC Bus Co.', 'abc_logo.png', 'A leading bus company', NOW(), NOW()),
('XYZ Transport', 'xyz_logo.png', 'Reliable transport service', NOW(), NOW()),
('Speedy Travels', 'speedy_logo.png', 'Fast and efficient bus services', NOW(), NOW()),
('Elite Transport', 'elite_logo.png', 'Luxurious travel experience', NOW(), NOW()),
('Green Bus', 'green_logo.png', 'Eco-friendly and sustainable buses', NOW(), NOW());

INSERT INTO `buses` (`name`, `description`, `license_plate`, `capacity`, `company_id`, `created_at`, `updated_at`) VALUES
('Bus 101', 'Luxury bus for long routes', 'AB123CD', 50, 1, NOW(), NOW()),
('Bus 202', 'Economy bus', 'XY987ZT', 40, 2, NOW(), NOW()),
('Bus 303', 'Express bus for daily commuters', 'LM234GH', 60, 3, NOW(), NOW()),
('Bus 404', 'VIP bus', 'JK567MN', 30, 4, NOW(), NOW()),
('Bus 505', 'Sustainable bus with eco-friendly features', 'GH890XY', 45, 5, NOW(), NOW());

INSERT INTO `station_bus` (`station_id`, `bus_id`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO `routes` (`departure_station_id`, `arrival_station_id`, `price`, `duration`, `distance`, `created_at`, `updated_at`) VALUES
(1, 2, 20.0, 120, 50, NOW(), NOW()),
(2, 3, 30.0, 150, 75, NOW(), NOW()),
(3, 4, 40.0, 180, 100, NOW(), NOW()),
(4, 5, 50.0, 240, 120, NOW(), NOW()),
(5, 1, 60.0, 300, 150, NOW(), NOW());

INSERT INTO `schedules` (`route_id`, `bus_id`, `departure_time`, `arrival_time`, `available_seats`, `total_seats`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-05-10 08:00:00', '2025-05-10 10:00:00', 50, 50, 'AVAILABLE', NOW(), NOW()),
(2, 2, '2025-05-11 09:00:00', '2025-05-11 11:30:00', 40, 40, 'FULL', NOW(), NOW()),
(3, 3, '2025-05-12 10:00:00', '2025-05-12 12:30:00', 60, 60, 'AVAILABLE', NOW(), NOW()),
(4, 4, '2025-05-13 11:00:00', '2025-05-13 13:00:00', 30, 30, 'CANCELLED', NOW(), NOW()),
(5, 5, '2025-05-14 12:00:00', '2025-05-14 14:30:00', 45, 45, 'AVAILABLE', NOW(), NOW());

INSERT INTO `seats` (`bus_id`, `seat_number`, `seat_type`, `status`, `price_for_type_seat`, `created_at`, `updated_at`) VALUES
(1, '1A', 'VIP', 'AVAILABLE', 50.0, NOW(), NOW()),
(1, '1B', 'VIP', 'BOOKED', 50.0, NOW(), NOW()),
(2, '2A', 'STANDARD', 'AVAILABLE', 30.0, NOW(), NOW()),
(2, '2B', 'STANDARD', 'BOOKED', 30.0, NOW(), NOW()),
(3, '3A', 'LUXURY', 'AVAILABLE', 70.0, NOW(), NOW());

INSERT INTO `tickets` (`seat_id`, `schedule_id`, `departure_time`, `arrival_time`, `seat_type`, `price`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-05-10 08:00:00', '2025-05-10 10:00:00', 'VIP', 50.0, 'BOOKED', NOW(), NOW()),
(2, 2, '2025-05-11 09:00:00', '2025-05-11 11:30:00', 'STANDARD', 30.0, 'CANCELLED', NOW(), NOW()),
(3, 3, '2025-05-12 10:00:00', '2025-05-12 12:30:00', 'LUXURY', 70.0, 'BOOKED', NOW(), NOW()),
(4, 4, '2025-05-13 11:00:00', '2025-05-13 13:00:00', 'STANDARD', 30.0, 'BOOKED', NOW(), NOW()),
(5, 5, '2025-05-14 12:00:00', '2025-05-14 14:30:00', 'VIP', 50.0, 'CANCELLED', NOW(), NOW());

INSERT INTO `bus_reviews` (`bus_id`, `user_id`, `rating`, `review`, `created_at`, `updated_at`) VALUES
(1, 1, 5, 'Great service and comfortable ride!', NOW(), NOW()),
(2, 2, 4, 'Good value for money.', NOW(), NOW()),
(3, 3, 3, 'Decent but could be better.', NOW(), NOW()),
(4, 4, 2, 'The bus was delayed and uncomfortable.', NOW(), NOW()),
(5, 5, 5, 'Excellent experience, will travel again.', NOW(), NOW());

INSERT INTO `banners` (`banner_url`, `position`) VALUES
('banner1.jpg', 'TOP'),
('banner2.jpg', 'BOTTOM'),
('banner3.jpg', 'LEFT'),
('banner4.jpg', 'RIGHT'),
('banner5.jpg', 'CENTER');

INSERT INTO `bus_image` (`image_url`, `bus_id`) VALUES
('bus101_image1.jpg', 1),
('bus202_image1.jpg', 2),
('bus303_image1.jpg', 3),
('bus404_image1.jpg', 4),
('bus505_image1.jpg', 5);

INSERT INTO `cancellation_policies` (`descriptions`, `route_id`, `cancellation_time_limit`, `refund_percentage`, `created_at`, `updated_at`) VALUES
('Cancel up to 24 hours before departure for full refund', 1, 24, 100, NOW(), NOW()),
('Cancel up to 12 hours before departure for 50% refund', 2, 12, 50, NOW(), NOW()),
('No refund after departure', 3, 0, 0, NOW(), NOW()),
('Cancel up to 48 hours before departure for full refund', 4, 48, 100, NOW(), NOW()),
('Cancel up to 6 hours before departure for 25% refund', 5, 6, 25, NOW(), NOW());

INSERT INTO `payment_providers` (`provider_name`, `provider_type`, `api_endpoint`, `created_at`, `updated_at`) VALUES
('PayPal', 'E_WALLET', 'https://api.paypal.com', NOW(), NOW()),
('Stripe', 'CARD', 'https://api.stripe.com', NOW(), NOW()),
('BankTransfer', 'BANK_TRANSFER', 'https://api.banktransfer.com', NOW(), NOW()),
('QRPay', 'QR_CODE', 'https://api.qrpay.com', NOW(), NOW()),
('GooglePay', 'E_WALLET', 'https://api.googlepay.com', NOW(), NOW());

INSERT INTO `payments` (`payment_provider_id`, `user_id`, `ticket_id`, `payment_method`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'ONLINE', 50.0, 'COMPLETED', NOW(), NOW()),
(2, 2, 2, 'CASH', 30.0, 'PENDING', NOW(), NOW()),
(3, 3, 3, 'ONLINE', 70.0, 'COMPLETED', NOW(), NOW()),
(4, 4, 4, 'ONLINE', 30.0, 'FAILED', NOW(), NOW()),
(5, 5, 5, 'CASH', 50.0, 'PENDING', NOW(), NOW());
